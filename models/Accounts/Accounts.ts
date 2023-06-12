import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('accounts', {});
const getByUserId	= async (userId)		=> await Http.get('accounts', {conditions:[{k:'userId',v:userId}]});
const getByProviderIdAndProviderName	= async (providerAccountId, provider)		=> await Http.get('accounts', {conditions:[{k:'providerAccountId',v:providerAccountId}, {k:'provider',v:provider}]});
const add		= async (data)			=> await Http.post('accounts', {data});

export {
	getAll,
	getByUserId,
	getByProviderIdAndProviderName,
	add
}