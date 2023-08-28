import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppState } from '../../store';
import { Constants, Helpers, ML } from '../../../globals';
import { Categories, CategoriesByInterests, Cities, CitiesByCountries, Countries, Interests, InterestsByCities, Meetings } from '../../../models';
import { CalendarInterface, CountriesInterface, LanguagesInterface, CitiesInterface, InterestsInterface, CategoryInterface } from '../../../typesAndInterfaces/interfaces';
import { RouterQueryAdditional, TypeInitialStateCalandarMeeting } from '../../../typesAndInterfaces/types';

const now = new Date();
const increaseDateByMonths = Helpers.increaseDateByMonths(now, 3)
const maxDate = increaseDateByMonths && Helpers.convertDatetimeLocalForRedux(increaseDateByMonths);
const startDayByDate = Helpers.getStartDayByDate(now);
const activePeriodStart = startDayByDate && Helpers.convertDatetimeForRedux(startDayByDate);
const endMonthByDate = Helpers.getEndMonthByDate(now);
const activePeriodEnd = endMonthByDate && Helpers.convertDatetimeForRedux(endMonthByDate);

interface DataForSetListDatemeetingsPerMonthAsync {
	router: RouterQueryAdditional,
	language: LanguagesInterface.Db
}
let initialState: TypeInitialStateCalandarMeeting = {};
if (typeof maxDate === "string" && typeof activePeriodStart === "string" && typeof activePeriodEnd === "string") {
		initialState = {
		selectedDay: null,
		maxDate: maxDate,
		activeStartDateChange: null,
		activePeriod: {
			nameMonth: null,
			start: activePeriodStart,
			end: activePeriodEnd
		},
		listDatemeetingsPerMonth: {data: [], status: Constants.statusFetch.succeeded, error: null},
		status: Constants.statusFetch.succeeded,
		error: null,
	}
}

const setListDatemeetingsPerMonthAsync = createAsyncThunk<string[] | undefined, DataForSetListDatemeetingsPerMonthAsync, {dispatch: AppDispatch}>(
  'calendarMeetings/setListDatemeetingsPerMonthAsync',
  async (parametersRequest, {getState}) => {
		const {calendarMeetings} = getState() as AppState;
		if (parametersRequest.router) {

			const dateStartMonth = Helpers.convertFromReduxToDatetimeLocal(calendarMeetings.activePeriod.start);
			const startDayMonth = dateStartMonth?.getDate()
			const endDayMonth = Helpers.convertFromReduxToDatetimeLocal(calendarMeetings.activePeriod.end)?.getDate()

			const listDatePerMonth: Date[] = [];
			const listDatemeetingsPerMonth: Date[] = [];

			if (dateStartMonth && endDayMonth && startDayMonth) {
				for (let day = startDayMonth; day <= endDayMonth; day++) {
					const month = dateStartMonth.getMonth();
					const year = dateStartMonth.getFullYear();
					const currentDate = new Date(year, month, day);
					if (currentDate && !listDatePerMonth.includes(currentDate)) listDatePerMonth.push(currentDate)
				}
			}

			let countryRoute: string | undefined;
			if (typeof parametersRequest?.router?.countries === 'string') countryRoute = Helpers.getCountryByUrlCountry(parametersRequest.router.countries)

			let country: CountriesInterface.Db | undefined;
			if (countryRoute) country = (await Countries.getByRoute(countryRoute))?.data?.[0]
			if (Object.keys(parametersRequest.router).length === 1 && parametersRequest.router?.countries) {
				for await (const date of listDatePerMonth) {
					const startDay = Helpers.convertDatetimeLocalForDb(Helpers.getStartDayByDate(date));
					const endDay = Helpers.convertDatetimeLocalForDb(Helpers.getEndDayByDate(date));
		
					const meetingDb = country && await Meetings.getOneByDateMeetingsAndCountry(country.id, parametersRequest.language.id, startDay, endDay);
					if (meetingDb?.data) {
						if (meetingDb?.data?.length > 0) listDatemeetingsPerMonth.push(date)
					}
				}
			} else if (Object.keys(parametersRequest.router).length === 2 && parametersRequest.router.cities) {
				const citiesByCountry = country && (await CitiesByCountries.getAllByCountry(country.id)).data
				let citiesByRoute: CitiesInterface.Db[] | undefined;
				if (typeof parametersRequest?.router?.cities === 'string') citiesByRoute = (await Cities.getAllByRouteCity(parametersRequest.router.cities)).data

				let city;
				if (citiesByCountry && citiesByRoute) {
					for (const cityByCountry of citiesByCountry) {
						for (const cityByRoute of citiesByRoute) {
							if (cityByRoute.id === cityByCountry.idCity) {
								city = cityByRoute;
								break;
							}
						}
					}
				}

				for await (const date of listDatePerMonth) {
					const startDay = Helpers.convertDatetimeLocalForDb(Helpers.getStartDayByDate(date));
					const endDay = Helpers.convertDatetimeLocalForDb(Helpers.getEndDayByDate(date));
		
					const meetingDb = city && country && await Meetings.getOneByDateMeetingsAndCity(country.id, city.id, parametersRequest.language.id, startDay, endDay);
					if (meetingDb?.data) {
						if (meetingDb.data.length > 0) listDatemeetingsPerMonth.push(date)
					}
				}
			} else if (Object.keys(parametersRequest.router).length === 3 && parametersRequest.router.interests) {
				const citiesByCountry = country && (await CitiesByCountries.getAllByCountry(country.id)).data
				let citiesByRoute: CitiesInterface.Db[] | undefined;
				if (typeof parametersRequest?.router?.cities === 'string')  citiesByRoute = (await Cities.getAllByRouteCity(parametersRequest.router.cities)).data
				let city;
				if (citiesByCountry && citiesByRoute) {
					for (const cityByCountry of citiesByCountry) {
						for (const cityByRoute of citiesByRoute) {
							if (cityByRoute.id === cityByCountry.idCity) {
								city = cityByRoute;
								break;
							}
						}
					}
				}

				const interestsByCity = city && (await InterestsByCities.getAllByCity(city.id))?.data;
				let interestsByRoute: InterestsInterface.Db[] | undefined;
				if (typeof parametersRequest.router.interests === "string") interestsByRoute = (await Interests.getAllByRouteInterest(parametersRequest.router.interests))?.data;
				let interest;
				if (interestsByCity && interestsByRoute) {
					for (const interestByCity of interestsByCity) {
						for (const interestByRoute of interestsByRoute) {
							if (interestByRoute.id === interestByCity.idInterest) {
								interest = interestByRoute;
								break;
							}
						}
					}
				}

				for await (const date of listDatePerMonth) {
					const startDay = Helpers.convertDatetimeLocalForDb(Helpers.getStartDayByDate(date));
					const endDay = Helpers.convertDatetimeLocalForDb(Helpers.getEndDayByDate(date));
		
					const meetingDb = country && city && interest && await Meetings.getOneByDateMeetingsAndInterest(country.id, city.id, interest.id, parametersRequest.language.id, startDay, endDay);
					if (meetingDb?.data) {
						if (meetingDb.data.length > 0) listDatemeetingsPerMonth.push(date)
					}
				}
			} else if (Object.keys(parametersRequest.router).length === 4 && parametersRequest.router.categories) {
				const citiesByCountry = country && (await CitiesByCountries.getAllByCountry(country.id)).data
				let citiesByRoute: CitiesInterface.Db[] | undefined;
				if (typeof parametersRequest.router.cities === "string") citiesByRoute = (await Cities.getAllByRouteCity(parametersRequest.router.cities)).data
				let city;
				if (citiesByCountry && citiesByRoute) {
					for (const cityByCountry of citiesByCountry) {
						for (const cityByRoute of citiesByRoute) {
							if (cityByRoute.id === cityByCountry.idCity) {
								city = cityByRoute;
								break;
							}
						}
					}
				}

				const interestsByCity = city && (await InterestsByCities.getAllByCity(city.id))?.data;
				let interestsByRoute: InterestsInterface.Db[] | undefined;
				if (typeof parametersRequest.router.interests === "string") interestsByRoute = (await Interests.getAllByRouteInterest(parametersRequest.router.interests))?.data;
				let interest;
				if (interestsByCity && interestsByRoute) {
					for (const interestByCity of interestsByCity) {
						for (const interestByRoute of interestsByRoute) {
							if (interestByRoute.id === interestByCity.idInterest) {
								interest = interestByRoute;
								break;
							}
						}
					}
				}

				let category;
				const categoriesByInterest = interest && (await CategoriesByInterests.getAllByIdInterest(interest.id))?.data;
				let categoriesByRoute: CategoryInterface.Db[] | undefined;
				if (typeof parametersRequest.router.categories === "string") categoriesByRoute = (await Categories.getAllByRoute(parametersRequest.router.categories))?.data;
				if (categoriesByInterest && categoriesByRoute) {
					for (const categoryByInterest of categoriesByInterest) {
						for (const categoryByRoute of categoriesByRoute) {
							if (categoryByRoute.id === categoryByInterest.idCategory) {
								category = categoryByRoute;
								break;
							}
						}
					}
				}

				for await (const date of listDatePerMonth) {
					const startDay = Helpers.convertDatetimeLocalForDb(Helpers.getStartDayByDate(date));
					const endDay = Helpers.convertDatetimeLocalForDb(Helpers.getEndDayByDate(date));
		
					const meetingDb = country && city && interest && category && await Meetings.getOneByDateMeetingsAndCategory(country.id, city.id, interest.id, category.id, parametersRequest.language.id, startDay, endDay);
					if (meetingDb?.data) {
						if (meetingDb.data.length > 0) listDatemeetingsPerMonth.push(date)
					}
				}
			}

			const listResult: string[] = [];
			listDatemeetingsPerMonth.forEach(date => {
				if (typeof date === 'object') {
					const stringDate = Helpers.convertDatetimeLocalForRedux(date);
					if (stringDate) listResult.push(stringDate)
				}
			});

			return listResult;
		}
  }
)

const calendarMeetingsSlices = createSlice({
	name: 'calendarMeetings',
	initialState: initialState,
	reducers: {
		setSelectedDay: {
			reducer: (state, action: PayloadAction<string | null | undefined>) => {
				if (action.payload !== undefined && Object.keys(state).length > 0) state.selectedDay = action.payload
			},
			prepare: (selectedDay: Date | null) => {
				const date = !selectedDay ? selectedDay : Helpers.convertDatetimeLocalForRedux(selectedDay);
				return {payload: date};
			}
		},
		setActiveStartDateChange: {
			reducer: (state, action: PayloadAction<CalendarInterface.EventActiveStartDateChangeForRedux>) => {
				if (typeof action.payload.activeStartDate === "string") {
					const activeStartDate = new Date(action.payload.activeStartDate);
					const startPeriod = activeStartDate > now ? Helpers.getStartDayByDate(activeStartDate) : Helpers.getStartDayByDate(now);
					const endMonth = Helpers.getEndMonthByDate(activeStartDate);
					if (endMonth && startPeriod) {
						const endPeriod = endMonth < new Date(state.maxDate) ? endMonth : new Date(state.maxDate);
		
						let activePeriod: TypeInitialStateCalandarMeeting["activePeriod"] | undefined;
						const nameMonth = Helpers.getNameMonthByDate(activeStartDate, ML.getLanguage());
						const start = Helpers.convertDatetimeForRedux(startPeriod);
						const end = Helpers.convertDatetimeForRedux(endPeriod);

						if (typeof nameMonth === "string" && typeof start === "string" && typeof end === "string") {
							activePeriod = {
								nameMonth,
								start,
								end
							}
						}

						if (activePeriod) {
							state.activePeriod = activePeriod;
							state.activeStartDateChange = action.payload;
						}
					}
				}
			},
			prepare: (dateChange: CalendarInterface.EventActiveStartDateChange) => {
				const activeStartDate = dateChange.activeStartDate && Helpers.convertDatetimeAndShiftTimezoneForRedux(dateChange.activeStartDate);
				const value = typeof dateChange.value === "object" && dateChange.value instanceof Date && Helpers.convertDatetimeAndShiftTimezoneForRedux(dateChange.value);
				const data: CalendarInterface.EventActiveStartDateChangeForRedux = {
					action: dateChange.action,
					activeStartDate: typeof activeStartDate === "string" ? activeStartDate : null,
					value: typeof value === "string" ? value : null,
					view: dateChange.view,
				};

				return {payload: data};
			}
		},
		setActivePeriodNameMonth: (state, action: PayloadAction<TypeInitialStateCalandarMeeting["activePeriod"]["nameMonth"]>) => {
			if (action.payload !== undefined && Object.keys(state).length > 0) state.activePeriod.nameMonth = action.payload
		},
	},
	extraReducers: (builder) => {
    builder
      .addCase(setListDatemeetingsPerMonthAsync.pending, (state, action) => {
				if (Object.keys(state).length > 0) {
					state.status = Constants.statusFetch.loading
					state.error = null
				}
      })
      .addCase(setListDatemeetingsPerMonthAsync.rejected, (state, action) => {
				if (Object.keys(state).length > 0) {
					state.status = Constants.statusFetch.failed
					state.error = typeof action.payload === 'string' ? action.payload : 'Error'
				}
      })
      .addCase(setListDatemeetingsPerMonthAsync.fulfilled, (state, action) => {
				if (Object.keys(state).length > 0 && action?.payload !== undefined) {
					state.status = Constants.statusFetch.succeeded
					state.error = null
					state.listDatemeetingsPerMonth.data = action.payload
				}
      })
  },
});

const { setSelectedDay, setActiveStartDateChange, setActivePeriodNameMonth } = calendarMeetingsSlices.actions
const reducer = calendarMeetingsSlices.reducer

const selectedDaySelect = (state: AppState) => {
	return state?.calendarMeetings?.selectedDay
}

const calendarMeetingsSelect = (state: AppState) => {
	return state.calendarMeetings
}

const activeStartDateChangeSelect = (state: AppState) => {
	return state?.calendarMeetings?.activeStartDateChange
}

export {
	setSelectedDay,
	reducer,
	selectedDaySelect,
	calendarMeetingsSelect,
	activeStartDateChangeSelect,
	setActiveStartDateChange,
	setListDatemeetingsPerMonthAsync,
	setActivePeriodNameMonth
}