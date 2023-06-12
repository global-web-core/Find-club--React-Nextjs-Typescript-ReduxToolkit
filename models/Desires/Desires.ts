import { Http } from '../../globals';

const getByIdMeeting	= async (idMeeting: number)		=> await Http.get('desires', {conditions:[{k:'idMeeting',v:idMeeting}]});
const getById	= async (id: number) => await Http.get('desires', {conditions:[{k:'id',v:id}]});
const getByIdUser	= async (idUser: string) => await Http.get('desires', {conditions:[{k:'idUser',v:idUser}]});
const getByIdUserByStatusOrganizer	= async (idUser: string, statusOrganizer: number) => await Http.get('desires', {conditions:[{k:'idUser',v:idUser}, {k:'statusOrganizer',v:statusOrganizer}]});
const getByIdUserAndIdMeeting	= async (idUser: string, idMeeting: number) => await Http.get('desires', {conditions:[{k:'idUser',v: idUser}, {k:'idMeeting',v: idMeeting}]});

const add		= async (data) => await Http.post('desires', {data});
const update	= async (id: number, data) => await Http.put('desires', {data,conditions:[{k:'id',v:id}]});

export {
	getById,
	getByIdMeeting,
	getByIdUser,
	getByIdUserByStatusOrganizer,
	getByIdUserAndIdMeeting,
	add,
	update
}