import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { LocalService } from './local.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  public userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private localService: LocalService
  ) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(this.localService.getJsonValue('user'))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject?.value;
  }

  login(username, password) {
    // http://127.0.0.1:8000/account/api/retreive?username=naveen

    return this.http
      .post<User>(`${environment.apiUrl}/api/token/`, {
        username,
        password,
      })
      .pipe(
        map((user: any) => {
          this.localService.setJsonValue('user', JSON.stringify(user));
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          return user;
        })
      );
  }

  logout(token) {
    // remove user from local storage and set current user to null
    return this.http.post(`${environment.apiUrl}/account/api/logout`, {
      refresh: token,
    });
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/account/api/register`, user);
  }

  getUser(username: string) {
    return this.http
      .get(`${environment.apiUrl}/account/api/retreive?username=${username}`)
      .pipe(
        map((response: any) => {
          const user: User = {
            id: response[0]?.id,
            refresh: JSON.parse(this.localService.getJsonValue('user'))
              ?.refresh,
            token: JSON.parse(this.localService.getJsonValue('user'))?.access,
            username: response[0]?.username,
            password: response[0]?.password,
            firstName: response[0]?.first_name,
            lastName: response[0]?.last_name,
          };
          this.localService.setJsonValue('user', JSON.stringify(user));
          this.userSubject.next(user);
          return response;
        })
      );
  }

  getAllUser() {
    return this.http.get<User>(`${environment.apiUrl}/account/api/retreive`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, [id, params]);
  }

  delete(id: string) {
    // return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
    //   map((x) => {
    //     // auto logout if the logged in user deleted their own record
    //     if (id == this.userValue.id) {
    //       this.logout(this);
    //     }
    //     return x;
    //   })
    // );
  }
}
