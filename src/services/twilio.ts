import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppSettings } from '../app/app.settings';

@Injectable()
export class TwilioService {
  _twilio: any;
  token: any;
  callStatus = new ReplaySubject<any>(1);
  activeConnection: any;
  callAnswered: boolean;
  deviceStarted: boolean;

  constructor(private http: Http,
    private settings: AppSettings) {
    const _window: any = window;
    this._twilio = _window.Twilio;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private extractError(error): any {
    throw error._body;
  }

  getToken(userId) {
    return this.http.post(`${this.settings.SERVER_URL}/requestTwilioToken`, {
      userId: userId
    }).map(this.extractData)
      .catch(this.extractError);
  }

  initDevice() {
    this._twilio.Device.setup(this.token);
    if (this.deviceStarted) {
      return;
    }
    this._twilio.Device.incoming(this.inboundForeground.bind(this));
    this._twilio.Device.connect((connection) => {
      console.log('connect call', connection);
      this.activeConnection = connection;
      if (!this.callAnswered) {
        this.callStatus.next({
          status: 'outbound',
          To: 'client:' + connection.message.contactId
        });
      }
    });
    this._twilio.Device.cancel(this.disconnectCall.bind(this));
    this._twilio.Device.disconnect(this.disconnectCall.bind(this));
    const _window: any = window;
    _window.document.addEventListener('pause', () => {
      this._twilio.Device.incoming(this.inboundBackground.bind(this));
    }, false);
    _window.document.addEventListener('resume', () => {
      this._twilio.Device.incoming(this.inboundForeground.bind(this));
    }, false);
    this.deviceStarted = true;
  }

  disconnectCall(connection) {
    console.log('disconnect call');
    if (this.activeConnection) {
      this.callStatus.next({
        status: 'disconnected'
      });
    }
    this.callAnswered = false;
  }

  inboundForeground(connection) {
    console.log('inbound call');
    this.activeConnection = connection;
    this.callStatus.next({
      status: 'inbound',
      From: this.activeConnection.parameters.From,
      To: this.activeConnection.parameters.To
    });
  }

  inboundBackground(connection) {
    console.log('inbound call background');
    this._twilio.Connection.showNotification();
    this.inboundForeground(connection);
  }

  start(userId) {
    return Observable.create(observer => {
      this.getToken(userId)
        .subscribe(
        (result: any) => {
          this.token = result.token;
          this.initDevice();
          observer.next(result.token);
          observer.complete();
        });
    });
  }

  makeCall(contact) {
    const connection = this._twilio.Device.connect({
      contactId: contact._id
    });
    connection.accept(() => {
      console.log('accept active make call');
    });
  }

  connectCall() {
    console.log('connect method call');
    if (this.activeConnection) {
      this.activeConnection.accept();
    }
    this.callAnswered = true;
    this.callStatus.next({
      status: 'answered'
    });
  }

  rejectCall() {
    if (this.activeConnection) {
      this.activeConnection.reject();
      this.activeConnection = null;
      this.callStatus.next({
        status: 'disconnected'
      });
    }
  }

  hangupCall() {
    this._twilio.Device.disconnectAll();
  }

  clearClient() {
    this._twilio.Device.destroy();
  }

  toggleMicrophone(status) {
    this.activeConnection.mute(status);
  }

}