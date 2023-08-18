import { Http } from '../../globals';
import { controllers, requestConditionType, accessMeeting, activyStatus, requestOderType, pagination } from '../../globals/Constants/Constants';
import { meetingsColumns } from '../../globals/Constants/СolumnsDb';
import { HttpInterface, MeetingsInterface } from '../../typesAndInterfaces/interfaces';

const getByDataForm	= async (data: MeetingsInterface.DataForm): Promise<HttpInterface.Get<MeetingsInterface.Db>>		=> await Http.get(controllers.meetings, {conditions:[
	{k:meetingsColumns.idCountry,v:data.idCountry},
	{k:meetingsColumns.idCity,v:data.idCity},
	{k:meetingsColumns.idInterest,v:data.idInterest},
	{k:meetingsColumns.idCategory,v:data.idCategory},
	{k:meetingsColumns.idLanguage,v:data.idLanguage},
	{k:meetingsColumns.dateMeeting,v:data.dateMeeting}
]});
const getByIdMeeting = async (id: number): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings, {conditions:[{k:meetingsColumns.id,v:id}]});
const getByIdMeetingLessDate = async (id: number, dateMeeting: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings, {conditions:[
	{k:meetingsColumns.id,v:id},
	{k:meetingsColumns.dateMeeting,v:dateMeeting,op:requestConditionType.LESS}]
});
const getByIdMeetingMoreDate = async (id: number, dateMeeting: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings, {conditions:[
	{k:meetingsColumns.id,v:id},
	{k:meetingsColumns.dateMeeting,v:dateMeeting,op:requestConditionType.MORE}]
});
const getPageByDateMeetingsAndCountry = async (idCountry: number, idLanguage: number, startDate: Date, endDate: Date, page?: number): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}],
	orders:[{k:meetingsColumns.dateMeeting,isd:requestOderType.ASC}],
	limits:[
		{limit:pagination.limit, offset:(page ? (page - 1) * pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCountry	= async (idCountry: number, idLanguage: number, startDate: Date, endDate: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.getCount(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCountry = async (idCountry: number, idLanguage: number, startDate: Date, endDate: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndCity = async (idCountry: number, idCity: number, idLanguage: number, startDate: Date, endDate: Date, page?: number): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}],
	orders:[{k:meetingsColumns.dateMeeting,isd:requestOderType.ASC}],
	limits:[
		{limit:pagination.limit, offset:(page ? (page - 1) * pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCity = async (idCountry: number, idCity: number, idLanguage: number, startDate: Date, endDate: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.getCount(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCity = async (idCountry: number, idCity: number, idLanguage: number, startDate: Date, endDate: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndInterest = async (idCountry: number, idCity: number, idInterest: number, idLanguage: number, startDate: Date, endDate: Date, page?: number): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idInterest,v:idInterest},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}],
	orders:[{k:meetingsColumns.dateMeeting,isd:requestOderType.ASC}],
	limits:[
		{limit:pagination.limit, offset:(page ? (page - 1) * pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndInterest = async (idCountry: number, idCity: number, idInterest: number, idLanguage: number, startDate: Date, endDate: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>>		=> await Http.getCount(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idInterest,v:idInterest},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndInterest = async (idCountry: number, idCity: number, idInterest: number, idLanguage: number, startDate: Date, endDate: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idInterest,v:idInterest},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const getPageByDateMeetingsAndCategory = async (idCountry: number, idCity: number, idInterest: number, idCategory: number, idLanguage: number, startDate: Date, endDate: Date, page?: number): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idInterest,v:idInterest},
		{k:meetingsColumns.idCategory,v:idCategory},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}],
	orders:[{k:meetingsColumns.dateMeeting,isd:requestOderType.ASC}],
	limits:[
		{limit:pagination.limit, offset:(page ? (page - 1) * pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCategory = async (idCountry: number, idCity: number, idInterest: number, idCategory: number, idLanguage: number, startDate: Date, endDate: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.getCount(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idInterest,v:idInterest},
		{k:meetingsColumns.idCategory,v:idCategory},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}
	]
});
const getOneByDateMeetingsAndCategory = async (idCountry: number, idCity: number, idInterest: number, idCategory: number, idLanguage: number, startDate: Date, endDate: Date): Promise<HttpInterface.Get<MeetingsInterface.Db>> => await Http.get(controllers.meetings,
	{conditions:[
		{k:meetingsColumns.idCountry,v:idCountry},
		{k:meetingsColumns.idCity,v:idCity},
		{k:meetingsColumns.idInterest,v:idInterest},
		{k:meetingsColumns.idCategory,v:idCategory},
		{k:meetingsColumns.idLanguage,v:idLanguage},
		{k:meetingsColumns.dateMeeting,v:startDate,op:requestConditionType.MORE},
		{k:meetingsColumns.dateMeeting,v:endDate,op:requestConditionType.LESS},
		{k:meetingsColumns.accessMeeting,v:accessMeeting.all},
		{k:meetingsColumns.status,v:activyStatus.ACTIVE}],
	limits:[
		{limit:1}
	]
});

const add = async (data: MeetingsInterface.Add): Promise<HttpInterface.Add> => await Http.add(controllers.meetings, {data});
const update = async (id: number, data: MeetingsInterface.Update): Promise<HttpInterface.Update> => await Http.update(controllers.meetings, {data,conditions:[{k:meetingsColumns.id,v:id}]});

export {
	getByDataForm,
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