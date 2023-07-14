import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface MeetingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	textTranslation?: string;
}