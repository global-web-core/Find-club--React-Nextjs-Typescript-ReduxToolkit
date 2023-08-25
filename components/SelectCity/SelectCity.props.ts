import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { CitiesInterface } from '../../typesAndInterfaces/interfaces';

export interface SelectCityProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listCities: CitiesInterface.WithTranslation[];
	text: {[key: string]: string};
}