import {TypeOneOrZero} from '../types'

export interface City {
	id: number;
	nameCity: string;
	route: string;
	status: TypeOneOrZero;
	translation?: string;
}