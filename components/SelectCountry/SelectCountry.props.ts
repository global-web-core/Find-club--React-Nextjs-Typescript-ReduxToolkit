import {DetailedHTMLProps, HTMLAttributes} from 'react';
import {CountriesInterface, LanguagesInterface} from '../../typesAndInterfaces/interfaces';

export interface SelectCountryProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listCountries: CountriesInterface.WithTranslation[];
	listLanguages: LanguagesInterface.Db[];
	text: {[key: string]: string};
}