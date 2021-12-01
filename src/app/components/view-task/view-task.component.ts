import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AccountService, TaskService } from '@app/_services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, first, switchMap } from 'rxjs/operators';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

export interface UsersData {
  task_heading: string;
  id: number;
  task_assigned_to: string;
  task_notify_time: string;
}

const ELEMENT_DATA: UsersData[] = [];

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss'],
})
export class ViewTaskComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'user', 'date', 'action'];
  options: string[] = [];
  filterUsername: string[] = [];
  taskServiceSubs: Subscription;

  dataSource: UsersData[] = ELEMENT_DATA;
  filteredData: UsersData[] = ELEMENT_DATA;

  constructor(
    private taskService: TaskService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.taskService
      .getAll()
      .pipe(first())
      .subscribe((taskData: any) => {
        this.dataSource = taskData ?? [];
        this.filteredData = this.dataSource;
      });

    this.accountService
      .getAllUser()
      .pipe(first())
      .subscribe((res: any) => {
        this.options = res.map((data) => data.username.toLowerCase()) ?? [];
      });
  }
  ngAfterViewInit() {}

  ngOnDestroy() {}

  public doFilter = (value: string[]) => {
    this.filterUsername = value;
    const newDataSource: UsersData[] = [];
    if (value.length) {
      this.filterUsername.forEach((username) => {
        const context = this.dataSource.filter(
          (item) => item.task_assigned_to === username
        );
        newDataSource.push(...context);
      });
    } else {
      newDataSource.push(...this.dataSource);
    }

    this.filteredData = newDataSource;
  };

  openDialog(action, obj, array) {
    const modal = this.modal.create({
      nzTitle: `${action} Row`,
      nzContent: DialogBoxComponent,
      nzMaskClosable: false,
      nzViewContainerRef: this.viewContainerRef,
      nzClosable: false,
      nzComponentParams: {
        action: action,
        local_data: obj,
        options: array,
      },
      nzFooter: null,
    });

    modal.afterClose.subscribe((_) => {
      this.taskService
        .getAll()
        .pipe(first())
        .subscribe((taskData: any) => {
          this.dataSource = taskData ?? [];
          this.filteredData = this.dataSource;
          // this.doFilter(this.filterUsername)
        });
    });
  }
}
