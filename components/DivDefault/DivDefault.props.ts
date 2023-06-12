import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface DivDefaultProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children: ReactNode;
}