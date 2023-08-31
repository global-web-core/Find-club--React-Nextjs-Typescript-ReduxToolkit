import { AccordionProps } from './Accordion.props';
import React, { useState } from 'react';
import styles from './Accordion.module.css';
import cn from 'classnames';
import {ArrowOpen} from '../../components';
import { Constants } from '../../globals';

export const Accordion = ({ header, hideContent, noActive }: AccordionProps): JSX.Element => {
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	}
	
	return (
		<>
			<div className={cn(styles.accordion, {[styles.open]: open, [styles.noActive]: noActive})}>
				<div className={styles.header}>
					{header}
					<div className={styles.control} onClick={handleClick}><ArrowOpen open={open} color={Constants.color.light} /></div>
				</div>
				<div className={styles.content}>
					{open &&
						<>
							<hr/>
							{hideContent}
						</>
					}
				</div>
			</div>
		</>
	);
};