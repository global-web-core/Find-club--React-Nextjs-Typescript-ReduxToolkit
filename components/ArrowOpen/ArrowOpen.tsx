import { ArrowOpenProps } from './ArrowOpen.props';
import React from 'react';
import styles from './ArrowOpen.module.css';
import cn from 'classnames';

export const ArrowOpen = ({ open=false, color='dark'}: ArrowOpenProps):JSX.Element => {
	return (
		<>
			<div className={styles.boxArrow}>
				<div className={cn(styles.arrow, {[styles.open]: open, [styles.dark]: color==='dark', [styles.light]: color==='light'})}></div>
			</div>
		</>
	);
};