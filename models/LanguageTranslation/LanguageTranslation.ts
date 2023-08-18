import { Http } from '../../globals';
import { controllers, basicNameLanguagetranslation } from '../../globals/Constants/Constants';
import { HttpInterface, LanguageTranslationInterface } from '../../typesAndInterfaces/interfaces';
import { TypeLanguages } from '../../typesAndInterfaces/types';

const get	= async (country: TypeLanguages): Promise<HttpInterface.Get<LanguageTranslationInterface.Db>> => await Http.get(controllers[basicNameLanguagetranslation + country as keyof typeof controllers], {});

export {
	get
}