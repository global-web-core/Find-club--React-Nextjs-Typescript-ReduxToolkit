import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface MeetingsListProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	textTranslation?: string;
}