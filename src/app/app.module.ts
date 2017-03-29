import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppSettings } from './app.settings';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { ContactService } from '../services/contact';
import { MessageService } from '../services/message';
import { TwilioService } from '../services/twilio';
import { AlertService } from '../services/alert';
import { MomentPipe } from '../pipes/moment';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';
import { CallPage } from '../pages/call/call';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    ChatPage,
    CallPage,
    MomentPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    ChatPage,
    CallPage
  ],
  providers: [
    AppSettings,
    AuthService,
    UserService,
    ContactService,
    MessageService,
    TwilioService,
    AlertService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
