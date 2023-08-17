export interface Http<ObjectFromDB> {
	code: 200 | 404;
	data: ObjectFromDB[] | undefined;
}