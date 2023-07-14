import styles from './ButtonList.module.css';
import { ButtonListProps } from './ButtonList.props';

export const ButtonList = ({children}: ButtonListProps): JSX.Element => {
	return (
		<div className={styles.listButton}>
			{children}
		</div>
	);
};