import {TypeOneOrZero} from '../types'

export interface Db {
	id: number;
	idUser: string;
	idMeeting: number;
	statusOrganizer: TypeOneOrZero;
	statusWish: TypeOneOrZero;
	statusReadiness: TypeOneOrZero;
	status: TypeOneOrZero;
}

export interface Update {
  id?: number;
  idUser?: string;
  idMeeting?: number;
  statusOrganizer?: TypeOneOrZero;
  statusWish?: TypeOneOrZero;
  statusReadiness?: TypeOneOrZero;
  status?: TypeOneOrZero;
}

export interface Add {
	idUser: string;
	idMeeting: number;
	statusOrganizer: TypeOneOrZero;
	statusWish: TypeOneOrZero;
	statusReadiness: TypeOneOrZero;
	status: TypeOneOrZero;
}

export interface Desires {
	id?: number;
	idUser: string;
	idMeeting: number;
	statusOrganizer: TypeOneOrZero;
	statusWish: TypeOneOrZero;
	statusReadiness: TypeOneOrZero;
	status: TypeOneOrZero;
}