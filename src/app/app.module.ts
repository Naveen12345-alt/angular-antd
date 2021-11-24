import { BrowserModule } from "@angular/platform-browser"

/*AJAX */
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { JwtInterceptor, ErrorInterceptor } from "./_helpers"

/* Routing */
import { AppRoutingModule } from "./app-routing.module"

import { AppComponent } from "./app.component"
import { fakeBackendProvider } from "./_helpers"

/**
 * Ant-D (Ng-Zorro)
 */
import { NgZorroAntdModule } from "./ant-design.module"

/* Angular Material */
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout"

/* Components */
import { LogInComponent } from "./components/log-in/log-in.component"
import { RegisterComponent } from "./components/register/register.component"
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component"
import { ViewTaskComponent } from "./components/view-task/view-task.component"
import { TopNavbarComponent } from "./components/top-navbar/top-navbar.component"
import { DialogBoxComponent } from "./components/dialog-box/dialog-box.component"
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component"
import { NotificationsComponent } from "./components/notifications/notifications.component"
import { NZ_I18N } from "ng-zorro-antd/i18n"
import { en_US } from "ng-zorro-antd/i18n"
import { registerLocaleData } from "@angular/common"
import en from "@angular/common/locales/en"

registerLocaleData(en)

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ViewTaskComponent,
    TopNavbarComponent,
    DialogBoxComponent,
    ResetPasswordComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    NgZorroAntdModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider,
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
