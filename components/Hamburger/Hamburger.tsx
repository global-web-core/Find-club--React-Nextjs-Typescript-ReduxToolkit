import { useState } from 'react';
import styles from './Hamburger.module.css';
import { HamburgerProps } from './Hamburger.props';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { BasicSlice } from '../../store/slices';

export const Hamburger = ({}: HamburgerProps): JSX.Element => {
	const dispatch = useAppDispatch();
	
	const open = useAppSelector(state => BasicSlice.basicSelect(state));
	const click = () => {
		dispatch(BasicSlice.changeOpenHamburger())
	}

	return (
		<>
			<div className={cn(styles.Hamburger, {[styles.open]: open})} onClick={() => click()}>
				<div></div>
			</div>
		</>
	);
};