import { DetailedHTMLProps, HTMLAttributes} from 'react';

export interface LoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	text?: string;
}