import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';


const getAll = async () => await Http.get(controllers.sessions, {});
const getByUserId	= async (userId) => await Http.get(controllers.sessions, {conditions:[{k:'userId',v:userId}]});
const getBySessionToken	= async (sessionToken) => await Http.get(controllers.sessions, {conditions:[{k:'sessionToken',v:sessionToken}]});
const add = async (data) => await Http.add(controllers.sessions, {data});
const deleteSessionToken = async (sessionToken) => await Http.remove(controllers.sessions, {conditions:[{k:'sessionToken',v:sessionToken}]});

export {
	getAll,
	getByUserId,
	getBySessionToken,
	add,
	deleteSessionToken
}