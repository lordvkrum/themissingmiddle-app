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

	list() {
		return Observable.create(observer => {
			this.service.find().then((users) => {
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

	listContacts() {
		return Observable.create(observer => {
			this.service.find().then((users) => {
				observer.next(users.data.filter(
					(user) => user._id !== this.currentUser._id));
				observer.complete();
			});
		});
	}
}