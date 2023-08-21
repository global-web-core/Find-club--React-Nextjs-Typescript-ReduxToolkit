import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { usersColumns } from '../../globals/Constants/СolumnsDb';
import { HttpInterface, UsersInterface } from '../../typesAndInterfaces/interfaces';
import { TypeEmail, TypeImage, TypeName } from '../../typesAndInterfaces/types';

const getByEmail = async (email: TypeEmail): Promise<HttpInterface.Get<UsersInterface.Db>> => await Http.get(controllers.users, {conditions:[{k:usersColumns.email,v:email}]});
const getById	= async (id: string): Promise<HttpInterface.Get<UsersInterface.Db>> => await Http.get(controllers.users, {conditions:[{k:usersColumns.id,v:id}]});
const getBySession = async (email: TypeEmail, image: TypeImage, name: TypeName): Promise<HttpInterface.Get<UsersInterface.Db>> => await Http.get(controllers.users, {conditions:[{k:usersColumns.email,v:email}, {k:usersColumns.image,v:image}, {k:usersColumns.name,v:name}]});
const add = async (data: UsersInterface.Db): Promise<HttpInterface.Add> => await Http.add(controllers.users, {data});
const update = async (id: string, data: UsersInterface.Update): Promise<HttpInterface.Update> => await Http.update(controllers.users, {data,conditions:[{k:usersColumns.id,v:id}]});

export {
	getById,
	add,
	update,
	getByEmail,
	getBySession
}