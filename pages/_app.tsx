import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	if (typeof window === 'undefined') React.useLayoutEffect = React.useEffect; // I use this trick because you can't use the React hook useLayoutEffect in SSR. I replace useLayoutEffect with useEffect when rendering the application on SSR.
	const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(
		<Component {...pageProps} />
  )
}
