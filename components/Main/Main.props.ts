import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface MainProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children: ReactNode;
}