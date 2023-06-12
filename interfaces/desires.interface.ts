export interface Desires {
	id?: number;
	idUser: string;
	idMeeting: number;
	statusOrganizer: 1 | 0;
	statusWish: 1 | 0;
	statusReadiness: 1 | 0;
	status: 1 | 0;
}