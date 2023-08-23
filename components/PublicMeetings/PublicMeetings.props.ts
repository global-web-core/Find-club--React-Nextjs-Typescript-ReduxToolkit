import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { CountriesInterface, LanguageTranslationInterface, LanguagesInterface, MeetingsInterface, MetadataInterface, CitiesInterface, InterestsInterface, CategoryInterface } from '../../typesAndInterfaces/interfaces';

export interface PublicMeetingsProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	listCountries: CountriesInterface.Db[];
	listLanguages: LanguagesInterface.Db[];
	country: CountriesInterface.Db;
	textTranslation: LanguageTranslationInterface.Txt;
	metadata: MetadataInterface.Main;
	getMeetingsFromDb: (startDate: string, endDate: string) => Promise<MeetingsInterface.Db[] | undefined>;
	listCities: CitiesInterface.Db[];
	listInterests: InterestsInterface.Db[];
	listCategories: CategoryInterface.Db[];
	clearDataMeetings: () => void;
	language: LanguagesInterface.Db;
}