export interface Interest {
	id: number;
	interest: string;
	route: string;
	status: 1 | 0;
	translation?: string;
}