import { Constants, Http } from '../../globals';

const getAll	= async ()		=> await Http.get('meetings', {});
const getByDataForm	= async (dataMeeting)		=> await Http.get('meetings', {conditions:[{k:'idCountry',v:dataMeeting.idCountry}, {k:'idCity',v:dataMeeting.idCity}, {k:'idInterest',v:dataMeeting.idInterest}, {k:'idCategory',v:dataMeeting.idCategory}, {k:'idLanguage',v:dataMeeting.idLanguage}, {k:'dateMeeting',v:dataMeeting.dateMeeting}]});
const getByIdUser	= async (idUser)		=> await Http.get('meetings', {conditions:[{k:'idUser',v:idUser}]});
const getByIdMeeting	= async (id)		=> await Http.get('meetings', {conditions:[{k:'id',v:id}]});
// {operations:[{k:'dateMeeting',isd:2}]}
const getByMoreDatePagination	= async (startDate, endDate, page?)		=> await Http.get('meetings', {conditions:[{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE}, {k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},{k:'status',v:Constants.activyStatus.ACTIVE}], limits:[{limit:Constants.pagination.limit, offset:(page ? (page - 1) * Constants.pagination.limit : 0)}]});
const getCountByMoreDatePagination	= async (startDate, endDate)		=> await Http.getCount('meetings', {conditions:[{k:'dateMeeting',v:startDate,op:Constants.requestConditionType.MORE}, {k:'dateMeeting',v:endDate,op:Constants.requestConditionType.LESS},{k:'status',v:Constants.activyStatus.ACTIVE}]});
const add		= async (data)			=> await Http.post('meetings', {data});
const update	= async (id, data)		=> await Http.put('meetings', {data,conditions:[{k:'id',v:id}]});

export {
	getAll,
	getByDataForm,
	getByIdUser,
	getByIdMeeting,
	getByMoreDatePagination,
	getCountByMoreDatePagination,
	add,
	update
}