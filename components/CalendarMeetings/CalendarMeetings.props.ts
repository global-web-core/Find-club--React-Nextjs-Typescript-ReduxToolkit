import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface CalendarMeetingsProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	language: string;
}