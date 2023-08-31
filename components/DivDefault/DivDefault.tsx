import { Constants } from '../../globals';
import styles from './DivDefault.module.css';
import { DivDefaultProps } from './DivDefault.props';
import cn from 'classnames';
import { useRouter } from 'next/router';

export const DivDefault = ({className, children}: DivDefaultProps): JSX.Element => {
	const router = useRouter();
	const pageYourMeetings = router.pathname === Constants.paths.pathYourMeetings || false;
	const pageProposeMeeting = router.pathname === Constants.paths.pathProposeMeeting || false;

	return (
		<>
			<div className={cn(styles.divDefault, className, {
				[styles.yourMeetings]: pageYourMeetings,
				[styles.proposeMeeting]: pageProposeMeeting
				})}>{children}</div>
		</>
	);
};