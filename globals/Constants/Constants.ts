import { TypeController, TypeMethodHttp } from "../../types";

const isDeveloperMode = process.env.NODE_ENV !== 'production';
const url = isDeveloperMode ? 'http://localhost' : '//api.myApiInInternet.ru';
// const url = isDeveloperMode ? '//localhost' : '//api.myApiInInternet.ru';  It is original version

const API = {
	url: `${url}/api`,
	assets: `${url}/assets`,
	documents: `${url}/documents`,
	documentsExcel: `${url}/exportexcel`,
	key: process.env.NEXT_PUBLIC_API_KEY,
	version: '1.0.0'
};

const requestConditionType = {
	EQUAL: 0,
	NOT_EQUAL: 1,
	LESS: 2,
	MORE: 3,
	IS_NULL: 4,
	NOT_NULL: 5,
	LIKE: 6
};

const requestConcatinationType: Status = {
	AND: 0,
	OR: 1
};

const requestOderType: Status = {
	ASC: 0,
	DESC: 1
};

const comonStatus: Status = {
	IN_ACTIVE: 0,
	ACTIVE: 1
};

const settingDefault = {
	LANGUAGE: 'ru'
};

const activyStatus: Status = {
	ACTIVE: 1,
	NOT_ACTIVE: 0
};

const statusOrganizer: Status = {
	MY: 1,
	ANOTHER: 0
};

const statusWish: Status = {
	WISH: 1,
	NOWISH: 0
};

const statusReadiness: Status = {
	READINESS: 1,
	NOREADINESS: 0
};

const typeMeeting: Status = {
	OWN: 0,
	ALIEN: 1
};

const nameYourMeetingsFilter = {
	all: 'all',
	my: 'my',
	other: 'other',
	passed: 'passed'
};

const nameBasicFilter = {
	month: 'month',
	week: 'week',
	day: 'day'
};

const pagination = {
	limit: 20
};

const namePagination = {
	meetingsList: 'meetingsList'
};

const statusFetch = {
	succeeded: 'succeeded',
	failed: 'failed',
	loading: 'loading',
};

const accessMeeting = {
	all: 0,
	ready: 1,
	wishing: 2,
};

const navigationMeetings = {
	country: 'country',
	city: 'city',
	interest: 'interest',
	category: 'category',
}

const controllers: Record<TypeController, TypeController> = {
	countries: 'countries',
	accounts: 'accounts',
	categories: 'categories',
	categoriesbyinterests: 'categoriesbyinterests',
	cities: 'cities',
	citiesbycountries: 'citiesbycountries',
	desires: 'desires',
	interests: 'interests',
	interestsbycities: 'interestsbycities',
	languages: 'languages',
	languagetranslation: 'languagetranslation',
	meetings: 'meetings',
	sessions: 'sessions',
	users: 'users',
	verificationtokens: 'verificationtokens',
}

const methodHttp: Record<TypeMethodHttp, TypeMethodHttp> = {
	get: 'get',
	getCount: 'getCount',
	add: 'add',
	update: 'update',
	delete: 'delete',
}


export {
	API,
	url,
	requestConditionType,
	requestConcatinationType,
	requestOderType,
	comonStatus,
	settingDefault,
	activyStatus,
	typeMeeting,
	statusOrganizer,
	statusWish,
	statusReadiness,
	nameYourMeetingsFilter,
	nameBasicFilter,
	pagination,
	namePagination,
	statusFetch,
	accessMeeting,
	navigationMeetings,
	controllers,
	methodHttp
};

interface Status {
	[key:string]: 0 | 1,
}