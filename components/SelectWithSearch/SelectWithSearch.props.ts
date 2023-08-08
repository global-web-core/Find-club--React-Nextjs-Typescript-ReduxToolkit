import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface SelectWithSearchProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	// children: ReactNode;
	placeholder: string;
	options: {value: string; label: string;}[];
}