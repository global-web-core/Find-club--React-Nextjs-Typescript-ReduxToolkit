import { Constants, Http } from '../../globals';

const getAll = async () => await Http.get('meetings', {});
const getByDataForm	= async (dataMeeting)		=> await Http.get('meetings', {conditions:[
	{k:'idCountry',v:dataMeeting.idCountry},
	{k:'idCity',v:dataMeeting.idCity},
	{k:'idInterest',v:dataMeeting.idInterest},
	{k:'idCategory',v:dataMeeting.idCategory},
	{k:'idLanguage',v:dataMeeting.idLanguage},
	{k:'dateMeeting',v:dataMeeting.dateMeeting}
]});
const getByIdUser	= async (idUser)		=> await Http.get('meetings', {conditions:[{k:'idUser',v:idUser}]});
const getByIdMeeting	= async (id)		=> await Http.get('meetings', {conditions:[{k:'id',v:id}]});
const getByIdMeetingLessDate	= async (id, date)		=> await Http.get('meetings', {conditions:[
	{k:'id',v:id},
	{k:'dateMeeting',v:date,op:Constants.requestConditionType.LESS}]
});
const getByIdMeetingMoreDate	= async (id, date)		=> await Http.get('meetings', {conditions:[
	{k:'id',v:id},
	{k:'dateMeeting',v:date,op:Constants.requestConditionType.MORE}]
});
const getPageByDateMeetingsAndCountry = async (idCountry, idLanguage, startDate, endDate, page?) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:Constants.requestOderType.ASC}],
	limits:[
		{limit:Constants.pagination.limit, offset:(page ? (page - 1) * Constants.pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCountry	= async (idCountry, idLanguage, startDate, endDate)		=> await Http.getCount('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCountry = async (idCountry, idLanguage, startDate, endDate) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndCity = async (idCountry, idCity, idLanguage, startDate, endDate, page?) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:Constants.requestOderType.ASC}],
	limits:[
		{limit:Constants.pagination.limit, offset:(page ? (page - 1) * Constants.pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCity	= async (idCountry, idCity, idLanguage, startDate, endDate)		=> await Http.getCount('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCity = async (idCountry, idCity, idLanguage, startDate, endDate) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndInterest = async (idCountry, idCity, idInterest, idLanguage, startDate, endDate, page?) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:Constants.requestOderType.ASC}],
	limits:[
		{limit:Constants.pagination.limit, offset:(page ? (page - 1) * Constants.pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndInterest	= async (idCountry, idCity, idInterest, idLanguage, startDate, endDate)		=> await Http.getCount('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndInterest = async (idCountry, idCity, idInterest, idLanguage, startDate, endDate) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndCategory = async (idCountry, idCity, idInterest, idCategory, idLanguage, startDate, endDate, page?) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idCategory',v:idCategory},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:Constants.requestOderType.ASC}],
	limits:[
		{limit:Constants.pagination.limit, offset:(page ? (page - 1) * Constants.pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCategory	= async (idCountry, idCity, idInterest, idCategory, idLanguage, startDate, endDate)		=> await Http.getCount('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idCategory',v:idCategory},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCategory = async (idCountry, idCity, idInterest, idCategory, idLanguage, startDate, endDate) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idCategory',v:idCategory},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const add = async (data) => await Http.post('meetings', {data});
const update = async (id, data) => await Http.put('meetings', {data,conditions:[{k:'id',v:id}]});

export {
	getAll,
	getByDataForm,
	getByIdUser,
	getByIdMeeting,
	getByIdMeetingLessDate,
	getByIdMeetingMoreDate,
	add,
	update,
	getPageByDateMeetingsAndCountry,
	getCountByDateMeetingAndCountry,
	getOneByDateMeetingsAndCountry,
	getPageByDateMeetingsAndCity,
	getCountByDateMeetingAndCity,
	getOneByDateMeetingsAndCity,
	getPageByDateMeetingsAndInterest,
	getCountByDateMeetingAndInterest,
	getOneByDateMeetingsAndInterest,
	getPageByDateMeetingsAndCategory,
	getCountByDateMeetingAndCategory,
	getOneByDateMeetingsAndCategory
}