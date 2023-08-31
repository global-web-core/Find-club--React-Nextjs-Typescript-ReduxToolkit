import { LoadingProps } from './Loading.props';
import styles from './Loading.module.css';
import React from 'react';
import { useAppSelector } from '../../store/hook';
import { TextTranslationSlice } from '../../store/slices';
import { ML } from '../../globals';

export const Loading = ({text}: LoadingProps): JSX.Element => {
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	return (
		<>
			<div className={styles.content}>
				<div className={styles.loading}>
					<p>{text ? text : textTranslation[ML.key.loading] + '...'}</p>
					<span></span>
				</div>
			</div>
		</>
	);
};