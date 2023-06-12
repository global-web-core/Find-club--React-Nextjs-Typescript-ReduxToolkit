import { Http } from '../../globals';

const getByRoute	= async (route: string)		=> await Http.get('countries', {conditions:[{k:'route',v:route}]});
const getById	= async (id: number)		=> await Http.get('countries', {conditions:[{k:'id',v:id}]});
const getAll	= async ()		=> await Http.get('countries', {});

export {
	// getInactiveAll,
	// get,
	// add,
	// update,
	getByRoute,
	getAll,
	getById
}