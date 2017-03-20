import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth';

@Injectable()
export class UserService {
	service: any;
	currentUser: any;

	constructor(private auth: AuthService) {
		this.auth.app.subscribe(
			app => this.service = app.service('users'));
		this.auth.currentUser.subscribe(
			currentUser => this.currentUser = currentUser);
	}

	getUsers() {
		return Observable.create(observer => {
			this.service.find().then((users) => {
				observer.next(users.data);
				observer.complete();
			});
		});
	}

	getContacts() {
		return Observable.create(observer => {
			this.service.find().then((users) => {
				observer.next(users.data.filter(
					(user) => user._id !== this.currentUser._id));
				observer.complete();
			});
		});
	}
}