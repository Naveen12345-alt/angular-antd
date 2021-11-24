import { Component, OnInit, ViewContainerRef } from "@angular/core"
import { Router } from "@angular/router"
import { User } from "@app/_models"
import { AccountService, NotificationService } from "@app/_services"
import { NzModalService } from "ng-zorro-antd/modal"
import { first } from "rxjs"
import { DialogBoxComponent } from "../dialog-box/dialog-box.component"

@Component({
  selector: "app-top-navbar",
  templateUrl: "./top-navbar.component.html",
  styleUrls: ["./top-navbar.component.scss"],
})
export class TopNavbarComponent implements OnInit {
  user: User
  t1 = ""

  constructor(
    private router: Router,
    private accountService: AccountService,
    private notificationService: NotificationService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {
    // redirect to home if already logged in
    this.accountService.user.subscribe((x) => (this.user = x))
  }

  openNotifications() {
    this.notificationService
      .getById(JSON.parse(localStorage.getItem("user"))["id"])
      .pipe(first())
      .subscribe((userTask) => {
        this.modal.create({
          nzTitle: `Notification`,
          nzContent: DialogBoxComponent,
          nzMaskClosable: true,
          nzViewContainerRef: this.viewContainerRef,
          nzClosable: false,
          nzComponentParams: {
            action: "Notification",
            local_data: userTask,
            options: [],
          },
          nzFooter: null,
        })
      })
  }

  logout() {
    this.accountService.logout()
  }

  ngOnInit() {}
}
