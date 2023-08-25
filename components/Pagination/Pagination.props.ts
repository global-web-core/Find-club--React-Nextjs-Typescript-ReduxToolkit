import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { TypeNamePagination } from '../../typesAndInterfaces/types';

export interface PaginationProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	namePagination: TypeNamePagination;
}