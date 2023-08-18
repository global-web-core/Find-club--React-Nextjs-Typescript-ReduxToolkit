import React, { useEffect, useState } from 'react';
import styles from './Meeting.module.css';
import {MeetingProps} from './Meeting.props';
import { Accordion, Button } from '../../components';
import { Constants, Helpers, ML } from '../../globals';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { AlertsSlice, DesiresSlice, MeetingsSlice, TextTranslationSlice } from '../../store/slices';
import { Desires, Meetings } from '../../models';
import { DesiresInterface, MeetingsInterface } from '../../interfaces';

export const Meeting = ({meeting, idUser}: MeetingProps):JSX.Element => {
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const listIdMeetings = useAppSelector(state => MeetingsSlice.listIdMeetingsSelect(state));
	const desires = useAppSelector(state => DesiresSlice.desiresSelect(state));
	const [lengthDesires, setLengthDesires] = useState<LengthDesires[]>([]);
	const [ownDesires, setOwnDesires] = useState(false);
	const [noAccessToControl, setNoAccessToControl] = useState(false);
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
			const newStatusReadiness = currentDesires.statusReadiness === Constants.statusReadiness.READINESS ? {statusReadiness: Constants.statusReadiness.NOREADINESS} : {statusWish: Constants.statusWish.WISH, statusReadiness: Constants.statusReadiness.READINESS};
			const updateRequest = await Desires.update(currentDesires.id, newStatusReadiness);
			const getUpdateDesire = await Desires.getById(currentDesires.id);
			if (updateRequest.code === Constants.codeHttp.ok && getUpdateDesire?.data.length > 0) {
				const updateDesire = getUpdateDesire.data[0];
				const desiresWithoutUpdateDesire = desires.filter(desire => desire.id !== getUpdateDesire.data[0].id);
				dispatch(DesiresSlice.addAll([...desiresWithoutUpdateDesire, updateDesire]));
			}
		} else {
			const dataDesires: DesiresInterface.Add = {
				idUser: idUser,
				idMeeting: meeting.id,
				statusOrganizer: Constants.statusOrganizer.ANOTHER,
				statusWish: Constants.statusWish.WISH,
				statusReadiness: Constants.statusReadiness.READINESS,
				status: Constants.activyStatus.ACTIVE
			};

			const addReadiness = await Desires.add(dataDesires);
			if (addReadiness?.data?.id) {
				const getUpdateDesire = await Desires.getById(addReadiness.data.id);
				const updateDesire = getUpdateDesire.data[0];
				const desiresWithoutUpdateDesire = desires.filter(desire => desire.id !== getUpdateDesire.data[0].id);
				dispatch(DesiresSlice.addAll([...desiresWithoutUpdateDesire, updateDesire]));
				dispatch(AlertsSlice.add(textTranslation[ML.key.yourConfirmationComeAccepted], textTranslation[ML.key.successfully], 'success'));
			} else {
				dispatch(AlertsSlice.add(textTranslation[ML.key.errorYourConfirmationComeAccepted], textTranslation[ML.key.error], 'danger'));
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
			const newStatusWish = currentDesires.statusWish === Constants.statusWish.WISH ? {statusReadiness: Constants.statusReadiness.NOREADINESS, statusWish: Constants.statusWish.NOWISH} : {statusWish: Constants.statusWish.WISH};
			const updateRequest = await Desires.update(currentDesires.id, newStatusWish);
			const getUpdateDesire = await Desires.getById(currentDesires.id);
			if (updateRequest.code === Constants.codeHttp.ok && getUpdateDesire?.data.length > 0) {
				const updateDesire = getUpdateDesire.data[0];
				const desiresWithoutUpdateDesire = desires.filter(desire => desire.id !== getUpdateDesire.data[0].id);
				dispatch(DesiresSlice.addAll([...desiresWithoutUpdateDesire, updateDesire]));
			}
		} else {
			const dataDesires: DesiresInterface.Add = {
				idUser: idUser,
				idMeeting: meeting.id,
				statusOrganizer: Constants.statusOrganizer.ANOTHER,
				statusWish: Constants.statusWish.WISH,
				statusReadiness: Constants.statusReadiness.NOREADINESS,
				status: Constants.activyStatus.ACTIVE
			};

			const addWish = await Desires.add(dataDesires);
			if (addWish?.data?.id) {
				const getUpdateDesire = await Desires.getById(addWish.data.id);
				const updateDesire = getUpdateDesire.data[0];
				const desiresWithoutUpdateDesire = desires.filter(desire => desire.id !== getUpdateDesire.data[0].id);
				dispatch(DesiresSlice.addAll([...desiresWithoutUpdateDesire, updateDesire]));
				dispatch(AlertsSlice.add(textTranslation[ML.key.yourWishComeAccepted], textTranslation[ML.key.successfully], 'success'));
			} else {
				dispatch(AlertsSlice.add(textTranslation[ML.key.errorYourWishComeAccepted], textTranslation[ML.key.error], 'danger'));
			}
		}
	}

	const checkOwnDesires = (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		if (currentDesires?.statusOrganizer === Constants.statusOrganizer.MY) {
			setOwnDesires(true);
		} else {
			setOwnDesires(false);
		}
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
		
		for await (const idMeeting of listIdMeetings) {
			let lengthWish = 0;
			let lengthReadiness = 0;
			
			(await Desires.getByIdMeeting(idMeeting))?.data.forEach((desire: DesiresInterface.Db) => {
				if (desire.statusWish === Constants.statusWish.WISH) lengthWish++;
				if (desire.statusReadiness === Constants.statusReadiness.READINESS) lengthReadiness++;
			})

			listLengthDesires.push({idMeeting: idMeeting, lengthWish: lengthWish, lengthReadiness: lengthReadiness});
		}
		setLengthDesires(listLengthDesires);
	}

	const checkAccessMeeting = () => {
		const currentDesire = desires.find((desire) => desire.idMeeting === meeting.id && desire.idUser === idUser);

		if (currentDesire) {
			if (meeting?.accessMeeting === Constants.accessMeeting.wishing) {
				if (currentDesire.statusWish === Constants.statusWish.NOWISH) setNoAccessToControl(true);
				if (currentDesire.statusWish === Constants.statusWish.WISH) setNoAccessToControl(false);
			}
			if (meeting?.accessMeeting === Constants.accessMeeting.ready) {
				if (currentDesire.statusReadiness === Constants.statusReadiness.NOREADINESS) setNoAccessToControl(true);
				if (currentDesire.statusReadiness === Constants.statusReadiness.READINESS) setNoAccessToControl(false);
			}
		}
	}

	useEffect(() => {
		if (desires.length > 0) {
			checkOwnDesires(meeting.id);
			getLengthDesires();
			checkAccessMeeting();
		}
	}, [desires])

	const handleChangeAccessMeeting = async (e) => {
		if (e?.target?.value) {
			const data = {accessMeeting: e.target.value}
			const result = await Meetings.update(meeting.id, data);
			if (!result) dispatch(AlertsSlice.add(textTranslation[ML.key.whenChangingAccessMeeting], textTranslation[ML.key.error], 'danger'));
		}
	}

	return (
		<>
			<Accordion
				header={
					<>
						<div className={styles.meeting}>
							{noAccessToControl && <h2 className={styles.noControlTitle}>{textTranslation[ML.key.attentionReadDescription]}</h2>}
							<div className={styles.nameMeeting}>
								<h2>{meeting.interest}</h2>
								<span className={styles.helperArrow}>&nbsp;→&nbsp;</span>
								<h3>{meeting.category}</h3>
							</div>
							<div>{Helpers.currentDatetimeDbToDatetimeLocalString(meeting.dateMeeting)}</div>
							<div className={styles.statistic}>
								<div className={styles.itemStatistic}>
									<div>{textTranslation[ML.key.wanted]}: {getLengthWish(meeting.id) > 0 && getLengthWish(meeting.id)}</div>
								</div>
								<div className={styles.itemStatistic}>
									<div>{textTranslation[ML.key.confirmations]}: {getLengthReadiness(meeting.id) > 0 && getLengthReadiness(meeting.id)}</div>
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
									{!ownDesires &&
										<>
											<div className={styles.minor}>{checkStatusWish(meeting.id) ? textTranslation[ML.key.iPlanToGo] : textTranslation[ML.key.iNotGoing]}</div>
											<Button  name={checkStatusWish(meeting.id) ? textTranslation[ML.key.iNotGoing] : textTranslation[ML.key.planningToGo]} onClick={() => changeStatusWish(meeting.id)} disabled={idUser && !noAccessToControl ? false : true} />
										</>
									}
								</div>
								<div className={styles.itemStatistic}>
									{!ownDesires &&
										<>
											<div className={styles.minor}>{checkStatusReadiness(meeting.id) ? textTranslation[ML.key.iDefinitelyComing] : textTranslation[ML.key.undecided]}</div>
											<Button  name={checkStatusReadiness(meeting.id) ? textTranslation[ML.key.undecided] : textTranslation[ML.key.definitelyComing]} onClick={() => changeStatusReadiness(meeting.id)} disabled={idUser && !noAccessToControl ? false : true} />
										</>
									}
								</div>
							</div>
								<div className={styles.minor}>{ownDesires ? textTranslation[ML.key.iOrganise] : textTranslation[ML.key.organisesAnother]}</div>
								<div className={styles.minor}>{textTranslation[ML.key.languagePeopleMeeting]} {meeting.language}</div>
								<div className={cn(styles.location, styles.minor)}>
									<div>{meeting.country}&nbsp;→&nbsp;</div>
									<div>{meeting.city}</div>
								</div>
								<div>{meeting.placeMeeting.length > 0 ? textTranslation[ML.key.meetingPoint] + ': ' + meeting.placeMeeting : textTranslation[ML.key.meetingNotSpecifiedDiscuss]}</div>
								{noAccessToControl && <div>{textTranslation[ML.key.youNotConfirmMeeting]}</div>}
								{ownDesires &&
									<div className={styles.accessMeeting}>
										<div>{textTranslation[ML.key.whoSeeMeeting]}</div>
										<div className={styles.selectAccess}>
											<select name="accessMeeting" id="accessMeeting" onChange={handleChangeAccessMeeting} defaultValue={meeting.accessMeeting}>
												<option value={Constants.accessMeeting.all}>{textTranslation[ML.key.all]}</option>
												<option value={Constants.accessMeeting.ready}>{textTranslation[ML.key.willDefinitelyGo]}</option>
												<option value={Constants.accessMeeting.wishing}>{textTranslation[ML.key.whoGoAndWhoNotSure]}</option>
											</select>
										</div>
									</div>
								}
								<div className={styles.statusMeeting}>
									<div className={styles.controlButton}>
										<Button  name={textTranslation[ML.key.goToChat]} disabled={idUser && !noAccessToControl ? false : true} />
									</div>
									{ownDesires
										?
											<div className={cn(styles.controlButton, styles.minor)}>
												<div className={styles.emptyBlock}>{meeting.status === Constants.activyStatus.ACTIVE ? textTranslation[ML.key.meetingWill] : textTranslation[ML.key.meetingCancelled]}</div>
												<Button  name={meeting.status === Constants.activyStatus.ACTIVE ? textTranslation[ML.key.cancelMeeting] : textTranslation[ML.key.resumeMeeting]} onClick={() => changeStatusMeeting(meeting.status, meeting.id)} disabled={idUser ? false : true} />
											</div>
										:
											<div className={cn(styles.emptyBlock, styles.minor)}>{meeting.status === Constants.activyStatus.ACTIVE && !noAccessToControl ? textTranslation[ML.key.meetingWill] : textTranslation[ML.key.meetingCancelled]}</div>
									}
								</div>
							</div>
						</div>
					</>
				}
				noActive={noAccessToControl}
			/>
		</>
	);
};

interface LengthDesires {
	idMeeting: number;
	lengthWish: number;
	lengthReadiness: number;
}