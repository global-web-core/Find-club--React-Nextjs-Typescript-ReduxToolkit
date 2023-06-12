import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ArrowOpenProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	open: boolean;
	color?: 'dark' | 'light';
}