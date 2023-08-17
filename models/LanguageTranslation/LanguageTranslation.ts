import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const get	= async (country: 'ru' | 'en') => await Http.get(controllers.languagetranslation + country, {});

export {
	get
}