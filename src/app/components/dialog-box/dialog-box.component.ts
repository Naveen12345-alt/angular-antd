//dialog-box.component.ts
import { Component, Input, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { TaskService, ToastService } from "@app/_services"
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal"
import { first } from "rxjs"

export interface UsersData {
  name: string
  id: number
  date: Date
}

@Component({
  selector: "app-dialog-box",
  templateUrl: "./dialog-box.component.html",
  styleUrls: ["./dialog-box.component.scss"],
})
export class DialogBoxComponent implements OnInit {
  @Input() action: string
  @Input() local_data: any
  form: FormGroup
  @Input() options: string[]

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private toastService: ToastService,
    private modal: NzModalRef
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [
        this.local_data?.name,
        [Validators.required, Validators.maxLength(30)],
      ],
      description: [
        this.local_data?.description,
        [Validators.required, Validators.maxLength(250)],
      ],
      user: [this.local_data?.user, [Validators.required]],
      date: [this.local_data?.date],
    })
  }

  get f() {
    return this.form.controls
  }

  doAction() {
    this.local_data = {
      name: this.f.name.value,
      date: this.f.date.value,
      description: this.f.description.value,
      user: this.f.user.value,
      id: this.local_data?.id,
    }
    if (this.form.invalid) {
      this.toastService.warn("Invalid Form")
      return
    }

    if (this.action === "Add") {
      this.taskService.create(this.local_data).pipe(first()).subscribe()
    } else if (this.action === "Update") {
      this.taskService.update(this.local_data).pipe(first()).subscribe()
    } else if (this.action === "Delete") {
      this.taskService.delete(this.local_data).pipe(first()).subscribe()
    }
    this.toastService.success(`Row ${this.action} done successfully`)
    this.modal.destroy()
  }

  closeDialog() {
    this.modal.destroy()
  }
}
