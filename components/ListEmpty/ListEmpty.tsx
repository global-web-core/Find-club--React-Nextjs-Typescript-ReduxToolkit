import { ML } from '../../globals';
import { useAppSelector } from '../../store/hook';
import { TextTranslationSlice } from '../../store/slices';
import styles from './ListEmpty.module.css';

export const ListEmpty = (): JSX.Element => {
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	return (
		<>
			<div className={styles.listEmpty}>{textTranslation[ML.key.listIsEmpty]}</div>
		</>
	);
};