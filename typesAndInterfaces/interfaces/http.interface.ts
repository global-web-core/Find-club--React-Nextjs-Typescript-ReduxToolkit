import {TypeObjectsFromDb} from '../types';

type codeAnswer = 200 | 404;

export interface Get<ObjectFromDB extends TypeObjectsFromDb> {
	code: codeAnswer;
	data: ObjectFromDB[] | undefined;
}

export interface GetCount {
	code: codeAnswer;
	data: {countRowsSqlRequest: string}[] | undefined;
}

export interface Add {
	code: codeAnswer;
	data: {id: string} | undefined;
}

export interface Update {
	code: codeAnswer;
	data: null | undefined;
}

export interface Remove {
	code: 200;
	data: null;
}