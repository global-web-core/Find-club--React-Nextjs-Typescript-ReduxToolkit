import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface DivWithTopPanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children: ReactNode;
	topPanel: JSX.Element;
	meetingsListMain: boolean;
}