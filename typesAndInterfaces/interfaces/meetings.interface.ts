export interface Db {
	id: number;
	idCountry: number;
	idCity: number;
	idInterest: number;
	idCategory: number;
	idLanguage: number;
	dateMeeting: Date;
	placeMeeting: string | null;
	typeMeeting: number;
	accessMeeting: number;
	dateCreation: Date;
	dateModification: Date | null;
	status: number;
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
	dateModification?: Date | null;
	status: number;
}

export interface Update {
  idCountry?: number;
  idCity?: number;
  idInterest?: number;
  idCategory?: number;
  idLanguage?: number;
  dateMeeting?: Date;
  placeMeeting?: string | null;
  typeMeeting?: number;
  accessMeeting?: number;
  dateCreation?: Date;
  dateModification?: Date | null;
  status?: number;
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
	dateMeeting: Date;
	placeMeeting: string | null;
	typeMeeting: number;
	accessMeeting: number;
	dateModification?: Date | null;
	status: number;
}