export interface Meetings {
	id: number;
	idCountry: number;
	idCity: number;
	idInterest: number;
	idCategory: number;
	idLanguage: number;
	dateMeeting: Date;
	placeMeeting: string;
	typeMeeting: number;
	dateCreation: Date;
	DateModification?: Date;
	status: number;
}

export interface MeetingsWithDependentData {
	id: number;
	country: string;
	city: string;
	interest: string;
	category: string;
	language: string;
	dateMeeting: Date;
	placeMeeting: string;
	typeMeeting: number;
	DateModification?: Date;
	status: number;
}