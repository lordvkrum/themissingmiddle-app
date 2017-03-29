import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth';

@Injectable()
export class UserService {
	service: any;

	constructor(private auth: AuthService) {
		this.auth.app.subscribe(
			app => this.service = app.service('users'));
	}

	list(params: any = {}) {
		return Observable.create(observer => {
			this.service.find(params).then((users) => {
				observer.next(users.data);
				observer.complete();
			});
		});
	}

	get(userId) {
		return Observable.create(observer => {
			this.service.get(userId).then((user) => {
				observer.next(user);
				observer.complete();
			});
		});
	}

	create(email, password) {
		return Observable.create(observer => {
			this.service.create({
				email: email,
				password: password
			}).then((user) => {
				observer.next(user);
				observer.complete();
			});
		});
	}
}