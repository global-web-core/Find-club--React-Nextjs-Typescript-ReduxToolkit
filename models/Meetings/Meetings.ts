import { Http } from '../../globals';
import { controllers, requestConditionType, accessMeeting, activyStatus, requestOderType, pagination } from '../../globals/Constants/Constants';

const getAll = async () => await Http.get(controllers.meetings, {});
const getByDataForm	= async (dataMeeting)		=> await Http.get(controllers.meetings, {conditions:[
	{k:'idCountry',v:dataMeeting.idCountry},
	{k:'idCity',v:dataMeeting.idCity},
	{k:'idInterest',v:dataMeeting.idInterest},
	{k:'idCategory',v:dataMeeting.idCategory},
	{k:'idLanguage',v:dataMeeting.idLanguage},
	{k:'dateMeeting',v:dataMeeting.dateMeeting}
]});
const getByIdUser	= async (idUser) => await Http.get(controllers.meetings, {conditions:[{k:'idUser',v:idUser}]});
const getByIdMeeting = async (id) => await Http.get(controllers.meetings, {conditions:[{k:'id',v:id}]});
const getByIdMeetingLessDate = async (id, date) => await Http.get(controllers.meetings, {conditions:[
	{k:'id',v:id},
	{k:'dateMeeting',v:date,op:requestConditionType.LESS}]
});
const getByIdMeetingMoreDate = async (id, date) => await Http.get(controllers.meetings, {conditions:[
	{k:'id',v:id},
	{k:'dateMeeting',v:date,op:requestConditionType.MORE}]
});
const getPageByDateMeetingsAndCountry = async (idCountry, idLanguage, startDate, endDate, page?) => await Http.get(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:requestOderType.ASC}],
	limits:[
		{limit:pagination.limit, offset:(page ? (page - 1) * pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCountry	= async (idCountry, idLanguage, startDate, endDate) => await Http.getCount(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCountry = async (idCountry, idLanguage, startDate, endDate) => await Http.get(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndCity = async (idCountry, idCity, idLanguage, startDate, endDate, page?) => await Http.get(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:requestOderType.ASC}],
	limits:[
		{limit:pagination.limit, offset:(page ? (page - 1) * pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCity = async (idCountry, idCity, idLanguage, startDate, endDate) => await Http.getCount(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCity = async (idCountry, idCity, idLanguage, startDate, endDate) => await Http.get(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndInterest = async (idCountry, idCity, idInterest, idLanguage, startDate, endDate, page?) => await Http.get(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:requestOderType.ASC}],
	limits:[
		{limit:pagination.limit, offset:(page ? (page - 1) * pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndInterest = async (idCountry, idCity, idInterest, idLanguage, startDate, endDate)		=> await Http.getCount(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndInterest = async (idCountry, idCity, idInterest, idLanguage, startDate, endDate) => await Http.get(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndCategory = async (idCountry, idCity, idInterest, idCategory, idLanguage, startDate, endDate, page?) => await Http.get(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idCategory',v:idCategory},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:requestOderType.ASC}],
	limits:[
		{limit:pagination.limit, offset:(page ? (page - 1) * pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCategory = async (idCountry, idCity, idInterest, idCategory, idLanguage, startDate, endDate) => await Http.getCount(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idCategory',v:idCategory},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCategory = async (idCountry, idCity, idInterest, idCategory, idLanguage, startDate, endDate) => await Http.get(controllers.meetings,
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'idCity',v:idCity},
		{k:'idInterest',v:idInterest},
		{k:'idCategory',v:idCategory},
		{k:'idLanguage',v:idLanguage},
		{k:'dateMeeting',v:startDate,op:requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:requestConditionType.LESS},
		{k:'accessMeeting',v:accessMeeting.all},
		{k:'status',v:activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const add = async (data) => await Http.add(controllers.meetings, {data});
const update = async (id, data) => await Http.update(controllers.meetings, {data,conditions:[{k:'id',v:id}]});

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