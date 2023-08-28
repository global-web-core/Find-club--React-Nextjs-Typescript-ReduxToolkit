import { Constants } from "../../globals";

export interface InitialState {
	basic: keyof typeof Constants.nameBasicFilter,
	yourMeetings: keyof typeof Constants.nameYourMeetingsFilter,
}