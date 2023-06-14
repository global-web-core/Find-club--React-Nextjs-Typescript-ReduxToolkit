import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SelectCountry, SelectLanguage, BreadCrumbs, Login, Main, Button } from '../components';
import { Countries, Languages } from '../models';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { CountriesInterface, LanguagesInterface, LanguageTranslationInterface } from '../interfaces';
import { ML } from '../globals';
import { useEffect, useState } from 'react';

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	const countriesDb = await Countries.getAll();
	const languagesDb = await Languages.getAll();
	const textDb = await ML.getTranslationText();

	let listCountries: string[] = [];
	let listLanguages: string[] = [];
	let text = {};
	if (countriesDb && languagesDb && textDb) {
		listCountries = countriesDb.data
		listLanguages = languagesDb.data
		text = textDb
	}

	return {
		props: {
			listCountries,
			listLanguages,
			text
		}
	};
};

export default function Home({ listCountries, listLanguages, text }: HomeProps): JSX.Element {
	const router = useRouter();
	const routerQuery = router.query as {[key:string]: string};
	
	const [textTranslation, setTextTranslation] = useState<{[key:string]: string}>({});

	const updateLanguage = async () => {
		const currentTranslationText = await ML.getChangeTranslationText(text, null)
		setTextTranslation(currentTranslationText);
	}

	useEffect(() => {
		ML.setLanguageByBrowser(listLanguages);
		updateLanguage();
	}, []);

  return (
    <>
      <Head>
        <title>{textTranslation[ML.key.whoWillGoWithMe]}</title>
        <meta name="description" content={textTranslation[ML.key.descriptionMainPage]} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
			<Main>
				<Login/>
				<BreadCrumbs currentRoute={routerQuery} text={textTranslation} />
				111
				<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()}  country={null}></SelectLanguage>
				111
				<SelectCountry listCountries={listCountries} listLanguages={listLanguages} text={textTranslation}></SelectCountry>
				111
				<Button  name="Предложить встречу" onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				<Button  name="Ваши встречи" onClick={() => {router.push({pathname: '/your-meetings'})}} />
			</Main>
    </>
  )
}

interface HomeProps {
	listCountries: CountriesInterface.Country[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.Translation[];
}