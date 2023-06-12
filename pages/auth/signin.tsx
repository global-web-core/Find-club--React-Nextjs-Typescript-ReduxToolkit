import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import {SignInUser} from '../../components';
import { useRouter } from "next/router";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const handleSignIn = (providerId: string) => {
		const backRouter = (router.query.callbackUrl as string) || '/';
		signIn(providerId, {callbackUrl: backRouter});
	}
  return (
    <>
			<SignInUser listProviders={providers} handleSignIn={(providerId) => handleSignIn(providerId)} />
    </>
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
	// console.log('--context', context);
  
  return {
    props: { providers: providers ?? [] },
  }
}