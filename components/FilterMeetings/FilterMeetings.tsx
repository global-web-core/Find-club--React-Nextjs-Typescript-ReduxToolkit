import { useRouter } from 'next/router';
import {Button, ButtonList} from '../../components';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { CalendarMeetingsSlice, SelectFilterSlice, TextTranslationSlice } from '../../store/slices';
import { Constants, Helpers, ML } from '../../globals';

export const FilterMeetings = (): JSX.Element => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const calendarMeetings = useAppSelector(state => CalendarMeetingsSlice.calendarMeetingsSelect(state));
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const pageYourMeetings = router.pathname === '/your-meetings' || false;

	return (
		<>
			<ButtonList>
				{!pageYourMeetings &&
					<>
						<Button name={calendarMeetings?.activePeriod?.nameMonth} selected={selectFilter.basic === Constants.nameBasicFilter.month ? true : false} onClick={() => dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.month))} />
						<Button name={Helpers.getNameDayByDate(calendarMeetings?.selectedDay || calendarMeetings?.activePeriod?.start) || ''} selected={selectFilter.basic === Constants.nameBasicFilter.day ? true : false} onClick={() => dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.day))} />
					</>
				}
				{pageYourMeetings &&
					<>
						<Button name={textTranslation[ML.key.allUpcoming]} selected={selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.all ? true : false} onClick={() => dispatch(SelectFilterSlice.setYourMeetingsFilter(Constants.nameYourMeetingsFilter.all))} />
						<Button name={textTranslation[ML.key.iOrganise]} selected={selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.my ? true : false} onClick={() => dispatch(SelectFilterSlice.setYourMeetingsFilter(Constants.nameYourMeetingsFilter.my))} />
						<Button name={textTranslation[ML.key.organizedByOthers]} selected={selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.other ? true : false} onClick={() => dispatch(SelectFilterSlice.setYourMeetingsFilter(Constants.nameYourMeetingsFilter.other))} />
						<Button name={textTranslation[ML.key.alreadyGone]}  selected={selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.passed ? true : false} onClick={() => dispatch(SelectFilterSlice.setYourMeetingsFilter(Constants.nameYourMeetingsFilter.passed))} />
					</>
				}
			</ButtonList>
		</>
	);
};