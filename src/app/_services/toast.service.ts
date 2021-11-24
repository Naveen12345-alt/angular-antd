import { Injectable } from "@angular/core"
import { NzMessageService } from "ng-zorro-antd/message"

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(private message: NzMessageService) {}

  config = {
    nzDuration: 3000,
    nzPauseOnHover: true,
    nzAnimate: true,
  }

  success(msg) {
    this.message.success(msg, this.config)
  }

  warn(msg) {
    this.message.error(msg, this.config)
  }
}
