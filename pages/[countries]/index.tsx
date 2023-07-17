import { SelectCity, Main, Loading, DivWithTopPanel, ButtonList, MeetingsList, Alert, Button } from '../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Languages } from '../../models';
import { useRouter } from 'next/router';
import { CitiesInterface, CountriesInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../../interfaces';
import { ParsedUrlQuery } from 'querystring';
import { ML } from '../../globals';
import { ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';
import { MeetingsSlice, SelectFilterSlice, TextTranslationSlice, UserSlice } from '../../store/slices';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { Layout } from '../../layout/Layout';
import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css'
import cn from 'classnames';
import { useSession, signIn } from 'next-auth/react';

export const getStaticPaths: GetStaticPaths = async () => {
	const countriesData = await Countries.getAll();
	const languagesData = await Languages.getAll();

	const paths: string[] = [];
	countriesData.data.forEach((country: CountriesInterface.Country) => {
		languagesData.data.forEach((language: LanguagesInterface.Languages) => {
			let url = '';
			if (country.id === language.idCountry) {
				url = '/' + country.route;
			} else {
				url = '/' + country.route + '-' + language.route;
			}
			if (!paths.includes(url)) paths.push(url);
		});
	});
	
	return {
		paths,
		fallback: false
	};
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	if (!params) {
		return {
			notFound: true
		};
	}
	
	const countryDb = await Countries.getByRoute((params.countries as string).slice(0, 2) as string);
	if (!countryDb.data.length) return {props: {}};
	const country = countryDb.data[0];
	const citiesCountry = await CitiesByCountries.getAllByCountry(country.id);
	
	if (!citiesCountry.data.length) return {props: {}};
	const idCities = citiesCountry.data.map((city: CitiesByCountriesInterface.CityByCountries) => city.idCity);
	const citiesData = await Cities.getAll();
	
	if (!idCities.length || !citiesData.data.length) return {props: {}};
	const listCities = citiesData.data.filter((city: CitiesInterface.City) => idCities.includes(city.id));

	let listLanguages = [];
	const languagesDb = await Languages.getAll();
	if (languagesDb) listLanguages = languagesDb.data
	if (!languagesDb.data.length) return {props: {}};

	let text = {};
	let lang;
	const pathLanguage = params.countries;
	if (typeof pathLanguage === 'string') {
		const languageByPath = ML.getLanguageByPath(pathLanguage, listLanguages, country);
		lang = languageByPath;
		const textDb = await ML.getTranslationText(languageByPath);
		if (textDb) text = textDb
		if (!textDb || !languageByPath) return {props: {}};
	}
	
	let metadata;
	if (typeof pathLanguage === 'string' && lang) metadata = generateMetadata(text, pathLanguage, lang);

	return {
		props: {
			listCities,
			listLanguages,
			text,
			country,
			metadata
		}
	};
};

export function generateMetadata(text: LanguageTranslationInterface.TextTranslation, pathCountries: string, lang: string):MetadataInterface.Main {
	const getTextForTitle = () => {
		const country = pathCountries?.length ? text[pathCountries.slice(0, 2) as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.titleCountries];
		const title = country + mainText;
		return title;
	}

	const getTextForDescription = () => {
		const country = pathCountries?.length ? text[pathCountries.slice(0, 2) as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.descriptionCountries];
		const description = country + mainText;
		return description;
	}

	return {
		title: getTextForTitle(),
		description: getTextForDescription(),
		lang
	}
}

export default function CountriesPage({ listCities, listLanguages, text, country, metadata }: CountriesPageProps): JSX.Element {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: session, status } = useSession();
	
	const [loading, setLoading] = useState(true);
	const [mounted, setMounted] = useState(false);
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const idUser = useAppSelector(state => UserSlice.userSelect(state));
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));
	const [value, onChange] = useState(null);
	// console.log('===value', value);
	const updateLanguage = async () => {
		const currentTranslationText = await ML.getChangeTranslationText(text)
		dispatch(TextTranslationSlice.updateLanguageAsync(currentTranslationText))
	}

	const clearData = () => {
		dispatch(UserSlice.clearAll());
		dispatch(MeetingsSlice.clearAll());
		// dispatch(DesiresSlice.clearAll());
	}

	useEffect(() => {
		async function startFetching() {
			ML.setLanguageByPath(router.query.countries as string, listLanguages, country);
			updateLanguage();
		}
		startFetching();
		setMounted(true);
	}, [])

	const maxDate = new Date();
	maxDate.setMonth(maxDate.getMonth() + 3);

	useEffect(() => {
		dispatch(UserSlice.getIdUserAsync(session));
	}, [session]);

	useEffect(() => {
		if (!session && status !== 'loading') {
			clearData();
			signIn();
		}

		if (session && status === 'authenticated' && !loading) {
			// getDataByIdUser();
		}
	}, [session, status, loading, selectFilter, textTranslation])

	return (
		<>
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
			</Head>
			<Main>
				{mounted &&
					<div>
						<Calendar
							onChange={onChange} value={value}
							minDate={new Date()} maxDate={new Date(maxDate)}
							minDetail={"month"} maxDetail={"month"}
							// showWeekNumbers={true}
							locale={metadata.lang}
						/>
					</div>
				}
				<SelectCity listCities={listCities} text={textTranslation}></SelectCity>
				{loading
					? <Loading textTranslation={textTranslation[ML.key.loading]} />
					: 
						<DivWithTopPanel
							topPanel={
								<>
									<ButtonList>
										<Button name={textTranslation[ML.key.all]} selected={selectFilter.basic === nameFilter.all ? true : false} onClick={() => dispatch(SelectFilterSlice.setYourMeetingsFilter(nameFilter.all))} />
									</ButtonList>
								</>
							}
						>
							<MeetingsList meetings={meetings} getListIdMeetings={() => getListIdMeetings()} />
						</DivWithTopPanel>
				}
				<Button name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: '/your-meetings'})}} />
				<Alert/>
				<Alert/>
			</Main>
		</>
	)
}

CountriesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

interface CountriesPageProps {
	listCities: CitiesInterface.City[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.TextTranslation;
	country: CountriesInterface.Country;
	metadata: MetadataInterface.Main;
}