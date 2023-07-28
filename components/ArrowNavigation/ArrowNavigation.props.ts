import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ArrowNavigationProps extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	direction: 'left' | 'right';
}