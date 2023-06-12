export type TypeAlert = 'success' | 'info' | 'warning' | 'danger';
export type TypeMessage = {message: string, title?: string | null, typeAlert?: TypeAlert};
export type TypeItemMessage = {id: string } & TypeMessage;