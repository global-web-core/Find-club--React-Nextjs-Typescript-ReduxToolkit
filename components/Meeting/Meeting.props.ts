import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { MeetingsInterface, UsersInterface } from '../../typesAndInterfaces/interfaces';

export interface MeetingProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	textTranslation?: string;
	idUser: UsersInterface.Db["id"] | null;
	meeting: MeetingsInterface.MeetingsWithDependentData;
}