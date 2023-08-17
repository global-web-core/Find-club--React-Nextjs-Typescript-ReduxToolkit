import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getByIdMeeting = async (idMeeting: number) => await Http.get(controllers.desires, {conditions:[{k:'idMeeting',v:idMeeting}]});
const getById	= async (id: number) => await Http.get(controllers.desires, {conditions:[{k:'id',v:id}]});
const getByIdUser	= async (idUser: string) => await Http.get(controllers.desires, {conditions:[{k:'idUser',v:idUser}]});
const getByIdUserByStatusOrganizer = async (idUser: string, statusOrganizer: number) => await Http.get(controllers.desires, {conditions:[{k:'idUser',v:idUser}, {k:'statusOrganizer',v:statusOrganizer}]});
const getByIdUserAndIdMeeting	= async (idUser: string, idMeeting: number) => await Http.get(controllers.desires, {conditions:[{k:'idUser',v: idUser}, {k:'idMeeting',v: idMeeting}]});

const add = async (data) => await Http.add(controllers.desires, {data});
const update = async (id: number, data) => await Http.update(controllers.desires, {data,conditions:[{k:'id',v:id}]});

export {
	getById,
	getByIdMeeting,
	getByIdUser,
	getByIdUserByStatusOrganizer,
	getByIdUserAndIdMeeting,
	add,
	update
}