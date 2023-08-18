import {TypeObjectsFromDb} from '../types';

export interface Get<ObjectFromDB extends TypeObjectsFromDb> {
	code: 200 | 404;
	data: ObjectFromDB[] | undefined;
}

export interface Add {
	code: 200 | 404;
	data: [id: string] | undefined;
}