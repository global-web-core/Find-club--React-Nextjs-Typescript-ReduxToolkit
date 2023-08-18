import {DetailedHTMLProps, HTMLAttributes} from 'react';
import {CountriesInterface, LanguagesInterface} from '../../interfaces';

export interface SelectCountryProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listCountries: CountriesInterface.Db[];
	listLanguages: LanguagesInterface.Languages[];
	text: {[key: string]: string};
}