import { TypeItemMessage } from './Alert.types';
import styles from './Alert.module.css';
import React, { useEffect } from 'react';
import cn from 'classnames';
import {iconDone, iconInfo, iconWarning, iconDanger} from './images';
import Image from 'next/image';
import { AlertsSlice } from '../../store/slices'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { Constants } from '../../globals';

const timeTimeout = 3000;

export const Alert = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const listMessages: TypeItemMessage[] = useAppSelector(state => AlertsSlice.alertsSelect(state));

	const firstLetterUpperCase = (word: string) => {
		if (word?.length) return word.charAt(0).toUpperCase() + word.slice(1);
		return word;
	}

	const pathCurrentIcon = {
		[Constants.typeAlert.success]: iconDone,
		[Constants.typeAlert.info]: iconInfo,
		[Constants.typeAlert.warning]: iconWarning,
		[Constants.typeAlert.danger]: iconDanger
	}

	const handleClickRemove = (idMessage: string) => {
		dispatch(AlertsSlice.removeMessage(idMessage));
	}

	useEffect(() => {
		const interval = setTimeout(() => {	
			if (listMessages[0]?.id) handleClickRemove(listMessages[0].id)
		}, timeTimeout);			
		return () => clearTimeout(interval);
	}, [listMessages])

	useEffect(() => {
		return () => {
			dispatch(AlertsSlice.removeAll())
		}
	}, [])

	return (
		<>
			<div className={styles.content}>
				{listMessages.length > 0 && listMessages.map(message => (
						<div
							className={cn(styles.alert, {[styles.alertSuccess]: message.typeAlert === Constants.typeAlert.success,[styles.alertInfo]: message.typeAlert === Constants.typeAlert.info, [styles.alertWarning]: message.typeAlert === Constants.typeAlert.warning, [styles.alertDanger]: message.typeAlert === Constants.typeAlert.danger})}
							key={message.id}
						>
							<div className={styles.icon}>
								<Image src={message.typeAlert ? pathCurrentIcon[message.typeAlert] : ''}
									fill
									alt='icon'
									sizes="34, 41"
								/>
							</div>
							<div className={styles.text}>
								{message.title && <span><strong>{firstLetterUpperCase(message.title)}!</strong></span>}
								<span>{message.message}</span>
							</div>
							<button type="button" className={styles.close} onClick={() => handleClickRemove(message.id)}>×</button>
						</div>
					))
				}
			</div>
		</>
	);
};