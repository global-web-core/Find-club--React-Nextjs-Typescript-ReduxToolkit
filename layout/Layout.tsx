import { Provider } from 'react-redux'
import store from '../store/store'
import { Header } from "./Header/Header"
import { SessionProvider } from "next-auth/react"
import { ReactElement } from 'react';
import { Alert } from '../components';

export interface LayoutProps {
	children: ReactElement;
}

function Layout({ children }: LayoutProps) {
	const pageProps = children.props;
	return (
		<Provider store={store}>
			<SessionProvider session={pageProps.session}>
				<Header pageProps={pageProps} />
				{children}
				<Alert/>
			</SessionProvider>
		</Provider>
	)
}

function WithoutLayout({ children }: LayoutProps) {
	const pageProps = children.props;
	return (
		<Provider store={store}>
			<SessionProvider session={pageProps.session}>
				{children}
				<Alert/>
			</SessionProvider>
		</Provider>
	)
}

export {
	Layout,
	WithoutLayout
}