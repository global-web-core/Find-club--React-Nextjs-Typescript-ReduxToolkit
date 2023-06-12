import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('sessions', {});
const getByUserId	= async (userId)		=> await Http.get('sessions', {conditions:[{k:'userId',v:userId}]});
const getBySessionToken	= async (sessionToken)		=> await Http.get('sessions', {conditions:[{k:'sessionToken',v:sessionToken}]});
const add		= async (data)			=> await Http.post('sessions', {data});
const deleteSessionToken		= async (sessionToken)			=> await Http.remove('sessions', {conditions:[{k:'sessionToken',v:sessionToken}]});

export {
	getAll,
	getByUserId,
	getBySessionToken,
	add,
	deleteSessionToken
}