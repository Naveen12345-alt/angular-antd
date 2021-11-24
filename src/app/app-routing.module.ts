import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LogInComponent } from "./components/log-in/log-in.component"
import { RegisterComponent } from "./components/register/register.component"
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component"
import { ViewTaskComponent } from "./components/view-task/view-task.component"
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component"
import { NotificationsComponent } from "./components/notifications/notifications.component"
import { AuthGuard } from "./_helpers"

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "login", component: LogInComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  {
    path: "view-task",
    component: ViewTaskComponent,
    canActivate: [AuthGuard],
  },
  { path: "reset-password", component: ResetPasswordComponent },
  {
    path: "notifications",
    component: NotificationsComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
