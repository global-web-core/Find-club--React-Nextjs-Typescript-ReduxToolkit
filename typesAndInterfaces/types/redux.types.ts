import { Constants } from "../../globals";

export type ErrorFetchRedux = string | null;
export type StatusFetchRedux = keyof typeof Constants.statusFetch;