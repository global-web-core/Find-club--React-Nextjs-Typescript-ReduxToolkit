import styles from './Hamburger.module.css';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { BasicSlice } from '../../store/slices';

export const Hamburger = (): JSX.Element => {
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