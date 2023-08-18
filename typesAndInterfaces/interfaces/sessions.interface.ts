export interface Db {
  id: string;
  expires: Date;
  sessionToken: string;
  userId?: string | null;
}

export interface Add {
  expires: Date;
  sessionToken: string;
  userId?: string | null;
}