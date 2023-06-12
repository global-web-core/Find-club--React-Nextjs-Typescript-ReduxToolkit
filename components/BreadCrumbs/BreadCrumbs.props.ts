import { DetailedHTMLProps, HTMLAttributes} from 'react';

export type MultiRoute = {[key: string]: string};

export interface BreadCrumbsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	currentRoute: MultiRoute | string;
	text: {[key: string]: string};
}