import { Users, Accounts, Sessions } from '../../models';
import {Helpers} from '../index';
import type { Adapter } from "next-auth/adapters"

function generateId (length: number) {
	return Helpers.randomGenerateLetterAndNumber(length);
}

/** @return { import("next-auth/adapters").Adapter } */
function MysqlAdapter(client, options = {}): Adapter {
	return {
		async createUser(user) {
			if (!user.emailVerified) user.emailVerified = new Date().toISOString().replace('T', ' ').replace('Z', '');
			user.id = generateId(10);
			await Users.add(user);
			const usersDb = await Users.getByEmail(user.email);
			if (usersDb.data.length) return usersDb.data[0];
			console.log('!!! Error when creating a user');
			throw new Error('Failed to create User');
			return;
		},
		async getUser(id) {
			const usersDb = await Users.getById(id);
			if (usersDb.data.length) return usersDb.data[0];
			console.log('!!! Error in getting the user by ID');
			return;
		},
		async getUserByEmail(email: string) {
			const usersDb = await Users.getByEmail(email);
			if (usersDb.data.length) return usersDb.data[0];
			console.log('!!! Error receiving the user by email');
			return;
		},
		async getUserByAccount({ providerAccountId, provider }) {
			const account = await Accounts.getByProviderIdAndProviderName(providerAccountId, provider);
			if (!account.data.length) {
				console.log('!!! Error in getting an account by provider');
				return;
			}

			const user = await Users.getById(account.data[0]?.userId);
			if (!user.data.length) {
				console.log('!!! Error in getting the user by ID');
				return;
			}

			return user.data[0];
		},
		async updateUser(user) {
			return;
		},
		async deleteUser(userId) {
			return;
		},
		async linkAccount(account) {
			account.id = generateId(10);
			await Accounts.add(account);
			const accountDb = await Accounts.getByUserId(account.userId);
			if (accountDb.data.length) return accountDb.data[0];
			console.log('!!! Error when creating an account');
			throw new Error('Failed to create linkAccount');
			return;
		},
		async unlinkAccount({ providerAccountId, provider }) {
			return;
		},
		async createSession({ sessionToken, userId, expires }) {
			const formatedExpires = expires.toISOString().replace('T', ' ').replace('Z', '');
			
			const session = {
				id: generateId(15),
				expires: formatedExpires,
				sessionToken: sessionToken,
				userId: userId
			};
			await Sessions.add(session);
			const sessionDb = await Sessions.getByUserId(userId);
			sessionDb.data[0].expires = new Date(sessionDb.data[0].expires + 'Z');
			if (sessionDb.data.length) return sessionDb.data[0];
			console.log('!!! Session creation error');
			throw new Error('Failed to createSession');
			return;
		},
		async getSessionAndUser(sessionToken) {
			const session = await Sessions.getBySessionToken(sessionToken);
			if (!session.data.length) {
				console.log('!!! Failed to receive session');
				return;
			}
			session.data[0].expires = new Date(session.data[0].expires + 'Z');
		
			const user = await Users.getById(session.data[0]?.userId);
			if (!user.data.length) {
				console.log('!!! Error in getting the user');
				return;
			}

			const result = { session: session.data[0], user: user.data[0] }
			return result;
		},
		async updateSession({ sessionToken }) {
			return;
		},
		async deleteSession(sessionToken) {
			const session = await Sessions.deleteSessionToken(sessionToken);
			if (session.data) {
				console.log('!!! Error when deleting a session');
				return;
			}
		},
		async createVerificationToken({ identifier, expires, token }) {
			return;
		},
		async useVerificationToken({ identifier, token }) {
			return;
		},
	}
}

export {
	MysqlAdapter
}