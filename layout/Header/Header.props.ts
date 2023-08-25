import {DetailedHTMLProps, HTMLAttributes} from 'react';
import { LanguageTranslationInterface, LanguagesInterface } from '../../typesAndInterfaces/interfaces';

export interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	pageProps: {
		listLanguages: LanguagesInterface.Db[]
		textTranslation: LanguageTranslationInterface.Txt;
	};
}