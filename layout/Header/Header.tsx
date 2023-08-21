import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import {HeaderProps} from './Header.props';
import Link from 'next/link';
import { BreadCrumbs, Button, Hamburger, Login, MobileMainMenu, SelectLanguage } from '../../components';
import Image from 'next/image';
import {iconLogo} from '../../public/images';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { TextTranslationSlice } from '../../store/slices';
import { Constants, ML } from '../../globals';
import { useRouter } from 'next/router';
import { Languages } from '../../models';
import { LanguagesInterface } from '../../interfaces';

export const Header = ({pageProps}: HeaderProps):JSX.Element => {
	const router = useRouter();
	const missingServerProps = Object.keys(pageProps).length === 0;
	const dispatch = useAppDispatch();

	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const [listLanguages, setListLanguages] = useState<LanguagesInterface.Db[]>([]);

	useEffect(() => {
		async function startFetching() {
			if (missingServerProps) {
				const languagesDb = await Languages.getAll();
				const listLanguagesDb = languagesDb.data;
				setListLanguages(listLanguagesDb);
				ML.setLanguageByBrowser(listLanguagesDb);
			} else {
				setListLanguages(pageProps.listLanguages);
			}
			updateLanguage();
		}
		startFetching();
	}, [])

	const updateLanguage = async () => {
		const currentTranslationText = await ML.getChangeTranslationText(pageProps.textTranslation) || {};
		dispatch(TextTranslationSlice.updateLanguageAsync(currentTranslationText))
		if (typeof window !== "undefined") document.documentElement.lang = ML.getLanguage() || Constants.settingDefault.LANGUAGE;
	}

	return (
		<>
			<div className={styles.header}>
				<Link href="/" className={styles.iconLogo}><Image src={iconLogo} width={80} height={80} alt='logo' priority /></Link>
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
			{router.pathname !== '/' && <BreadCrumbs text={textTranslation} />}
		</>
	);
};