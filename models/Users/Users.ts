import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('users', {});
const getByEmail	= async (email)		=> await Http.get('users', {conditions:[{k:'email',v:email}]});
const getById	= async (id)		=> await Http.get('users', {conditions:[{k:'id',v:id}]});
const getBySession	= async (email, image, name)		=> await Http.get('users', {conditions:[{k:'email',v:email}, {k:'image',v:image}, {k:'name',v:name}]});
const add		= async (data)			=> await Http.post('users', {data});
const update	= async (id, data)		=> await Http.put('users', {data,conditions:[{k:'id',v:id}]});

export {
	getAll,
	getById,
	add,
	update,
	getByEmail,
	getBySession
}