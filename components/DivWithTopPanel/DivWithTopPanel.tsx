import { DivDefault } from '../../components';
import styles from './DivWithTopPanel.module.css';
import { DivWithTopPanelProps } from './DivWithTopPanel.props';
import cn from 'classnames';

export const DivWithTopPanel = ({topPanel, meetingsListMain=false, children}: DivWithTopPanelProps): JSX.Element => {
	return (
		<>
			<DivDefault className={cn({[styles.meetingsListMain]: meetingsListMain})}>
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