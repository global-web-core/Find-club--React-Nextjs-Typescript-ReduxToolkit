import React, { useEffect, useState } from 'react';
import styles from './MeetingsList.module.css';
import {MeetingsListProps} from './MeetingsList.props';
import { Meeting, ListEmpty, Pagination, Loading } from '../../components';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { DesiresSlice, MeetingsSlice, TextTranslationSlice, UserSlice } from '../../store/slices';
import { ML } from '../../globals';

export const MeetingsList = ({namePagination}: MeetingsListProps):JSX.Element => {
	const dispatch = useAppDispatch();
	const idUser = useAppSelector(state => UserSlice.userSelect(state));
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const meetingsAllData = useAppSelector(state => MeetingsSlice.meetingsSelectAllData(state));
	const listIdMeetings = useAppSelector(state => MeetingsSlice.listIdMeetingsSelect(state));
	const desiresAllData = useAppSelector(state => DesiresSlice.desiresSelectAllData(state));
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		if (meetings?.length > 0) {
			dispatch(DesiresSlice.getDesiresByIdMeeting({textTranslation, listIdMeetings}))
		}
	}, [meetings]);

	useEffect(() => {
		if (desiresAllData.status === 'idle' && desiresAllData.error === null && meetingsAllData.error === null && meetings?.length > 0) {
			setLoading(false);
		}
	}, [desiresAllData]);
	return (
		<>
			{meetings?.length > 0 && !loading && 
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
			{loading && <Loading textTranslation={textTranslation[ML.key.loading]} />}
		</>
	);
};