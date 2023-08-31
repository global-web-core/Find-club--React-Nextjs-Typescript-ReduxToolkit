import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SelectCountry, Main, Button, Accordion, CircleAnimation, TypingText, MapFolding } from '../components';
import { Countries, Languages } from '../models';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { CountriesInterface, HomeInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../typesAndInterfaces/interfaces';
import { ML, Constants } from '../globals';
import { ReactElement } from 'react';
import { useAppSelector } from '../store/hook';
import { TextTranslationSlice } from '../store/slices';
import Image from 'next/image';
import {imageTeaser} from '../public/images';
import {Layout} from '../layout/Layout';

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	const countriesDb = await Countries.getAll();
	const languagesDb = await Languages.getAll();
	const textDb = await ML.getTranslationText();

	let listCountries: CountriesInterface.Db[] = [];
	let listLanguages: LanguagesInterface.Db[] = [];
	let textTranslation: LanguageTranslationInterface.Txt = {};
	if (countriesDb.data && languagesDb.data && textDb) {
		listCountries = countriesDb.data
		listLanguages = languagesDb.data
		textTranslation = textDb
	}

	const metadata: MetadataInterface.Main = {
		title: textTranslation[ML.key.whoWillGoWithMe],
		description: textTranslation[ML.key.descriptionMainPage],
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

export default function Home({ listCountries, listLanguages, metadata }: HomeInterface.Props): JSX.Element {
	const router = useRouter();
	
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));

  return (
    <div className={styles.home}>
			<Head>
				<title>{Object.keys(textTranslation).length === 0 ? metadata.title : textTranslation[ML.key.whoWillGoWithMe]}</title>
				<meta name="description" content={Object.keys(textTranslation).length === 0 ? metadata.description : textTranslation[ML.key.descriptionMainPage]} />
			</Head>
			<Main>
				<div className={styles.teaser}>
					<div className={styles.contentTeaser}>
						<h2>{textTranslation[ML.key.findPeopleInterest]}</h2>
						<div>{textTranslation[ML.key.doNotKnowWhereFindPeopleWhoPassionate]}</div>
						<div>{textTranslation[ML.key.lotsOfPeopleReadyToSupportYourIdeas]}</div>
						<SelectCountry listCountries={listCountries} listLanguages={listLanguages} text={textTranslation}/>
						<TypingText listText={[textTranslation[ML.key.whoGoingOutWithMe], textTranslation[ML.key.whoDoingIt]]} />
						<CircleAnimation/>
					</div>
					<Image className={styles.imageTeaser} src={imageTeaser} width={642} height={720} alt='teaser' priority  />
				</div>

				<MapFolding/>

				<div className={styles.questionsAnswers}>
					<Accordion
						header={<>{textTranslation[ML.key.whyDidTheIdeaOurApp]}</>}
						hideContent={<>{textTranslation[ML.key.millionsPeopleWantMakeFriends]}</>}
					/>
					<Accordion
						header={<>{textTranslation[ML.key.whatPowerOurIdea]}</>}
						hideContent={
							<>
								<div>{textTranslation[ML.key.fewClicksYouCanFindPeople]}</div>
								<ul>
									<li>{textTranslation[ML.key.goUpEveryoneStreet]}</li>
									<li>{textTranslation[ML.key.textingEveryoneSocialMedia]}</li>
									<li>{textTranslation[ML.key.spendLotTimeWaitingEvent]}</li>
									<li>{textTranslation[ML.key.hangOutChatRooms]}</li>
								</ul>
								<div>{textTranslation[ML.key.enjoyEasyLifeAndProgressIt]}</div>
							</>
						}
					/>
					<Accordion
						header={<>{textTranslation[ML.key.whoCanSuggestMeeting]}</>}
						hideContent={<>{textTranslation[ML.key.youCanChooseMeetingLike]}</>}
					/>
					<Accordion
						header={<>{textTranslation[ML.key.howFindPeopleYourCity]}</>}
						hideContent={<>{textTranslation[ML.key.whenSearchWeTakeIntoLanguageSpeaks]}</>}
					/>
					<Accordion
						header={<>{textTranslation[ML.key.whatGratefulToYou]}</>}
						hideContent={<>{textTranslation[ML.key.byUsingOurProductYouPeopleToUnite]}</>}
					/>
					<Accordion
						header={<>{textTranslation[ML.key.weValueTimeprivacy]}</>}
						hideContent={
							<>
								<div>
									<div>{textTranslation[ML.key.hereSolveOnlyOneproblem]}</div>
									<ul>
										<li>{textTranslation[ML.key.noOneFindYou]}</li>
										<li>{textTranslation[ML.key.noOneRecogniseYourPhoneNumberEmail]}</li>
										<li>{textTranslation[ML.key.noOneSpamYou]}</li>
										<li>{textTranslation[ML.key.noOneToSendUselessMessages]}</li>
									</ul>
								</div>
							</>
						}
					/>
				</div>
				<Button name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: Constants.paths.pathProposeMeeting})}} />
				<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: Constants.paths.pathYourMeetings})}} />
			</Main>
    </div>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}