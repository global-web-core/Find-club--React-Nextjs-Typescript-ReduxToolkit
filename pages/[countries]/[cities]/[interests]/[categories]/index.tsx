import { SelectLanguage, Main, Alert, Button, PublicMeetings } from '../../../../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages, Categories, CategoriesByInterests, Meetings } from '../../../../../models';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { CitiesByCountriesInterface, CitiesInterface, CountriesInterface, InterestsInterface, InterestsByCitiesInterface, LanguagesInterface, LanguageTranslationInterface, CategoryInterface, CategoriesByInterestsInterface, MetadataInterface } from '../../../../../interfaces';
import { ReactElement, useEffect } from 'react';
import { Constants, Helpers, ML } from '../../../../../globals';
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../../../../../store/hook';
import { DesiresSlice, MeetingsSlice, PaginationSlice, TextTranslationSlice, UserSlice } from '../../../../../store/slices';
import { Layout } from '../../../../../layout/Layout';
import { useSession } from 'next-auth/react';

export const getStaticPaths: GetStaticPaths = async () => {
	const listCountries = await Countries.getAll();
	const listCities = await Cities.getAll();
	const listCitiesByCountries = await CitiesByCountries.getAll();
	const listInterests = await Interests.getAll();
	const listInterestsByCities = await InterestsByCities.getAll();
	const listCategories = await Categories.getAll();
	const listCategoriesByInterests = await CategoriesByInterests.getAll();
	const listLanguages = await Languages.getAll();

	const paths: string[] = [];

	if (listCountries.data.length && listCities.data.length && listCitiesByCountries.data.length && listInterests.data.length && listInterestsByCities.data.length && listCategories.data.length && listCategoriesByInterests.data.length && listLanguages.data.length) {
		listCategoriesByInterests.data.forEach((categoryByInterest: CategoriesByInterestsInterface.Db) => {
			let categoryRoute: string | null = null;
			listCategories.data.forEach((category: CategoryInterface.Db) => {
				if (categoryByInterest.idCategory === category.id) {
					listInterestsByCities.data.forEach((interestByCity: InterestsByCitiesInterface.Db) => {
						let interestRoute: string | null = null;
						let cityRoute: string | null = null;
						listInterests.data.forEach((interest: InterestsInterface.Db) => {
							if (interestByCity.idInterest === interest.id && categoryByInterest.idInterest === interest.id) {
									categoryRoute = category.route;
									interestRoute = interest.route;
									
									listCities.data.forEach((city: CitiesInterface.Db) => {
										if (interestByCity.idCity === city.id) {
											cityRoute = city.route;
											listCitiesByCountries.data.forEach((cityByCountry: CitiesByCountriesInterface.Db) => {
												if (cityByCountry.idCity === city.id) {
													listCountries.data.forEach((country: CountriesInterface.Db) => {
														listLanguages.data.forEach((language: LanguagesInterface.Db) => {
															let countryRoute = '';
															if (country.id === language.idCountry) {
																countryRoute = '/' + country.route;
															} else {
																countryRoute = '/' + country.route + '-' + language.route;
															}
										
															if (country.id === cityByCountry.idCountry) {
																const url = countryRoute + '/' + cityRoute + '/' + interestRoute + '/' + categoryRoute;
																if (!paths.includes(url)) paths.push(url);
															}
														});
													});
												}
											});
										}
									});
								}
							});
						});
				}
			});
		});
	}

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

	const countriesDb = await Countries.getAll();
	const listCountries = countriesDb.data;

	const countryDb = await Countries.getByRoute((params.countries as string).slice(0, 2) as string);
	const country = countryDb.data[0];

	const citiesByCountry = (await CitiesByCountries.getAllByCountry(country.id)).data
	const citiesByRoute = (await Cities.getAllByRouteCity(params.cities as string)).data
	let cityData = [];
	for (const cityByCountry of citiesByCountry) {
		for (const cityByRoute of citiesByRoute) {
			if (cityByRoute.id === cityByCountry.idCity) {
				cityData.push(cityByRoute);
				break;
			}
		}
	}
	const city = cityData[0];
	const listCities = cityData;

	const interestsData = await Interests.getAll();
	const interestsByCitiesData = await InterestsByCities.getAll();
	const idInterests: number[] = [];
	for (let index = 0; index < interestsByCitiesData.data.length; index++) {
		if (interestsByCitiesData.data[index].idCity === cityData[0].id) idInterests.push(interestsByCitiesData.data[index].idInterest);
	}
	const listInterests: InterestsInterface.Db[] = interestsData.data.filter((interest: InterestsInterface.Db) => idInterests.includes(interest.id));
	// console.log('===listInterests', listInterests)

	const categoriesData = await Categories.getAll();
	const interestData = await Interests.getAllByRouteInterest(params.interests as string);
	const idCategories: number[] = [];
	const categoriesByInterestsData = await CategoriesByInterests.getAllByIdInterest(interestData.data[0].id);
	for (let index = 0; index < categoriesByInterestsData.data.length; index++) {
		idCategories.push(categoriesByInterestsData.data[index].idCategory);
	}
	const listCategories = categoriesData.data.filter((category: CategoryInterface.Db) => idCategories.includes(category.id));
	// console.log('===listCategories', listCategories)

	const interestsByCity = (await InterestsByCities.getAllByCity(city.id))?.data;
	const interestsByRoute = (await Interests.getAllByRouteInterest(params.interests))?.data;
	let interest;
	for (const interestByCity of interestsByCity) {
		for (const interestByRoute of interestsByRoute) {
			if (interestByRoute.id === interestByCity.idInterest) {
				interest = interestByRoute;
				break;
			}
		}
	}

	let category;
	const categoriesByInterest = (await CategoriesByInterests.getAllByIdInterest(interest.id))?.data;
	const categoriesByRoute = (await Categories.getAllByRoute(params.categories))?.data;
	for (const categoryByInterest of categoriesByInterest) {
		for (const categoryByRoute of categoriesByRoute) {
			if (categoryByRoute.id === categoryByInterest.idCategory) {
				category = categoryByRoute;
				break;
			}
		}
	}

	const languagesDb = await Languages.getAll();

	if (!languagesDb.data.length || !countryDb.data.length) return {props: {}};

	const listLanguages = languagesDb.data;

	let textTranslation = {};
	let lang;
	let language;
	const pathLanguage = params.countries;
	if (typeof pathLanguage === 'string') {
		const languageByPath = ML.getLanguageByPath(pathLanguage, listLanguages, country);
		language = listLanguages.find(lang => lang.route === languageByPath)
		lang = languageByPath;
		const textDb = await ML.getTranslationText(languageByPath);
		if (textDb) textTranslation = textDb
		if (!textDb || !languageByPath) return {props: {}};
	}

	let metadata;
	const pathInterest = params.categories;
	if (typeof pathInterest === 'string' && lang) metadata = generateMetadata(textTranslation, pathInterest, lang);

	return {
		props: {
			listLanguages,
			listCountries,
			listCities,
			listInterests,
			listCategories,
			textTranslation,
			country,
			city,
			interest,
			category,
			language,
			metadata
		}
	};
};

export function generateMetadata(text: LanguageTranslationInterface.Txt, pathInterest: string, lang: string):MetadataInterface.Main {
	const getTextForTitle = () => {
		const interest = pathInterest?.length ? text[pathInterest as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.titleInterests];
		const title = interest + mainText;
		return title;
	}

	const getTextForDescription = () => {
		const interest = pathInterest?.length ? text[pathInterest as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.descriptionInterests];
		const description = interest + mainText;
		return description;
	}

	return {
		title: getTextForTitle(),
		description: getTextForDescription(),
		lang
	}
}

export default function CategoriesPage({ listCountries, listCities, listInterests, listCategories, interest, listLanguages, textTranslation, country, category, city, language, metadata }: CategoriesPageProps): JSX.Element {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: session, status } = useSession();
	const currentPagination = useAppSelector(state => PaginationSlice.paginationSelect(state, Constants.namePagination.meetingsList));

	const clearDataMeetings = () => {
		dispatch(MeetingsSlice.clearAll());
		dispatch(DesiresSlice.clearAll());
		dispatch(PaginationSlice.clearAll());
	}

	const getMeetingsFromDb = async (startDate, endDate) => {
		let listMeetings;

		const meetingsDb = await Meetings.getPageByDateMeetingsAndCategory(country.id, city.id, interest.id, category.id, language.id, startDate, endDate, currentPagination?.currentPage);
		if (meetingsDb.data.length === 0) return [];

		const countMeetingsDb = await Meetings.getCountByDateMeetingAndCategory(country.id, city.id, interest.id, category.id, language.id, startDate, endDate);
		const countMeetings = Helpers.calculateCountPageByCountRows(parseInt(countMeetingsDb?.data[0]?.countRowsSqlRequest));

		if (meetingsDb.data.length > 0 && countMeetings > 0) {
			listMeetings = meetingsDb.data;
			if (!currentPagination) {
				dispatch(PaginationSlice.setPagination({maxPage: countMeetings, namePagination: Constants.namePagination.meetingsList}));
			}
			if (currentPagination?.maxPage !== countMeetings) {
				dispatch(PaginationSlice.setPagination({maxPage: countMeetings, namePagination: Constants.namePagination.meetingsList}));
			}
		} else {
			clearDataMeetings();
		}
		return listMeetings;
	}


	useEffect(() => {
		if (session?.user?.email && session?.user?.image && session?.user?.name) dispatch(UserSlice.getIdUserAsync({email: session?.user?.email, image: session?.user?.image, name: session?.user?.name, textTranslation}));
	}, [session, status]);

	return (
		<>
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
			</Head>
			<Main>
				<PublicMeetings
					listCountries={listCountries}
					listLanguages={listLanguages}
					country={country}
					textTranslation={textTranslation}
					metadata={metadata}
					listCities={listCities}
					listInterests={listInterests}
					listCategories={listCategories}
					getMeetingsFromDb={(startDate, endDate) => getMeetingsFromDb(startDate, endDate)}
					clearDataMeetings={clearDataMeetings}
					language={language}
				/>
				<Button name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: '/your-meetings'})}} />
			</Main>
		</>
	)
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

interface CategoriesPageProps {
	listLanguages: LanguagesInterface.Db[];
	text: LanguageTranslationInterface.Txt;
	country: CountriesInterface.Db;
	metadata: MetadataInterface.Main;
}