import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppSettings } from './app.settings';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [
    AppSettings,
    AuthService,
    UserService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
