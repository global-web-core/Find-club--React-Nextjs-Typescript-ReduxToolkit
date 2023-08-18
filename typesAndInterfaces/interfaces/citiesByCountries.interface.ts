import {TypeOneOrZero} from '../types'

export interface Db {
	id: number;
	idCountry: number;
	idCity: number;
	status: TypeOneOrZero;
}

// export interface CityByCountries {
// 	id: number;
// 	idCountry: number;
// 	idCity: number;
// 	status: TypeOneOrZero;
// }