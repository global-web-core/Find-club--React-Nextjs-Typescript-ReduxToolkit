import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface DivWithTopPanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children: ReactNode;
}