import {DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface MobileMainMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children: ReactNode;
}