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
const getPageByDateMeetingsAndCountry = async (idCountry, startDate, endDate, page?) => await Http.get('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}],
	orders:[{k:'dateMeeting',isd:Constants.requestOderType.ASC}],
	limits:[
		{limit:Constants.pagination.limit, offset:(page ? (page - 1) * Constants.pagination.limit : 0)}
	]
});
const getCountByDateMeetingAndCountry	= async (idCountry, startDate, endDate)		=> await Http.getCount('meetings',
	{conditions:[
		{k:'idCountry',v:idCountry},
		{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE},
		{k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},
		{k:'accessMeeting',v:Constants.accessMeeting.all},
		{k:'status',v:Constants.activyStatus.ACTIVE}
	]
});
const add = async (data) => await Http.post('meetings', {data});
const update = async (id, data) => await Http.put('meetings', {data,conditions:[{k:'id',v:id}]});

export {
	getAll,
	getByDataForm,
	getByIdUser,
	getByIdMeeting,
	getPageByDateMeetingsAndCountry,
	getCountByDateMeetingAndCountry,
	getByIdMeetingLessDate,
	getByIdMeetingMoreDate,
	add,
	update
}