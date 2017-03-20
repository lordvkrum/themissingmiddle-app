import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth';

@Injectable()
export class MessageService {
	service: any;

	constructor(private auth: AuthService) {
		this.auth.app.subscribe(
			app => this.service = app.service('messages'));
	}

	list() {
		return Observable.create(observer => {
			this.service.find({
				query: {
					$sort: { createdAt: 1 },
					$limit: 25
				}
			}).then((messages) => {
				observer.next(messages.data);
				observer.complete();
			});
		});
	}

	create(text) {
		return Observable.create(observer => {
			this.service.create({
				text: text
			}).then((message) => {
				observer.next(message);
				observer.complete();
			});
		});
	}

	onCreated(cb) {
		this.service.on('created', (message) => {
			cb(message);
		});
	}

	offCreated(cb) {
		this.service.off('created');
	}
}