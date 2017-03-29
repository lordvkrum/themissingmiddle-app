import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppSettings } from '../app/app.settings';

@Injectable()
export class AuthService {
	_app: any;
	currentUser = new ReplaySubject<any>(1);
	app = new ReplaySubject<any>(1);

	constructor(private settings: AppSettings) {
		const _window: any = window;
		const socket = _window.io(settings.SERVER_URL);
		this._app = _window.feathers()
			.configure(_window.feathers.socketio(socket))
			.configure(_window.feathers.hooks())
			.configure(_window.feathers.authentication({
				storage: _window.localStorage
			}));
		this.app.next(this._app);
	}

	login(email, password) {
		return Observable.create(observer => {
			this._app.authenticate({
				email: email,
				password: password,
				type: 'local'
			}).then((user) => {
				this.currentUser.next(user.data);
				observer.next(user.data);
				observer.complete();
			});
		});
	}

	logout() {
		return Observable.create(observer => {
			this._app.logout();
			observer.next('');
			observer.complete();
		});
	}
}