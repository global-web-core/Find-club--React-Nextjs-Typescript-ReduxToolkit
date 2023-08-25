import { LoadingProps } from './Loading.props';
import styles from './Loading.module.css';
import React from 'react';

export const Loading = ({textTranslation}: LoadingProps): JSX.Element => {
	return (
		<>
			<div className={styles.content}>
				<div className={styles.loading}>
					<p>{textTranslation ? textTranslation : 'Loading...'}</p>
					<span></span>
				</div>
			</div>
		</>
	);
};