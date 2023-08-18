import {DetailedHTMLProps, HTMLAttributes} from 'react';
import { CountriesInterface, LanguagesInterface } from '../../interfaces';

export interface SelectLanguageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listLanguages: LanguagesInterface.Languages[];
	text: {[key: string]: string};
	country: CountriesInterface.Db | null;
	updateLanguage: () => void;
}