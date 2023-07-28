import { DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';

export interface PaginationProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	namePagination: string;
}