import { AfterViewInit, Component, OnInit } from "@angular/core"
import { NotificationService } from "@app/_services"
import { first } from "rxjs/operators"

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["name", "description"]
  ELEMENT_DATA = []

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService
      .getById(JSON.parse(localStorage.getItem("user"))["id"])
      .pipe(first())
      .subscribe((userTask) => {
        this.ELEMENT_DATA = userTask
      })
  }

  ngAfterViewInit() {}
}
