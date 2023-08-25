import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { LanguagesInterface, MetadataInterface } from '../../typesAndInterfaces/interfaces';

export interface CalendarMeetingsProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	language: LanguagesInterface.Db;
	metadataLanguage: MetadataInterface.Main["lang"];
}