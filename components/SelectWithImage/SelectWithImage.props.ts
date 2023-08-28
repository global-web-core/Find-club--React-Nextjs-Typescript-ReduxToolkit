import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { CitiesInterface, CountriesInterface, InterestsInterface, LanguagesInterface, CategoryInterface } from '../../typesAndInterfaces/interfaces';

export interface SelectWithImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	list: CitiesInterface.Db[] |  CountriesInterface.Db[] | InterestsInterface.Db[] | LanguagesInterface.Db[] | CategoryInterface.Db[];
	nameKeyOption: string;
	nameValueOption: string;
	nameInnerOption: string;
	nameEmptyOption: string;
	nameSelectedOption?: string | undefined;
	valueSelect: (value: string) => void;
	settingPathsImages: string;
	extensionFilesImages: string;
	button?: boolean;
	nameButton?: string;
	clickButton?: () => void;
}

export type OptionsType = LanguagesInterface.Db;