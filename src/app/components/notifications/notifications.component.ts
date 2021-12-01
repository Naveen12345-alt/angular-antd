import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/_services';
import { LocalService } from '@app/_services/local.service';
import { DataService } from '@app/_services/websoket.service';
import { catchError, first, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'description'];
  ELEMENT_DATA = [];

  constructor(
    private notificationService: NotificationService,
    private socketService: DataService,
    private localService: LocalService
  ) {
    // this.socketService.connect();
  }

  ngOnInit() {
    this.notificationService
      .getById(JSON.parse(this.localService.getJsonValue('user'))['username'])
      .pipe(first())
      .subscribe((userTask) => {
        console.log(userTask);
        this.ELEMENT_DATA = userTask;
      });
  }

  ngAfterViewInit() {}
}
