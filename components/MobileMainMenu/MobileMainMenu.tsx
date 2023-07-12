import styles from './MobileMainMenu.module.css';
import { MobileMainMenuProps } from './MobileMainMenu.props';
import cn from 'classnames';
import { useAppSelector } from '../../store/hook';
import { BasicSlice } from '../../store/slices';

export const MobileMainMenu = ({children}: MobileMainMenuProps): JSX.Element => {
	const open = useAppSelector(state => BasicSlice.basicSelect(state));

	return (
		<>
			<div className={cn(styles.Menu, {[styles.open]: open})}>
				{children}
			</div>
		</>
	);
};