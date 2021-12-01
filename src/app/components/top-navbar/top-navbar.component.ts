import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { AccountService, NotificationService } from '@app/_services';
import { LocalService } from '@app/_services/local.service';
import { DataService } from '@app/_services/websoket.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, first, map, Subject, takeUntil, tap } from 'rxjs';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss'],
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  user: User;
  t1 = '';
  destroyed$ = new Subject();

  constructor(
    private router: Router,
    private accountService: AccountService,
    private notificationService: NotificationService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private socketService: DataService,
    private localService: LocalService
  ) {
    // redirect to home if already logged in
    this.accountService.user.subscribe((x) => {
      this.user = x;
    });
    this.socketService
      .dataUpdates$()
      .subscribe((messages) => this.openNotifications());
  }

  ngOnInit() {}

  ngOnDestroy() {
    // this.destroyed$.next('1');
  }

  openNotifications() {
    this.notificationService
      .getById(JSON.parse(this.localService.getJsonValue('user'))['username'])
      .pipe(first())
      .subscribe((userTask) => {
        this.modal.create({
          nzTitle: `Notification`,
          nzContent: DialogBoxComponent,
          nzMaskClosable: true,
          nzViewContainerRef: this.viewContainerRef,
          nzClosable: false,
          nzComponentParams: {
            action: 'Notification',
            local_data: userTask,
            options: [],
          },
          nzFooter: null,
        });
      });
  }

  logout() {
    const refresh = this.accountService.userValue.refresh;
    this.accountService.logout(refresh).subscribe((data) => {
      this.localService.clear();
      console.log(data);
      this.accountService.userSubject.next(null);
      this.router.navigate(['/login']);
    });
  }
}
