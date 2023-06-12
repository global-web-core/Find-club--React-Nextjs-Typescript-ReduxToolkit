import {DetailedHTMLProps, HTMLAttributes} from 'react';
import { CategoryInterface } from '../../interfaces';

export interface SelectCategoryProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listCategories: CategoryInterface.Category[];
	text: {[key: string]: string};
}