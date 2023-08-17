import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getAll = async () => await Http.get(controllers.users, {});
const getByEmail = async (email) => await Http.get(controllers.users, {conditions:[{k:'email',v:email}]});
const getById	= async (id) => await Http.get(controllers.users, {conditions:[{k:'id',v:id}]});
const getBySession = async (email, image, name) => await Http.get(controllers.users, {conditions:[{k:'email',v:email}, {k:'image',v:image}, {k:'name',v:name}]});
const add = async (data) => await Http.add(controllers.users, {data});
const update = async (id, data) => await Http.update(controllers.users, {data,conditions:[{k:'id',v:id}]});

export {
	getAll,
	getById,
	add,
	update,
	getByEmail,
	getBySession
}