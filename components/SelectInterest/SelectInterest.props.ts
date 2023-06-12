import {DetailedHTMLProps, HTMLAttributes} from 'react';
import { InterestsInterface } from '../../interfaces';

export interface SelectInterestProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listInterests: InterestsInterface.Interest[];
	text: {[key: string]: string};
}