import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { CountriesInterface, LanguageTranslationInterface, LanguagesInterface } from '../../typesAndInterfaces/interfaces';

export interface NavigationMeetingsProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	listCountries: CountriesInterface.Db[];
	listLanguages: LanguagesInterface.Db[];
	textTranslation: LanguageTranslationInterface.Txt;
}