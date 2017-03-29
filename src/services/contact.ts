import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth';

@Injectable()
export class ContactService {
	service: any;
	currentUser: any;

	constructor(private auth: AuthService) {
		this.auth.app.subscribe(
			app => this.service = app.service('contacts'));
		this.auth.currentUser.subscribe(
			currentUser => this.currentUser = currentUser);
	}

	list() {
		return Observable.create(observer => {
			this.service.find({
				query: {
					owner: this.currentUser._id
				}
			}).then((contacts) => {
				observer.next(contacts.data);
				observer.complete();
			});
		});
	}

	get(contactId) {
		return Observable.create(observer => {
			this.service.get(contactId).then((contact) => {
				observer.next(contact);
				observer.complete();
			});
		});
	}

	create(contactId) {
		return Observable.create(observer => {
			this.service.create({
				owner: this.currentUser._id,
				contact: contactId
			}).then((contact) => {
				this.service.create({
					owner: contactId,
					contact: this.currentUser._id
				}).then((contact) => {
					observer.next(contact);
					observer.complete();
				});
			});
		});
	}

	onCreated(cb) {
		this.service.on('created', (contact) => {
			if (contact.owner === this.currentUser._id) {
				cb(contact);
			}
		});
	}

	offCreated(cb) {
		this.service.off('created');
	}
}