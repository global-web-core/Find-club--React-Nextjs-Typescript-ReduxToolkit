import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('interestsbycities', {});

export {
	getAll
}