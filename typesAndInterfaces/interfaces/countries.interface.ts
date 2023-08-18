import {TypeOneOrZero} from '../types'

export interface Country {
	id: number;
	nameCountry: string;
	route: string;
	status: TypeOneOrZero;
	translation?: string;
}