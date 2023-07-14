import React, { useEffect, useState } from 'react';
import styles from './Meeting.module.css';
import {MeetingProps} from './Meeting.props';
import { Accordion, Button } from '../../components';
import { Constants, Helpers, ML } from '../../globals';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { DesiresSlice, MeetingsSlice, TextTranslationSlice } from '../../store/slices';
import { Desires, Meetings } from '../../models';
import { DesiresInterface, MeetingsInterface } from '../../interfaces';

export const Meeting = ({meeting, idUser, getListIdMeetings}: MeetingProps):JSX.Element => {
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const desires = useAppSelector(state => DesiresSlice.desiresSelect(state));
	const [lengthDesires, setLengthDesires] = useState<LengthDesires[]>([]);
	const dispatch = useAppDispatch();

	const changeStatusMeeting = async (status: number, idMeeting: number) => {
		let newStatus: {status: 0 | 1} | undefined;
		if (status === Constants.activyStatus.ACTIVE) newStatus = {status: Constants.activyStatus.NOT_ACTIVE};
		if (status === Constants.activyStatus.NOT_ACTIVE) newStatus = {status: Constants.activyStatus.ACTIVE};
		await Meetings.update(idMeeting, newStatus);
		const updateMeeting: MeetingsInterface.MeetingsWithDependentData[] = [];
		
		meetings.forEach(meeting => {
			const currentMeeting: MeetingsInterface.MeetingsWithDependentData = JSON.parse(JSON.stringify(meeting));
			
			if (currentMeeting.id === idMeeting) {
				if (newStatus?.status !== undefined) currentMeeting.status = newStatus?.status;
			}
			updateMeeting.push(currentMeeting);
		})
		dispatch(MeetingsSlice.addAll(updateMeeting));
		
	}

	const checkStatusReadiness = (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		if (currentDesires?.statusReadiness === Constants.statusReadiness.READINESS) {
			return true;
		}
		return false;
	}

	const changeStatusReadiness = async (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);

		if (currentDesires && currentDesires?.id) {
			const newStatusReadiness = currentDesires.statusReadiness === Constants.statusReadiness.READINESS ? {statusReadiness: Constants.statusReadiness.NOREADINESS} : {statusReadiness: Constants.statusReadiness.READINESS};
			await Desires.update(currentDesires.id, newStatusReadiness);
			const getUpdateDesire = await Desires.getById(currentDesires.id);
			if (getUpdateDesire?.data.length > 0) {
				const updateDesire = getUpdateDesire.data[0];
				const desiresWithoutUpdateDesire = desires.filter(desire => desire.id !== getUpdateDesire.data[0].id);
				dispatch(DesiresSlice.addAll([...desiresWithoutUpdateDesire, updateDesire]));
			}
		}
	}

	const checkStatusWish = (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		if (currentDesires?.statusWish === Constants.statusWish.WISH) {
			return true;
		}
		return false;
	}

	const changeStatusWish = async (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		
		if (currentDesires && currentDesires?.id) {
			const newStatusWish = currentDesires.statusWish === Constants.statusWish.WISH ? {statusWish: Constants.statusWish.NOWISH} : {statusWish: Constants.statusWish.WISH};
			await Desires.update(currentDesires.id, newStatusWish);
			const getUpdateDesire = await Desires.getById(currentDesires.id);
			if (getUpdateDesire?.data.length > 0) {
				const updateDesire = getUpdateDesire.data[0];
				const desiresWithoutUpdateDesire = desires.filter(desire => desire.id !== getUpdateDesire.data[0].id);
				dispatch(DesiresSlice.addAll([...desiresWithoutUpdateDesire, updateDesire]));
			}
		}
	}

	const checkOwnDesires = (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		if (currentDesires?.statusOrganizer === Constants.statusOrganizer.MY) {
			return true;
		}
		return false;
	}

	const getLengthWish = (idMeeting: number) => {
		const currentDesire = lengthDesires.find(desire => desire.idMeeting === idMeeting);
		if (currentDesire) return currentDesire.lengthWish;
		return 0;
	}

	const getLengthReadiness = (idMeeting: number) => {
		const currentDesire = lengthDesires.find(desire => desire.idMeeting === idMeeting);
		if (currentDesire) return currentDesire.lengthReadiness;
		return 0;
	}

	const getLengthDesires = async () => {
		const listLengthDesires: LengthDesires[] = [];
		const listIdMeetings = getListIdMeetings();
		
		for await (const idMeeting of listIdMeetings) {
			let lengthWish = 0;
			let lengthReadiness = 0;
			
			(await Desires.getByIdMeeting(idMeeting))?.data.forEach((desire: DesiresInterface.Desires) => {
				if (desire.statusWish === Constants.statusWish.WISH) lengthWish++;
				if (desire.statusReadiness === Constants.statusReadiness.READINESS) lengthReadiness++;
			})

			listLengthDesires.push({idMeeting: idMeeting, lengthWish: lengthWish, lengthReadiness: lengthReadiness});
		}
		setLengthDesires(listLengthDesires);
	}

	useEffect(() => {
		if (desires.length > 0) {
			getLengthDesires();
		}
	}, [desires])

	return (
		<>
			<Accordion
				header={
					<>
						<div className={styles.meeting}>
							<div className={styles.nameMeeting}>
								<h2>{meeting.interest}</h2>
								<span className={styles.helperArrow}>&nbsp;→&nbsp;</span>
								<h3>{meeting.category}</h3>
							</div>
							<div>{Helpers.currentDatetimeDbToDatetimeLocalString(meeting.dateMeeting)}</div>
							<div className={styles.statistic}>
								<div className={styles.itemStatistic}>
									<div>{textTranslation[ML.key.wanted]}: {getLengthWish(meeting.id)}</div>
								</div>
								<div className={styles.itemStatistic}>
									<div>{textTranslation[ML.key.confirmations]}: {getLengthReadiness(meeting.id)}</div>
								</div>
							</div>
						</div>
					</>
				}

				hideContent={
					<>
						<div className={styles.hideContent}>
							<div className={styles.mainContent}>
							<div className={cn(styles.statistic, styles.statisticWithoutArrow)}>
								<div className={styles.itemStatistic}>
									{!checkOwnDesires(meeting.id) &&
										<>
											<div className={styles.minor}>{checkStatusWish(meeting.id) ? textTranslation[ML.key.iPlanToGo] : textTranslation[ML.key.iNotGoing]}</div>
											<Button  name={checkStatusWish(meeting.id) ? textTranslation[ML.key.iNotGoing] : textTranslation[ML.key.planningToGo]} onClick={() => changeStatusWish(meeting.id)}/>
										</>
									}
								</div>
								<div className={styles.itemStatistic}>
									{!checkOwnDesires(meeting.id) &&
										<>
											<div className={styles.minor}>{checkStatusReadiness(meeting.id) ? textTranslation[ML.key.iDefinitelyComing] : textTranslation[ML.key.undecided]}</div>
											<Button  name={checkStatusReadiness(meeting.id) ? textTranslation[ML.key.undecided] : textTranslation[ML.key.definitelyComing]} onClick={() => changeStatusReadiness(meeting.id)}/>
										</>
									}
								</div>
							</div>
								<div className={styles.minor}>{checkOwnDesires(meeting.id) ? textTranslation[ML.key.iOrganise] : textTranslation[ML.key.organisesAnother]}</div>
								<div className={styles.minor}>{textTranslation[ML.key.languagePeopleMeeting]} {meeting.language}</div>
								<div className={cn(styles.location, styles.minor)}>
									<div>{meeting.country}&nbsp;→&nbsp;</div>
									<div>{meeting.city}</div>
								</div>
								<div>{meeting.placeMeeting.length > 0 ? textTranslation[ML.key.meetingPoint] + ': ' + meeting.placeMeeting : textTranslation[ML.key.meetingNotSpecifiedDiscuss]}</div>
								<div className={styles.statusMeeting}>
									<div className={styles.controlButton}>
										<Button  name={textTranslation[ML.key.goToChat]}/>
									</div>
									{checkOwnDesires(meeting.id)
										?
											<div className={cn(styles.controlButton, styles.minor)}>
												<div className={styles.emptyBlock}>{meeting.status === Constants.activyStatus.ACTIVE ? textTranslation[ML.key.meetingWill] : textTranslation[ML.key.meetingCancelled]}</div>
												<Button  name={meeting.status === Constants.activyStatus.ACTIVE ? textTranslation[ML.key.cancelMeeting] : textTranslation[ML.key.resumeMeeting]} onClick={() => changeStatusMeeting(meeting.status, meeting.id)}/>
											</div>
										:
											<div className={cn(styles.emptyBlock, styles.minor)}>{meeting.status === Constants.activyStatus.ACTIVE ? textTranslation[ML.key.meetingWill] : textTranslation[ML.key.meetingCancelled]}</div>
									}
									
								</div>
							</div>
						</div>
					</>
				}
			/>
		</>
	);
};

interface LengthDesires {
	idMeeting: number;
	lengthWish: number;
	lengthReadiness: number;
}