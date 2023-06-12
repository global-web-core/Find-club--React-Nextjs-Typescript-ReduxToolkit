import { ButtonProps } from './Button.props';
import React, { forwardRef } from 'react';
import styles from './Button.module.css';
import cn from 'classnames';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(( {name, leftAngle=false, selected=false, ...props}, ref):JSX.Element => {
	return (
		<>
			{name && 
				<button ref={ref} { ...props } className={cn(styles.button, {[styles.leftAngle]: leftAngle, [styles.selected]: selected})}>{ name }</button>
			}
		</>
	);
});

Button.displayName = "Button";