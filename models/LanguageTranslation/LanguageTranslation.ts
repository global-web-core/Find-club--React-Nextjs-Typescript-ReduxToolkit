import { Http } from '../../globals';

const get	= async (country: string) => await Http.get('languagetranslation' + country, {});

export {
	get
}