import {TypeOneOrZero} from '../types'

export interface Db {
	id: number;
	nameCategory: string;
	route: string;
	status: TypeOneOrZero;
}

// export interface Category {
// 	id: number;
// 	nameCategory: string;
// 	route: string;
// 	status: TypeOneOrZero;
// 	translation?: string;
// }