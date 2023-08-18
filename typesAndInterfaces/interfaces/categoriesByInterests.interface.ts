import {TypeOneOrZero} from '../types'

export interface Db {
	id: number;
	idInterest: number;
	idCategory: number;
	status: TypeOneOrZero;
}

// export interface CategoryByInterest {
// 	id: number;
// 	idInterest: number;
// 	idCategory: number;
// 	status: TypeOneOrZero;
// 	translation?: string;
// }