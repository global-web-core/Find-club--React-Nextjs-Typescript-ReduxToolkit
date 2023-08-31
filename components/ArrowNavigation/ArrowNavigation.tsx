import { ArrowNavigationProps } from './ArrowNavigation.props';
import React from 'react';
import styles from './ArrowNavigation.module.css';
import cn from 'classnames';
import { Constants } from '../../globals';

export const ArrowNavigation = ({ direction, ...props }: ArrowNavigationProps):JSX.Element => {
	return (
		<button className={cn(styles.boxArrow, {[styles.left]: direction===Constants.direction.left, [styles.right]: direction===Constants.direction.right})} {...props} />
	);
};