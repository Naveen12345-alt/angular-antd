import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, ToastService } from '@app/_services';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from '@app/_services/local.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService,
    private localService: LocalService
  ) {
    if (this.accountService.userValue) {
      this.router.navigate(['/view-task']);
    }
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      reEnteredpassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  resetPassword() {
    this.submitted = true;
    if (this.form.invalid) {
      this.warnResetPassword();
      return;
    }
    const email = this.localService.getJsonValue('resetUserPassword');
    const userId = JSON.parse(
      this.localService.getJsonValue(
        'angular-13-registration-login-example-users'
      )
    ).find((user) => user.username === email)?.['id'];
    if (this.f.password.value === this.f.reEnteredpassword.value) {
      this.localService.clear();
      this.accountService
        .update(userId, this.f.password.value)
        .pipe(first())
        .subscribe((_) => {
          this.toastService.success('Password updated successfully');
          this.router.navigate(['/login']);
        });
    } else {
      this.warnResetPassword();
    }
  }

  private warnResetPassword() {
    Object.values(this.form.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    this.toastService.warn('password and reEnteredpassword must be the same');
  }
}
