import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppSettings } from './app.settings';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { MessageService } from '../services/message';
import { MomentPipe } from '../pipes/moment';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ChatPage,
    MomentPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ChatPage
  ],
  providers: [
    AppSettings,
    AuthService,
    UserService,
    MessageService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
