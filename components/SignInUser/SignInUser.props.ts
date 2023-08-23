import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { getProviders } from "next-auth/react"
import { TypeUnwrapPromise } from '../../typesAndInterfaces/types';


export interface SignInUserProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	listProviders: TypeUnwrapPromise<ReturnType<typeof getProviders>>;
	handleSignIn: (key: string) => void;
}