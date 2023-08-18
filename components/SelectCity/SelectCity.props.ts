import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { CitiesInterface } from '../../interfaces';

export interface SelectCityProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listCities: CitiesInterface.Db[];
	text: {[key: string]: string};
}