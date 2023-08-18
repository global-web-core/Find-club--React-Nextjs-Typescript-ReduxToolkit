import {TypeOneOrZero} from '../types'

export interface Db {
	id: number;
	interest: string;
	route: string;
	status: TypeOneOrZero;
}

// export interface Interest {
// 	id: number;
// 	interest: string;
// 	route: string;
// 	status: TypeOneOrZero;
// 	translation?: string;
// }