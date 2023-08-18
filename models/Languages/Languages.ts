import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { HttpInterface, LanguagesInterface } from '../../typesAndInterfaces/interfaces';

const getAll = async (): Promise<HttpInterface.Get<LanguagesInterface.Db>> => await Http.get(controllers.languages, {});

export {
	getAll
}