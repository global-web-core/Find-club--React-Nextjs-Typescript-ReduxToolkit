import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { TypeNamePagination } from '../../typesAndInterfaces/types';

export interface MeetingsListProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	namePagination: TypeNamePagination;
}