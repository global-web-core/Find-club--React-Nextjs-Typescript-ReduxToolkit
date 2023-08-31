import { ArrowOpenProps } from './ArrowOpen.props';
import React from 'react';
import styles from './ArrowOpen.module.css';
import cn from 'classnames';
import { Constants } from '../../globals';

export const ArrowOpen = ({ open=false, color=Constants.color.dark}: ArrowOpenProps):JSX.Element => {
	return (
		<>
			<div className={styles.boxArrow}>
				<div className={cn(styles.arrow, {[styles.open]: open, [styles.dark]: color === Constants.color.dark, [styles.light]: color === Constants.color.light})}></div>
			</div>
		</>
	);
};