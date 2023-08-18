import { DetailedHTMLProps, SelectHTMLAttributes } from 'react';
import { CitiesInterface, CountriesInterface, InterestsInterface, LanguagesInterface, CategoryInterface } from '../../interfaces';

export interface SelectProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
	list: CitiesInterface.City[] |  CountriesInterface.Country[] | InterestsInterface.Interest[] | LanguagesInterface.Languages[] | CategoryInterface.Db[];
	nameSelect?: string;
	nameKeyOption: string;
	nameValueOption: string;
	nameInnerOption: string;
	nameEmptyOption: string;
	nameSelectedOption?: string;
	valueSelect: (value: string, name?: string) => void;
	rightAngle?: boolean;
	required?:boolean;
	error?: boolean;
}