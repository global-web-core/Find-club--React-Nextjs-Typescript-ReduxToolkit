import {DetailedHTMLProps, HTMLAttributes} from 'react';
import { LanguageTranslationInterface, LanguagesInterface } from '../../interfaces';

export interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	pageProps: {
		listLanguages: LanguagesInterface.Db[]
		text: LanguageTranslationInterface.TextTranslation;
	};
}