import { BreadCrumbs, Login, SelectInterest, SelectLanguage } from '../../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages } from '../../../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface } from '../../../interfaces';
import { ParsedUrlQuery } from 'querystring';
import { ML } from '../../../globals';
import { useEffect, useState } from 'react';
import { Main } from '../../../components';

export const getStaticPaths: GetStaticPaths = async () => {
	const listCountries = await Countries.getAll();
	const listCities = await Cities.getAll();
	const listCitiesByCountries = await CitiesByCountries.getAll();
	const listLanguages = await Languages.getAll();

	const paths: string[] = [];

	if (listCountries.data.length && listCities.data.length && listCitiesByCountries.data.length && listLanguages.data.length) {
		listCitiesByCountries.data.forEach((cityByCountry: CitiesByCountriesInterface.CityByCountries) => {
			listCountries.data.forEach((country: CountriesInterface.Country) => {
				listLanguages.data.forEach((language: LanguagesInterface.Languages) => {
					let countryRoute = '';
					if (country.id === language.idCountry) {
						countryRoute = '/' + country.route;
					} else {
						countryRoute = '/' + country.route + '-' + language.route;
					}

					if (country.id === cityByCountry.idCountry) {
						const cityRoute = listCities.data.find((city: CitiesInterface.City) => city.id === cityByCountry.idCity);
						if (!country && !cityRoute) return {paths: [], fallback: false};
						const url = countryRoute + '/' + cityRoute.route;
						paths.push(url);
					}
				});
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

	const country = await Countries.getByRoute((params.countries as string).slice(0, 2));
	const cityData = await Cities.getAllByRouteCity(params.cities as string);
	const interestsData = await Interests.getAll();
	const interestsByCitiesData = await InterestsByCities.getAll();
	if (!country || !cityData.data.length || !interestsData.data.length || !interestsByCitiesData.data.length) return {props: {}};

	const idInterests: number[] = [];
	for (let index = 0; index < interestsByCitiesData.data.length; index++) {
		if (interestsByCitiesData.data[index].idCity === cityData.data[0].id) idInterests.push(interestsByCitiesData.data[index].idInterest);
	}

	const listInterests: InterestsInterface.Interest[] = interestsData.data.filter((interest: InterestsInterface.Interest) => idInterests.includes(interest.id));

	const textDb = await ML.getTranslationText();
	let text = {};
	if (textDb) text = textDb

	let listLanguages: string[] = [];
	const languagesDb = await Languages.getAll();
	if (languagesDb) listLanguages = languagesDb.data

	return {
		props: {
			listInterests,
			listLanguages,
			text,
			country: country.data[0]
		}
	};
};

export default function CountriesPage({ listInterests, listLanguages, text, country }: CountriesPageProps): JSX.Element {
	const router = useRouter();
	const routerQuery = router.query as {[key:string]: string};
	
	const [textTranslation, setTextTranslation] = useState({});
	
	const updateLanguage = async () => {
		const currentTranslationText = await ML.getChangeTranslationText(text, null)
		setTextTranslation(currentTranslationText);
	}
	
	useEffect(() => {
		ML.setLanguageByPath(router.query.countries as string, listLanguages, country);
		updateLanguage();
	}, []);

	return (
		<Main>
			<Login/>
			<BreadCrumbs currentRoute={routerQuery} text={textTranslation} />
			<SelectInterest  listInterests={listInterests} text={textTranslation}></SelectInterest>
			<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()} country={country}></SelectLanguage>
		</Main>
	)
}

interface CountriesPageProps {
	listInterests: InterestsInterface.Interest[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.Translation[];
	country: CountriesInterface.Country;
}