//dialog-box.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService, ToastService } from '@app/_services';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { first } from 'rxjs';

export interface UsersData {
  name: string;
  id: number;
  date: Date;
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {
  @Input() action: string;
  @Input() local_data: any;
  form: FormGroup;
  @Input() options: string[];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private toastService: ToastService,
    private modal: NzModalRef
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [
        this.local_data?.task_heading,
        [Validators.required, Validators.maxLength(30)],
      ],
      description: [
        this.local_data?.task_description,
        [Validators.required, Validators.maxLength(250)],
      ],
      user: [this.local_data?.task_assigned_to, [Validators.required]],
      date: [this.local_data?.task_notify_time],
    });
  }

  get f() {
    return this.form.controls;
  }

  doAction() {
    const id = this.local_data.id;
    this.local_data = {
      task_heading: this.f.name.value,
      task_notify_time: this.f.date.value,
      task_description: this.f.description.value,
      task_assigned_to: this.f.user.value,
    };
    if (this.form.invalid) {
      this.toastService.warn('Invalid Form');
      return;
    }

    if (this.action === 'Add') {
      this.taskService.create(this.local_data).pipe(first()).subscribe();
    } else if (this.action === 'Update') {
      this.taskService.update(id, this.local_data).pipe(first()).subscribe();
    } else if (this.action === 'Delete') {
      this.taskService.delete(id).pipe(first()).subscribe();
    }
    this.toastService.success(`Row ${this.action} done successfully`);
    this.modal.destroy();
  }

  closeDialog() {
    this.modal.destroy();
  }
}
