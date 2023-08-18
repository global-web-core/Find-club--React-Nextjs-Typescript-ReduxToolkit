import {TypeOneOrZero} from '../types'

export interface Desires {
	id?: number;
	idUser: string;
	idMeeting: number;
	statusOrganizer: TypeOneOrZero;
	statusWish: TypeOneOrZero;
	statusReadiness: TypeOneOrZero;
	status: TypeOneOrZero;
}