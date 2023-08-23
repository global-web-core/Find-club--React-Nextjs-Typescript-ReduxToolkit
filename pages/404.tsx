import React, { ReactElement } from 'react';
import { Layout } from '../layout/Layout';
import styles from '../styles/404.module.css'
import cn from 'classnames';
import { Button } from '../components';
import router from 'next/router';
import { Constants, ML } from '../globals';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Countries, Languages } from '../models';
import { CountriesInterface, LanguageTranslationInterface, LanguagesInterface, NotFoundInterface } from '../typesAndInterfaces/interfaces';
import { TextTranslationSlice } from '../store/slices';
import { useAppSelector } from '../store/hook';


export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	const countriesDb = await Countries.getAll();
	const languagesDb = await Languages.getAll();
	const textDb = await ML.getTranslationText();

	let listCountries: CountriesInterface.Db[] = [];
	let listLanguages: LanguagesInterface.Db[] = [];
	let textTranslation: LanguageTranslationInterface.Txt = {};
	if (countriesDb && languagesDb && textDb && countriesDb.data && languagesDb.data) {
		listCountries = countriesDb.data
		listLanguages = languagesDb.data
		textTranslation = textDb
	}

	const metadata = {
		title: textTranslation[ML.key.pageNotFound],
		description: textTranslation[ML.key.descriptionPageNotFound],
		lang: Constants.settingDefault.LANGUAGE
	}
		
	return {
		props: {
			listCountries,
			listLanguages,
			textTranslation,
			metadata
		}
	};
};

export default function Error404({textTranslation}: NotFoundInterface.Props): JSX.Element {
	textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	return (
		<>
			<div className={styles.center}>
				<h1 className={styles.title}>{textTranslation[ML.key.pageNotFound]}</h1>
				<div className={styles.error}>
					<div className={styles.number}>4</div>
					<div className={styles.illustration}>
						<div className={styles.circle}></div>
						<div className={styles.paper}>
							<div className={styles.face}>
								<div className={cn(styles.eyebrow, styles['eyebrow-left'])}></div>
								<div className={cn(styles.eyebrow, styles['eyebrow-right'])}></div>
								<div className={styles.eyes}>
									<div className={cn(styles.eye, styles['eye-left'])}></div>
									<div className={cn(styles.eye, styles['eye-right'])}></div>
								</div>
								<div className={cn(styles.rosyCheeks, styles['rosyCheeks-left'])}></div>
								<div className={cn(styles.rosyCheeks, styles['rosyCheeks-right'])}></div>
								<div className={styles.mouth}></div>
							</div>
						</div>
					</div>
					<div className={styles.number}>4</div>
				</div>
				<div className={styles.text}>{textTranslation[ML.key.ooopsPageNoExist]}</div>
				<Button name={textTranslation[ML.key.goToHome]} onClick={() => {router.push({pathname: '/'})}} />
			</div>
		</>
    );
}

Error404.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}