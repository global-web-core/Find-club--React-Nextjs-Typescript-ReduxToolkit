import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import React from 'react'
import { Provider } from 'react-redux'
import store from '../store/store'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
	if (typeof window === 'undefined') React.useLayoutEffect = React.useEffect; // I use this trick because you can't use the React hook useLayoutEffect in SSR. I replace useLayoutEffect with useEffect when rendering the application on SSR.
  return (
		<Provider store={store}>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</Provider>
  )
}
