import React from 'react';
import styles from './MeetingsList.module.css';
import {MeetingsListProps} from './MeetingsList.props';
import { Meeting, ListEmpty, Pagination } from '../../components';
import { useAppSelector } from '../../store/hook';
import { UserSlice } from '../../store/slices';

export const MeetingsList = ({meetings, namePagination}: MeetingsListProps):JSX.Element => {
	const idUser = useAppSelector(state => UserSlice.userSelect(state));
	return (
		<>
			{meetings?.length > 0 && 
				<div className={styles.content}>
					<div className={styles.meetings}>
						{meetings && meetings.map((meeting) => (
							<Meeting  key={meeting.id} meeting={meeting} idUser={idUser} />
						))}
					</div>
					<Pagination namePagination={namePagination} />
				</div>
			}
			{meetings?.length === 0 && <ListEmpty/>}
		</>
	);
};