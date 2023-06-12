import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { getProviders } from "next-auth/react"

export interface SignInUserProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	listProviders: typeof getProviders;
	handleSignIn: (key: string) => void;
}