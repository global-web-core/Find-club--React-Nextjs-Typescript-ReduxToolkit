import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('categories', {});

export {
	getAll
}