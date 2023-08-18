import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { HttpInterface, VerificationtokensInterface } from '../../typesAndInterfaces/interfaces';

const getAll = async (): Promise<HttpInterface.Get<VerificationtokensInterface.Db>> => await Http.get(controllers.verificationtokens, {});

export {
	getAll
}