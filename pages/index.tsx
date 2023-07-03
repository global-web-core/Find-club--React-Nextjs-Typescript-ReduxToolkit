import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SelectCountry, SelectLanguage, BreadCrumbs, Login, Main, Button } from '../components';
import { Countries, Languages } from '../models';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { CountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../interfaces';
import { ML, Constants } from '../globals';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { TextTranslationSlice } from '../store/slices';

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	const countriesDb = await Countries.getAll();
	const languagesDb = await Languages.getAll();
	const textDb = await ML.getTranslationText();

	let listCountries: string[] = [];
	let listLanguages: string[] = [];
	let text:LanguageTranslationInterface.TextTranslation = {};
	if (countriesDb && languagesDb && textDb) {
		listCountries = countriesDb.data
		listLanguages = languagesDb.data
		text = textDb
	}

	const metadata = {
		title: text[ML.key.whoWillGoWithMe],
		description: text[ML.key.descriptionMainPage],
		lang: Constants.settingDefault.LANGUAGE
	}
		
	return {
		props: {
			listCountries,
			listLanguages,
			text,
			metadata
		}
	};
};

export default function Home({ listCountries, listLanguages, text, metadata }: HomeProps): JSX.Element {
	const router = useRouter();
	const routerQuery = router.query as {[key:string]: string};
	const dispatch = useAppDispatch();
	
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));

	const updateLanguage = async () => {
		const currentTranslationText = await ML.getChangeTranslationText(text) || {};
		dispatch(TextTranslationSlice.updateLanguageAsync(currentTranslationText))
	}

	useEffect(() => {
		ML.setLanguageByBrowser(listLanguages);
		updateLanguage();
	}, []);

  return (
    <>
			<Head>
				<title>{Object.keys(textTranslation).length === 0 ? metadata.title : textTranslation[ML.key.whoWillGoWithMe]}</title>
				<meta name="description" content={Object.keys(textTranslation).length === 0 ? metadata.description : textTranslation[ML.key.descriptionMainPage]} />
			</Head>
			<Main>
				<Login/>
				<BreadCrumbs currentRoute={routerQuery} text={textTranslation} />
				111
				<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()}  country={null}></SelectLanguage>
				111
				<SelectCountry listCountries={listCountries} listLanguages={listLanguages} text={textTranslation}></SelectCountry>
				111
				<Button name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: '/your-meetings'})}} />
			</Main>
    </>
  )
}

interface HomeProps {
	listCountries: CountriesInterface.Country[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.TextTranslation;
	metadata: MetadataInterface.Main;
}