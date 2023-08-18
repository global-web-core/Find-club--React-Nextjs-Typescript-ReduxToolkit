import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { sessionsColumns } from '../../globals/Constants/СolumnsDb';
import { HttpInterface, SessionsInterface } from '../../typesAndInterfaces/interfaces';

const getByUserId	= async (userId: string): Promise<HttpInterface.Get<SessionsInterface.Db>> => await Http.get(controllers.sessions, {conditions:[{k:sessionsColumns.userId,v:userId}]});
const getBySessionToken	= async (sessionToken: string): Promise<HttpInterface.Get<SessionsInterface.Db>> => await Http.get(controllers.sessions, {conditions:[{k:sessionsColumns.sessionToken,v:sessionToken}]});
const add = async (data: SessionsInterface.Add): Promise<HttpInterface.Add> => await Http.add(controllers.sessions, {data});
const deleteSessionToken = async (sessionToken: string): Promise<HttpInterface.Remove> => await Http.remove(controllers.sessions, {conditions:[{k:sessionsColumns.sessionToken,v:sessionToken}]});

export {
	getByUserId,
	getBySessionToken,
	add,
	deleteSessionToken
}