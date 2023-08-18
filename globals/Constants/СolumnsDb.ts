export const accountsColumns = {
	id: 'id',
	userId: 'userId',
	type: 'type',
	provider: 'provider',
	providerAccountId: 'providerAccountId',
	refresh_token: 'refresh_token',
	access_token: 'access_token',
	expires_at: 'expires_at',
	token_type: 'token_type',
	scope: 'scope',
	id_token: 'id_token',
	session_state: 'session_state',
	oauth_token_secret: 'oauth_token_secret',
	oauth_token: 'oauth_token',
}

export const categoriesColumns = {
	id: 'id',
	nameCategory: 'nameCategory',
	route: 'route',
	status: 'status'
};

export const categoriesByInterestsColumns = {
  id: 'id',
  idInterest: 'idInterest',
  idCategory: 'idCategory',
  status: 'status',
};

export const citiesColumns = {
  id: 'id',
  nameCity: 'nameCity',
  route: 'route',
  status: 'status',
};

export const citiesByCountriesColumns = {
  id: 'id',
  idCountry: 'idCountry',
  idCity: 'idCity',
  status: 'status',
};

export const countriesColumns = {
  id: 'id',
  nameCountry: 'nameCountry',
  route: 'route',
  status: 'status',
};