import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface AccordionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	header: JSX.Element;
	hideContent: JSX.Element;
	noActive?: boolean;
}