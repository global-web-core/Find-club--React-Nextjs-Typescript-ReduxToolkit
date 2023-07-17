import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import {Main, SelectLanguage, SignInUser} from '../../components';
import { useRouter } from "next/router";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { TextTranslationSlice } from "../../store/slices";
import { ML } from "../../globals";
import { Languages } from "../../models";
import { ReactElement, useEffect, useState } from "react";
import { LanguagesInterface } from "../../interfaces";
import styles from '../../styles/Signin.module.css';
import {WithoutLayout} from '../../layout/Layout';

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const [listLanguages, setListLanguages] = useState<LanguagesInterface.Languages[]>([]);
	const updateLanguage = () => {
		if (typeof window !== "undefined") document.documentElement.lang = ML.getLanguage()
		dispatch(TextTranslationSlice.updateLanguageAsync())
	}
	const handleSignIn = (providerId: string) => {
		const backRouter = (router.query.callbackUrl as string) || '/';
		signIn(providerId, {callbackUrl: backRouter});
	}
	useEffect(() => {
		async function startFetching() {
			const languagesDb = await Languages.getAll();
			const listLanguagesDb = languagesDb.data;
			setListLanguages(listLanguagesDb);
			ML.setLanguageByBrowser(listLanguagesDb);
			updateLanguage();
		}
		startFetching();
	}, [])

  return (
    <>
			<Head>
				<title>{textTranslation[ML.key.logInYourAccount]}</title>
				<meta name="description" content={textTranslation[ML.key.descriptionSignin]} />
			</Head>
			<Main>
				<div className={styles.selectLanguage}>
					<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()}  country={null}></SelectLanguage>
				</div>
				<SignInUser listProviders={providers} handleSignIn={(providerId) => handleSignIn(providerId)} />{/* TODO: make a type for listProviders */}
			</Main>
    </>
  )
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return (
    <WithoutLayout>
      {page}
    </WithoutLayout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  
  return {
    props: { providers: providers ?? [] },
  }
}