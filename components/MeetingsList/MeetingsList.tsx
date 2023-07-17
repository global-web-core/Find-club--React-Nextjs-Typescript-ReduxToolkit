import React from 'react';
import styles from './MeetingsList.module.css';
import {MeetingsListProps} from './MeetingsList.props';
import { Meeting, ListEmpty } from '../../components';
import { useAppSelector } from '../../store/hook';
import { UserSlice } from '../../store/slices';

export const MeetingsList = ({meetings, getListIdMeetings}: MeetingsListProps):JSX.Element => {
	const idUser = useAppSelector(state => UserSlice.userSelect(state));
	return (
		<div className={styles.meetings}>
			{meetings && meetings.map((meeting) => (
				<Meeting  key={meeting.id} meeting={meeting} idUser={idUser} getListIdMeetings={() => getListIdMeetings()} />
			))}
			{meetings.length === 0 && <ListEmpty/>}
		</div>
	);
};