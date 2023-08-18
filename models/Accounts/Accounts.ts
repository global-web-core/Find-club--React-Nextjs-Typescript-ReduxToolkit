import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { accountsColumns } from '../../globals/Constants/СolumnsDb';
import { AccountsInterface, HttpInterface } from '../../typesAndInterfaces/interfaces';

const getByUserId	= async (userId: string): Promise<HttpInterface.Get<AccountsInterface.Db>> => await Http.get(controllers.accounts, {conditions:[{k:accountsColumns.userId,v:userId}]});
const getByProviderIdAndProviderName = async (providerAccountId: string, provider: string): Promise<HttpInterface.Get<AccountsInterface.Db>> => await Http.get(controllers.accounts, {conditions:[{k:accountsColumns.providerAccountId,v:providerAccountId}, {k:accountsColumns.provider,v:provider}]});
const add = async (data: AccountsInterface.Db): Promise<HttpInterface.Add> => await Http.add(controllers.accounts, {data});

export {
	getByUserId,
	getByProviderIdAndProviderName,
	add
}