import { BreadCrumbs, Login, SelectCity, SelectLanguage, Main } from '../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Languages } from '../../models';
import { useRouter } from 'next/router';
import { CitiesInterface, CountriesInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface } from '../../interfaces';
import { ParsedUrlQuery } from 'querystring';
import { ML } from '../../globals';
import { useEffect, useState } from 'react';

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
	
	const textDb = await ML.getTranslationText();
	let text = {};
	if (textDb) text = textDb
	
	const country = await Countries.getByRoute((params.countries as string).slice(0, 2) as string);
	if (!country.data.length) return {props: {}};
	const citiesCountry = await CitiesByCountries.getAllByCountry(country.data[0].id);
	
	if (!citiesCountry.data.length) return {props: {}};
	const idCities = citiesCountry.data.map((city: CitiesByCountriesInterface.CityByCountries) => city.idCity);
	const citiesData = await Cities.getAll();
	
	if (!idCities.length || !citiesData.data.length) return {props: {}};
	const listCities: string[] = citiesData.data.filter((city: CitiesInterface.City) => idCities.includes(city.id));

	let listLanguages: string[] = [];
	const languagesDb = await Languages.getAll();
	if (languagesDb) listLanguages = languagesDb.data

	return {
		props: {
			listCities,
			listLanguages,
			text,
			country: country.data[0]
		}
	};
};

export default function CountriesPage({ listCities, listLanguages, text, country }: CountriesPageProps): JSX.Element {
	const router = useRouter();
	const routerQuery = router.query as {[key:string]: string};
	
	const [textTranslation, setTextTranslation] = useState({});
	
	const updateLanguage = async () => {
		const currentTranslationText = await ML.getChangeTranslationText(text)
		setTextTranslation(currentTranslationText);
	}
	
	useEffect(() => {
		ML.setLanguageByPath(router.query.countries as string, listLanguages, country);
		updateLanguage();
	}, []);

	return (
		<Main>
			<Login />
			<BreadCrumbs currentRoute={routerQuery} text={textTranslation} />
			<SelectCity listCities={listCities} text={textTranslation}></SelectCity>
			<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()} country={country}></SelectLanguage>
		</Main>
	)
}

interface CountriesPageProps {
	listCities: CitiesInterface.City[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.Translation[];
	country: CountriesInterface.Country;
}