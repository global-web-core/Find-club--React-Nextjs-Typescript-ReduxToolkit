import {DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface TypingTextProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	listText: string[];
}