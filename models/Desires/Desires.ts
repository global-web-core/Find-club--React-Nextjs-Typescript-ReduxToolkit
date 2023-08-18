import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { desiresColumns } from '../../globals/Constants/СolumnsDb';
import { DesiresInterface, HttpInterface } from '../../typesAndInterfaces/interfaces';
import {TypeOneOrZero} from '../../typesAndInterfaces/types'

const getByIdMeeting = async (idMeeting: number): Promise<HttpInterface.Get<DesiresInterface.Db>> => await Http.get(controllers.desires, {conditions:[{k:desiresColumns.idMeeting,v:idMeeting}]});
const getById	= async (id: number): Promise<HttpInterface.Get<DesiresInterface.Db>> => await Http.get(controllers.desires, {conditions:[{k:desiresColumns.id,v:id}]});
const getByIdUser	= async (idUser: string): Promise<HttpInterface.Get<DesiresInterface.Db>> => await Http.get(controllers.desires, {conditions:[{k:desiresColumns.idUser,v:idUser}]});
const getByIdUserByStatusOrganizer = async (idUser: string, statusOrganizer: TypeOneOrZero): Promise<HttpInterface.Get<DesiresInterface.Db>> => await Http.get(controllers.desires, {conditions:[{k:desiresColumns.idUser,v:idUser}, {k:desiresColumns.statusOrganizer,v:statusOrganizer}]});
const getByIdUserAndIdMeeting	= async (idUser: string, idMeeting: number): Promise<HttpInterface.Get<DesiresInterface.Db>> => await Http.get(controllers.desires, {conditions:[{k:desiresColumns.idUser,v: idUser}, {k:desiresColumns.idMeeting,v: idMeeting}]});

const add = async (data: DesiresInterface.Add): Promise<HttpInterface.Add> => await Http.add(controllers.desires, {data});
const update = async (id: number, data: DesiresInterface.Update): Promise<HttpInterface.Update> => await Http.update(controllers.desires, {data,conditions:[{k:desiresColumns.id,v:id}]});

export {
	getById,
	getByIdMeeting,
	getByIdUser,
	getByIdUserByStatusOrganizer,
	getByIdUserAndIdMeeting,
	add,
	update
}