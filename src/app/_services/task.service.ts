import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Task } from '@app/_models';
import { LocalService } from './local.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private localService: LocalService
  ) {}

  create(Task: Task) {
    if (this.localService.getJsonValue('user'))
      return this.http.post(`${environment.apiUrl}/task/api/create`, Task);
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/task/api`);
  }

  getById(id: string) {
    return this.http.get<Task>(`${environment.apiUrl}/task/${id}`);
  }

  update(id, Task: Task) {
    return this.http.put(`${environment.apiUrl}/task/api/update/${id}`, Task);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/task/api/delete/${id}`);
  }
}
