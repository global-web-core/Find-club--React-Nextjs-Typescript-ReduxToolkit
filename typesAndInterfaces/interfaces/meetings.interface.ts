import {TypeOneOrZero} from '../types';

export interface Db {
	id: number;
	idCountry: number;
	idCity: number;
	idInterest: number;
	idCategory: number;
	idLanguage: number;
	dateMeeting: string;
	placeMeeting: string | null;
	typeMeeting: number;
	accessMeeting: number;
	dateCreation: string;
	dateModification: string | null;
	status: TypeOneOrZero;
}

export interface Add {
	idCountry: number;
	idCity: number;
	idInterest: number;
	idCategory: number;
	idLanguage: number;
	dateMeeting: string;
	placeMeeting: string | null;
	typeMeeting: number;
	accessMeeting: number;
	dateCreation: string;
	dateModification?: string | null;
	status: TypeOneOrZero;
}

export interface Update {
  idCountry?: number;
  idCity?: number;
  idInterest?: number;
  idCategory?: number;
  idLanguage?: number;
  dateMeeting?: string;
  placeMeeting?: string | null;
  typeMeeting?: number;
  accessMeeting?: number;
  dateCreation?: string;
  dateModification?: string | null;
  status?: TypeOneOrZero;
}

export interface DataForm {
	idCountry: number;
	idCity: number;
	idInterest: number;
	idCategory: number;
	idLanguage: number;
	dateMeeting: string;
}

export interface MeetingsWithDependentData {
	id: number;
	country: string;
	city: string;
	interest: string;
	category: string;
	language: string;
	dateMeeting: string;
	placeMeeting: string | null;
	typeMeeting: number;
	accessMeeting: number;
	dateModification?: string | null;
	status: TypeOneOrZero;
}