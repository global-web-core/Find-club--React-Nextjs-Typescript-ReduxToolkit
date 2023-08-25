import { Constants } from "../../globals";

export interface OneOrZero {
	[key:string]: 0 | 1,
}

export interface SelectValueNavigation {
	name: keyof typeof Constants.navigationMeetings;
	value: string;
}

export interface SelectValue {
	name: string;
	value: string;
}

export interface Options {
	value: string;
	label: string;
}

export type ListOptions = Options[]