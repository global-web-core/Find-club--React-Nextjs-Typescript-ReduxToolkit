import styles from './ListEmpty.module.css';

export const ListEmpty = (): JSX.Element => {
	return (
		<>
			<div className={styles.listEmpty}>Список пуст</div>
		</>
	);
};