import { Injectable } from "@angular/core"
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from "@angular/common/http"
import { Observable, of, throwError } from "rxjs"
import { delay, materialize, dematerialize } from "rxjs/operators"

// array in local storage for registered users
const usersKey = "angular-13-registration-login-example-users"
const tasksKey = "angular-13-registration-task-example-users"
let users = JSON.parse(localStorage.getItem(usersKey)) || []
let tasks = JSON.parse(localStorage.getItem(tasksKey)) || []

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request

    return handleRoute()

    function handleRoute() {
      switch (true) {
        case url.endsWith("/users/authenticate") && method === "POST":
          return authenticate()
        case url.endsWith("/users/register") && method === "POST":
          return register()
        case url.endsWith("/users") && method === "GET":
          return getUsers()
        case url.match(/\/users\/\d+$/) && method === "GET":
          return getUserById()
        case url.match(/\/users\/\d+$/) && method === "PUT":
          return updateUser()
        case url.match(/\/users\/\d+$/) && method === "DELETE":
          return deleteUser()
        case url.endsWith("/task/create") && method === "POST":
          return registerTask()
        case url.endsWith("/task/alltasks") && method === "GET":
          return getTask()
        case url.endsWith("/task/delete") && method === "POST":
          return deleteTask()
        case url.endsWith("/task/update") && method === "POST":
          return updateTask()
        case url.match(/\/notifications\/\d+$/) && method === "GET":
          return notificationsById()
        default:
          // pass through any requests not handled above
          return next.handle(request)
      }
    }

    // route functions

    function authenticate() {
      const { username, password } = body
      const user = users.find(
        (x) => x.username === username && x.password === password
      )
      if (!user) return error("Username or password is incorrect")
      return ok({
        ...basicDetails(user),
        token: "fake-jwt-token",
      })
    }

    function register() {
      const user = body

      if (users.find((x) => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken')
      }

      user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1
      users.push(user)
      localStorage.setItem(usersKey, JSON.stringify(users))
      return ok()
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized()
      return ok(users.map((x) => basicDetails(x)))
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized()

      const user = users.find((x) => x.id === idFromUrl())
      return ok(basicDetails(user))
    }

    function updateUser() {
      let params = body
      let user = users.find((x) => x.id === params[0])

      // only update password if entered
      if (params[1]) {
        user["password"] = params[1]
        users.splice(users.findIndex((x) => x.id === params[0]))
        users.push(user)
      }

      // update and save user
      localStorage.setItem(usersKey, JSON.stringify(users))

      return ok()
    }

    function deleteUser() {
      if (!isLoggedIn()) return unauthorized()

      users = users.filter((x) => x.id !== idFromUrl())
      localStorage.setItem(usersKey, JSON.stringify(users))
      return ok()
    }

    // tasks backend
    function updateTask() {
      const taskId = +body.id
      tasks.splice(
        tasks.findIndex((x) => x.id === taskId),
        1
      )
      return registerTask(taskId)
    }

    function deleteTask() {
      const taskId = +body.id
      tasks.splice(
        tasks.findIndex((x) => x.id === taskId),
        1
      )
      localStorage.setItem(tasksKey, JSON.stringify(tasks))
      return getTask()
    }

    function registerTask(id = -1) {
      const task = body
      delete task.action

      if (tasks.find((x) => x.id === task.id)) {
        return error('Task Id "' + task.id + '" is already taken')
      }

      task.id =
        id !== -1
          ? id
          : tasks.length
          ? Math.max(...tasks.map((x) => x.id)) + 1
          : 1
      tasks.push(task)
      localStorage.setItem(tasksKey, JSON.stringify(tasks))
      return getTask()
    }

    function getTask() {
      if (!isLoggedIn()) return unauthorized()
      return ok(
        JSON.stringify([
          localStorage.getItem(tasksKey),
          localStorage.getItem(usersKey),
        ])
      )
    }

    //notifications
    function notificationsById() {
      if (!isLoggedIn()) return unauthorized()

      const user = users.find((x) => x.id === idFromUrl())
      return notificationDetails(user)
    }

    // helper functions
    function notificationDetails(user) {
      const { username } = user
      const userTask = tasks
        .filter((task) => task.user === username)
        .filter((task) => new Date(task.date) <= new Date())
        .map((task) => {
          return {
            id: task.id,
            name: task.name,
            description: task.description,
            date: task.date,
          }
        })
      return ok(userTask)
    }

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)) // delay observable to simulate server api call
    }

    function error(message) {
      return throwError({ error: { message } }).pipe(
        materialize(),
        delay(500),
        dematerialize()
      ) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function unauthorized() {
      return throwError({
        status: 401,
        error: { message: "Unauthorized" },
      }).pipe(materialize(), delay(500), dematerialize())
    }

    function basicDetails(user) {
      const { id, username, firstName, lastName } = user
      return { id, username, firstName, lastName }
    }

    function isLoggedIn() {
      return headers.get("Authorization") === "Bearer fake-jwt-token"
    }

    function idFromUrl() {
      const urlParts = url.split("/")
      return parseInt(urlParts[urlParts.length - 1])
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
}
