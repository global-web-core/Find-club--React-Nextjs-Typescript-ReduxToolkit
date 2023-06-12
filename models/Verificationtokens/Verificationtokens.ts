import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('verificationtokens', {});

export {
	getAll
}