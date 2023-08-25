import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { MeetingsInterface } from '../../typesAndInterfaces/interfaces';

export interface MeetingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	textTranslation?: string;
	idUser: string;
	meeting: MeetingsInterface.MeetingsWithDependentData;
}