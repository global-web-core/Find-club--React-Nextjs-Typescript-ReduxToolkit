import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getAll = async () => await Http.get(controllers.accounts, {});
const getByUserId	= async (userId) => await Http.get(controllers.accounts, {conditions:[{k:'userId',v:userId}]});
const getByProviderIdAndProviderName = async (providerAccountId, provider)		=> await Http.get(controllers.accounts, {conditions:[{k:'providerAccountId',v:providerAccountId}, {k:'provider',v:provider}]});
const add = async (data) => await Http.add(controllers.accounts, {data});

export {
	getAll,
	getByUserId,
	getByProviderIdAndProviderName,
	add
}