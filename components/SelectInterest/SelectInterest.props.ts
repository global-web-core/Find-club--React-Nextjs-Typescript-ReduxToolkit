import {DetailedHTMLProps, HTMLAttributes} from 'react';
import { InterestsInterface } from '../../typesAndInterfaces/interfaces';

export interface SelectInterestProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listInterests: InterestsInterface.WithTranslation[];
	text: {[key: string]: string};
}