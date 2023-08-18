import {DetailedHTMLProps, HTMLAttributes} from 'react';
import { InterestsInterface } from '../../interfaces';

export interface SelectInterestProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listInterests: InterestsInterface.Db[];
	text: {[key: string]: string};
}