import React from 'react';
import styles from './MeetingsList.module.css';
import {MeetingsListProps} from './MeetingsList.props';
import { Meeting, ListEmpty } from '../../components';

export const MeetingsList = ({meetings, idUser, getListIdMeetings}: MeetingsListProps):JSX.Element => {
	return (
		<div className={styles.meetings}>
			{meetings && meetings.map((meeting) => (
				<Meeting  key={meeting.id} meeting={meeting} idUser={idUser} getListIdMeetings={() => getListIdMeetings()} />
			))}
			{meetings.length === 0 && <ListEmpty/>}
		</div>
	);
};