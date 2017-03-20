import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {
	transform(date): moment.Moment {
		return (<any>moment(date)).format('MMM Do, hh:mm:ss');
	}
}