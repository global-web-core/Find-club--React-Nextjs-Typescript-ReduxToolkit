import styles from './DivDefault.module.css';
import { DivDefaultProps } from './DivDefault.props';
import cn from 'classnames';
import { useRouter } from 'next/router';

export const DivDefault = ({children}: DivDefaultProps): JSX.Element => {
	const router = useRouter();
	const pageYourMeetings = router.pathname === '/your-meetings' || false;

	return (
		<>
			<div className={cn(styles.divDefault, {[styles.yourMeetings]: pageYourMeetings})}>{children}</div>
		</>
	);
};