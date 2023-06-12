import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('languages', {});

export {
	getAll
}