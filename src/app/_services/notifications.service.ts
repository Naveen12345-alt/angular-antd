import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { Notification } from "@app/_models"
import { environment } from "@environments/environment"
import { BehaviorSubject, Observable } from "rxjs"

@Injectable({ providedIn: "root" })
export class NotificationService {
  constructor(private router: Router, private http: HttpClient) {}

  getById(id: string) {
    return this.http.get<Notification[]>(
      `${environment.apiUrl}/notifications/${id}`
    )
  }
}
