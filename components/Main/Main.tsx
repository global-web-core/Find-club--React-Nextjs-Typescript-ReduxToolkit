import { MainProps } from './Main.props';
import styles from './Main.module.css';
import React from 'react';

export const Main = ({ children }: MainProps): JSX.Element => {
	return (
		<>
			<main className={styles.main}>
				{children}
			</main>
		</>
	);
};