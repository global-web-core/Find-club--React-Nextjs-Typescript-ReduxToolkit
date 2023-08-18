import {TypeOneOrZero} from '../types'

export interface Db {
	id: number;
	nameCity: string;
	route: string;
	status: TypeOneOrZero;
}

// export interface City {
// 	id: number;
// 	nameCity: string;
// 	route: string;
// 	status: TypeOneOrZero;
// 	translation?: string;
// }