import {TypeOneOrZero} from '../types'

export interface InterestsByCity {
	id: number;
	idInterest: number;
	idCity: number;
	amountActivity: number;
	status: TypeOneOrZero;
}