import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {
	public get SERVER_URL(): any {
		return 'https://themissingmiddle-backend.herokuapp.com';
	}
}