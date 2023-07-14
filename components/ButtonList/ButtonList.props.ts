import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface ButtonListProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children: ReactNode;
}