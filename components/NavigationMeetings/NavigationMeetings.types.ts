import { Constants } from "../../globals";

export interface DefaultValues {
	country: string | null;
	city: string | null;
	interest: string | null;
	category: string | null;
}

export type Navigation = {[key in Constants.navigationMeetings]?: string} | Record<string, never>