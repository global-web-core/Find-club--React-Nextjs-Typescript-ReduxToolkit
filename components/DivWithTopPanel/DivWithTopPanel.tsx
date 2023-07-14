import { DivDefault } from '../../components';
import styles from './DivWithTopPanel.module.css';
import { DivWithTopPanelProps } from './DivWithTopPanel.props';

export const DivWithTopPanel = ({topPanel, children}: DivWithTopPanelProps): JSX.Element => {
	return (
		<>
			<DivDefault>
				<div className={styles.topPanel}>
					{topPanel}
				</div>
				<div className={styles.mainContent}>
					{children}
				</div>
			</DivDefault>
		</>
	);
};