import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SelectCountry, SelectLanguage, BreadCrumbs, Login, Main, Button, Accordion, Hamburger, MobileMainMenu, CircleAnimation, TypingText, MapFolding } from '../components';
import { Countries, Languages } from '../models';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { CountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../interfaces';
import { ML, Constants } from '../globals';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { TextTranslationSlice } from '../store/slices';
import Image from 'next/image';
import {iconLogo, imageTeaser} from '../public/images';
import Link from 'next/link';

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
		if (typeof window !== "undefined") document.documentElement.lang = ML.getLanguage()
		dispatch(TextTranslationSlice.updateLanguageAsync(currentTranslationText))
	}
	
	useEffect(() => {
		ML.setLanguageByBrowser(listLanguages);
		updateLanguage();
	}, []);

  return (
    <div className={styles.home}>
			<Head>
				<title>{Object.keys(textTranslation).length === 0 ? metadata.title : textTranslation[ML.key.whoWillGoWithMe]}</title>
				<meta name="description" content={Object.keys(textTranslation).length === 0 ? metadata.description : textTranslation[ML.key.descriptionMainPage]} />
			</Head>
			<div className={styles.header}>
				<Link href="/" className={styles.iconLogo}><Image src={iconLogo} width={100} height={100} alt='logo' /></Link>
				<h1 className={styles.titleLogo}>{textTranslation[ML.key.whoGoWithMe]}</h1>
				<div className={styles.controlLogo}>
					<div className={styles.controlDesktop}>
						<Login/>
						<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()}  country={null}></SelectLanguage>
					</div>
					<div className={styles.controlMobile}>
						<Hamburger/>
						<MobileMainMenu>
							<>
								<Login/>
								<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()}  country={null}></SelectLanguage>
								<Button name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
								<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: '/your-meetings'})}} />
							</>
						</MobileMainMenu>
					</div>
				</div>
			</div>
			<Main>
				<div className={styles.teaser}>
					<div className={styles.contentTeaser}>
						<h2>Найди людей по интересам</h2>
						<div>Не знаешь где найти людей которые увлечены тем же что и ты? Или быть может ты хочешь пойти куда то, но незнаешь где найти компанию?</div>
						<div>Здесь многа людей готовых поддержать любую вашу идею прямо сейчас или когда вам будет удобно. Легко и быстро найти или предложить встречу. В любой стране и любом городе.</div>
						<SelectCountry listCountries={listCountries} listLanguages={listLanguages} text={textTranslation}></SelectCountry>
						<TypingText listText={['Кто со мной гулять?', 'Кто занимается IT?']} />
						<CircleAnimation/>
					</div>
					<Image className={styles.imageTeaser} src={imageTeaser} width={642} height={720} alt='teaser' />
				</div>

				<MapFolding/>

				<div className={styles.questionsAnswers}>
					<Accordion
						header={
							<>
								Почему появилась идея нашего приложения?
							</>
						}

						hideContent={
							<>
								Миллионы людей по всему миру, хотят находить друзей (нетворкинг) по своим интересам. Огромное количество людей полузуются социальными сетями, но они не спроектированны таким образом чтобы вы могли легко и быстро найти нетворкинг. А наше приложение позволяем легко найти людей по любому интересному для вас направлению, и назначить встречу в удобное для вас время.
							</>
						}
					/>
					<Accordion
						header={
							<>
								В чем сила нашей идеи?
							</>
						}

						hideContent={
							<>
								<div>В несколько кликов вы сможете находить интересных встречи и людей. И для этого вам больше не нужно:</div>
								<ul>
									<li>подходить ко всем подряд на улице</li>
									<li>писать всем подряд сообщения в социальных сетях</li>
									<li>тратить много времени дожидаясь какого то крупного события</li>
									<li>долго зависать в чатах</li>
								</ul>
								<div>Наслаждайся легкой жизнью и прогрессом мира информационных технологий!</div>
							</>
						}
					/>
					<Accordion
						header={
							<>
								Кто может предложить встречу?
							</>
						}

						hideContent={
							<>
								Вы можете выбрать любое понравившееся предложение о встрече. Так же вы можете создать свою встречу, в которой вы предложите свою идею и время когда вам будет удобно это сделать.
							</>
						}
					/>
					<Accordion
						header={
							<>
								Как найти людей в вашем городе на других языках?
							</>
						}

						hideContent={
							<>
								При поиске или создание встречи, мы учитываем на каком языке говорит человек. Поэтому сменив язык вы сможете находить сообщества на любом интересном языке.
							</>
						}
					/>
					<Accordion
						header={
							<>
								За что мы очень благодарны Вам?
							</>
						}

						hideContent={
							<>
								Пользуясь нашим продуктом, вы помогаете людям объединятся. И даже если человек переедет в другой город, или другую страну, он не останется один.
							</>
						}
					/>
					<Accordion
						header={
							<>
								Мы ценим ваше время и конфиденциальность! Как мы это реализовали?
							</>
						}

						hideContent={
							<>
								<div>
									<div>Здесь вы сможете решать только одну задачу, легко находить людей по интересам, и вы останетесь инкогнито. Вас не будут доставать!</div>
									<ul>
										<li>Ни кто не сможет вас найти</li>
										<li>Ни кто не узнает ваш телефон или email</li>
										<li>Ни кто не сможет вам спамить</li>
										<li>Ни кто не сможет вам отправлять много бесполезных сообщений и уведомлений</li>
									</ul>
								</div>
							</>
						}
					/>
				</div>
				<Button name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: '/your-meetings'})}} />
			</Main>
    </div>
  )
}

interface HomeProps {
	listCountries: CountriesInterface.Country[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.TextTranslation;
	metadata: MetadataInterface.Main;
}