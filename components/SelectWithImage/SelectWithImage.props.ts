import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { CitiesInterface, CountriesInterface, InterestsInterface, LanguagesInterface, CategoryInterface } from '../../interfaces';

export interface SelectWithImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	list: CitiesInterface.Db[] |  CountriesInterface.Db[] | InterestsInterface.Db[] | LanguagesInterface.Languages[] | CategoryInterface.Db[];
	nameKeyOption: string;
	nameValueOption: string;
	nameInnerOption: string;
	nameEmptyOption: string;
	nameSelectedOption?: string;
	valueSelect: (value: string) => void;
	settingPathsImages: string;
	extensionFilesImages: string;
	button?: boolean;
	nameButton?: string;
	clickButton?: () => void;
}

export type OptionsType = LanguagesInterface.Languages;