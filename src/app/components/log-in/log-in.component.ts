import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { AccountService, ToastService } from "@app/_services"
import { first } from "rxjs/operators"

@Component({
  selector: "app-log-in",
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.scss"],
})
export class LogInComponent implements OnInit {
  hide = false
  form: FormGroup
  loading = false
  submitted = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService
  ) {
    if (this.accountService.userValue) {
      this.router.navigate(["/view-task"])
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls
  }

  onSubmit() {
    this.submitted = true

    // stop here if form is invalid
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
    }

    this.loading = true
    this.accountService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          this.toastService.success("Login Sucessful")
          const returnUrl =
            this.route.snapshot.queryParams["returnUrl"] || "/view-task"
          this.router.navigateByUrl(returnUrl)
        },
        error: (error) => {
          this.toastService.warn(error)
          this.loading = false
        },
      })
  }
}
