import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, ToastService } from '@app/_services';
import { LocalService } from '@app/_services/local.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email = new FormControl('', [Validators.required]);
  constructor(
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService,
    private localService: LocalService
  ) {
    if (this.accountService.userValue) {
      this.router.navigate(['/view-task']);
    }
  }
  ngOnInit(): void {}

  redirectUser() {
    if (this.email.value) {
      this.toastService.success('Please enter new new password');
      this.localService.setJsonValue('resetUserPassword', this.email.value);
      this.router.navigate(['/reset-password']);
    }
  }
}
