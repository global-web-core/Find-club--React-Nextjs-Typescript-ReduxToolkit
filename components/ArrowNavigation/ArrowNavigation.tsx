import { ArrowNavigationProps } from './ArrowNavigation.props';
import React from 'react';
import styles from './ArrowNavigation.module.css';
import cn from 'classnames';

export const ArrowNavigation = ({ direction, ...props }: ArrowNavigationProps):JSX.Element => {
	return (
		<button className={cn(styles.boxArrow, {[styles.left]: direction==='left', [styles.right]: direction==='right'})} {...props} />
	);
};