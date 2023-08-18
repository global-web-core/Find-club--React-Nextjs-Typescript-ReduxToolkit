import {TypeOneOrZero} from '../types'

export interface Db {
	id: number;
	idInterest: number;
	idCity: number;
	amountActivity: number;
	status: TypeOneOrZero;
}

// export interface InterestsByCity {
// 	id: number;
// 	idInterest: number;
// 	idCity: number;
// 	amountActivity: number;
// 	status: TypeOneOrZero;
// }