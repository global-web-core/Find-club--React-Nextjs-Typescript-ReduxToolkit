import {DesiresInterface} from '../interfaces';

export interface SelectedMeetings {
	idMeeting: DesiresInterface.Db["idMeeting"],
	statusWish: DesiresInterface.Db["statusWish"],
	statusReadiness: DesiresInterface.Db["statusReadiness"],
}