import {DetailedHTMLProps, HTMLAttributes} from 'react';
import { CategoryInterface } from '../../typesAndInterfaces/interfaces';

export interface SelectCategoryProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	listCategories: CategoryInterface.WithTranslation[];
	text: {[key: string]: string};
}