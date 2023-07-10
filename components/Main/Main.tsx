import { MainProps } from './Main.props';
import styles from './Main.module.css';
import React from 'react';
import cn from 'classnames';

export const Main = ({ className, children, ...props }: MainProps): JSX.Element => {
	return (
		<>
			<main className={cn(styles.main, className)} {...props}>
				{children}
			</main>
		</>
	);
};