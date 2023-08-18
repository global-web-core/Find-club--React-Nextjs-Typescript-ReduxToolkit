import {TypeOneOrZero} from '../types'

export interface CityByCountries {
	id: number;
	idCountry: number;
	idCity: number;
	status: TypeOneOrZero;
}