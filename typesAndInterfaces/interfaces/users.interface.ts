import {TypeEmail, TypeImage, TypeName} from '../types';

export interface Db {
  id: string;
  name: TypeName;
  email: TypeEmail;
  emailVerified: Date | null;
  image: TypeImage;
}

export interface Update {
  id?: string;
  name?: TypeName;
  email?: TypeEmail;
  emailVerified?: Date | null;
  image?: TypeImage;
}