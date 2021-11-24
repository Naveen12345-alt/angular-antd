import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable } from "rxjs"
import { map } from "rxjs/operators"

import { environment } from "@environments/environment"
import { Task } from "@app/_models"

@Injectable({ providedIn: "root" })
export class TaskService {
  constructor(private router: Router, private http: HttpClient) {}

  create(Task: Task) {
    if (localStorage.getItem("user"))
      return this.http.post(`${environment.apiUrl}/task/create`, Task)
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/task/alltasks`)
  }

  getById(id: string) {
    return this.http.get<Task>(`${environment.apiUrl}/task/${id}`)
  }

  update(Task: Task) {
    return this.http.post(`${environment.apiUrl}/task/update`, Task)
  }

  delete(id: string) {
    return this.http.post(`${environment.apiUrl}/task/delete`, id)
  }
}
