import { Http } from '../../globals';
import { controllers, basicNameLanguagetranslation } from '../../globals/Constants/Constants';

const get	= async (country: 'ru' | 'en') => await Http.get(controllers[basicNameLanguagetranslation + country as keyof typeof controllers], {});

export {
	get
}