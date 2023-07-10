import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface HamburgerProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	open: boolean;
}