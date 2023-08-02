import styles from '../styles/ProposeMeetingPage.module.css'
import Head from 'next/head'
import { Main, Select, Loading, Alert, Button, DivDefault } from '../components';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages, Categories, CategoriesByInterests, Meetings, Users, Desires } from '../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, CitiesByCountriesInterface, LanguagesInterface, CategoryInterface, InterestsByCitiesInterface, CategoriesByInterestsInterface, DesiresInterface } from '../interfaces';
import { ML, Helpers, Constants } from '../globals';
import { ReactElement, useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { AlertsSlice, TextTranslationSlice } from '../store/slices'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { Layout } from '../layout/Layout';

export default function ProposeMeetingPage(): JSX.Element {
	const { data: session, status } = useSession();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const [listLanguages, setListLanguages] = useState<LanguagesInterface.Languages[]>([]);
	const [listCountries, setListCountries] = useState<CountriesInterface.Country[]>([]);
	const [listCities, setListCities] = useState<CitiesInterface.City[]>([]);
	const [listInterests, setListInterests] = useState<InterestsInterface.Interest[]>([]);
	const [listCategories, setListCategories] = useState<CategoryInterface.Category[]>([]);
	const [listCitiesByCountries, setListCitiesByCountries] = useState<CitiesByCountriesInterface.CityByCountries[]>([]);
	const [listInterestsByCities, setListInterestsByCities] = useState<InterestsByCitiesInterface.InterestsByCity[]>([]);
	const [listCategoriesByInterests, setListCategoriesByInterests] = useState<CategoriesByInterestsInterface.CategoryByInterest[]>([]);
	const [dataForm, setDataForm] = useState<TypeDataForm>({selectCountry: '', selectCity: '', selectInterest: '', selectCategory: '', selectLanguage: '', selectDateMeeting: '', selectPlaceMeeting: ''});
	const [dataSelects, setDataSelects] = useState({listCities: [], listInterests: [], listCategories: []})
	const [trySubmit, setTrySubmit] = useState(false);

	const updateLanguage = async () => {
		if (typeof window !== "undefined") document.documentElement.lang = ML.getLanguage()
		dispatch(TextTranslationSlice.updateLanguageAsync())
	}

	const translateCountries = () => {
		listCountries.map(country => {
			if (textTranslation[country.route]) country.translation = textTranslation[country.route];
		});
	}
	translateCountries();
	const translateCities = () => {
		listCities.map(city => {
			if (textTranslation[city.route]) city.translation = textTranslation[city.route];
		});
	}
	translateCities();
	const translateInterests = () => {
		listInterests.map(interest => {
			if (textTranslation[interest.route]) interest.translation = textTranslation[interest.route];
		});
	}
	translateInterests();
	const translateCategories = () => {
		listCategories.map(category => {
			if (textTranslation[category.route]) category.translation = textTranslation[category.route];
		});
	}
	translateCategories();

	useEffect(() => {
		async function startFetching() {
			const languagesDb = await Languages.getAll();
			const listLanguagesDb = languagesDb.data;
			setListLanguages(listLanguagesDb);
			ML.setLanguageByBrowser(listLanguagesDb);
			updateLanguage();
			
			const countriesDb = await Countries.getAll();
			const listCountriesDb = countriesDb.data;
			setListCountries(listCountriesDb);
			
			const citiesDb = await Cities.getAll();
			const listCitiesDb = citiesDb.data;
			setListCities(listCitiesDb);
			
			const interestsDb = await Interests.getAll();
			const listInterestsDb = interestsDb.data;
			setListInterests(listInterestsDb);
			
			const categoriesDb = await Categories.getAll();
			const listCategoriesDb = categoriesDb.data;
			setListCategories(listCategoriesDb);

			const citiesByCountriesDb = await CitiesByCountries.getAll();
			const listCitiesByCountriesDb = citiesByCountriesDb.data;
			setListCitiesByCountries(listCitiesByCountriesDb);

			const interestsByCitiesDb = await InterestsByCities.getAll();
			const listInterestsByCitiesDb = interestsByCitiesDb.data;
			setListInterestsByCities(listInterestsByCitiesDb);

			const categoriesByInterestsDb = await CategoriesByInterests.getAll();
			const listCategoriesByInterestsDb = categoriesByInterestsDb.data;
			setListCategoriesByInterests(listCategoriesByInterestsDb);

			setLoading(false);
		}
		startFetching();
	}, [])

	useEffect(() => {
		if (!session && status !== 'loading') {
			signIn();
		}
	}, [session])

	useEffect(() => {
		translateCountries();
		translateCities();
		translateInterests();
	}, [textTranslation])
	
	const handleSelect = (value: string, name?: string) => {
		if (!value || !name) return;
		let newDataForm = {...dataForm, [name]: value};
		if (name === 'selectCountry') {
			newDataForm = {...dataForm, [name]: value, selectCity: '', selectInterest: '', selectCategory: ''};
		} // to clear the selected values to update the dependent values
		if (name === 'selectCity') {
			newDataForm = {...dataForm, [name]: value, selectInterest: '', selectCategory: ''};
		}
		if (name === 'selectInterest') {
			newDataForm = {...dataForm, [name]: value, selectCategory: ''};
		}
		if (name === 'selectDateMeeting') {
			newDataForm = {...dataForm, ['selectDateMeeting']: value.length? Helpers.convertDatetimeLocalForDb(value) : ''};
		}
		setDataForm(newDataForm);
		filterLists(newDataForm);
		translateCategories();
	}
	
  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault();
		const dataUserBySession = await Users.getBySession(session?.user?.email, session?.user?.image, session?.user?.name)
		const idUser = dataUserBySession?.data.length > 0 && dataUserBySession?.data[0].id || null;

		setTrySubmit(true);
		if (dataForm.selectCountry.length > 0 && dataForm.selectCity.length > 0 && dataForm.selectInterest.length > 0 && dataForm.selectCategory.length && dataForm.selectLanguage.length && dataForm.selectDateMeeting.length) {
			
			const dataMeeting = {} as TypeDataMeeting;
			const country = listCountries.find(country => country.route === dataForm.selectCountry);
			const city = listCities.find(city => city.route === dataForm.selectCity);
			const interest = listInterests.find(interest => interest.route === dataForm.selectInterest);
			const category = listCategories.find(category => category.route === dataForm.selectCategory);
			const language = listLanguages.find(language => language.route === dataForm.selectLanguage);
	
			if (country && city && interest && category && language && idUser) {
				dataMeeting.idCountry = country.id;
				dataMeeting.idCity = city.id;
				dataMeeting.idInterest = interest.id;
				dataMeeting.idCategory = category.id;
				dataMeeting.idLanguage = language.id;
				dataMeeting.dateMeeting = dataForm.selectDateMeeting;
				dataMeeting.placeMeeting = dataForm.selectPlaceMeeting;
				dataMeeting.typeMeeting = Constants.typeMeeting.OWN;
				dataMeeting.accessMeeting = Constants.accessMeeting.all;
				dataMeeting.dateCreation = Helpers.currentDatetimeForDb();
				dataMeeting.status = Constants.activyStatus.ACTIVE;

				const oldMeetings = await Meetings.getByDataForm(dataMeeting);
				let oldDesires;
				if (oldMeetings?.data?.length > 0) oldDesires = await Desires.getByIdUserAndIdMeeting(idUser,  oldMeetings?.data[0].id);

				if (oldMeetings?.data?.length === 0 || !oldMeetings || !oldDesires) {
					const idMeetingsAddDb = await Meetings.add(dataMeeting);
					if (idMeetingsAddDb?.data?.id) {
						const dataDesires: DesiresInterface.Desires = {
							idUser: idUser,
							idMeeting: idMeetingsAddDb.data.id,
							statusOrganizer: Constants.statusOrganizer.MY,
							statusWish: Constants.statusWish.WISH,
							statusReadiness: Constants.statusReadiness.READINESS,
							status: Constants.activyStatus.ACTIVE
						};

						await Desires.add(dataDesires);
							
						dispatch(AlertsSlice.add(textTranslation[ML.key.addedMeeting], textTranslation[ML.key.successfully], 'success'));
						return;
					}
					dispatch(AlertsSlice.add(textTranslation[ML.key.onAddingMeeting], textTranslation[ML.key.error], 'danger'));
					return;
				}
				dispatch(AlertsSlice.add(textTranslation[ML.key.meetingExists], textTranslation[ML.key.error], 'warning'));
				return;
			}
		}
		dispatch(AlertsSlice.add(textTranslation[ML.key.onAddingMeeting], textTranslation[ML.key.error], 'danger'));
  }

	const filterLists = (newDataForm: TypeDataForm) => {
		let newDataSelects = JSON.parse(JSON.stringify(dataSelects)); // a deep copy of the object, to make sure that I do not change the object when assigning a new value
		
		const currentCountry = listCountries.find(country => country.route === newDataForm.selectCountry)
		const idCitiesByCountry: number[] = [];
		listCitiesByCountries.filter(cityByCountry => {
			if (cityByCountry.idCountry === currentCountry?.id) {
				if (!idCitiesByCountry.includes(cityByCountry.idCity)) idCitiesByCountry.push(cityByCountry.idCity)
				return true;
			}
		})
		const newlistCities = listCities.filter(city => idCitiesByCountry.includes(city.id))
		newDataSelects = {...newDataSelects, listCities: newlistCities};

		const currentCity = listCities.find(city => city.route === newDataForm.selectCity)
		const idInterestsByCity: number[] = [];
		listInterestsByCities.filter(interestByCity => {
			if (interestByCity.idCity === currentCity?.id) {
				if (!idInterestsByCity.includes(interestByCity.idInterest)) idInterestsByCity.push(interestByCity.idInterest)
				return true;
			}
		})
		const newlistInterests = listInterests.filter(interest => idInterestsByCity.includes(interest.id))
		newDataSelects = {...newDataSelects, listInterests: newlistInterests};

		const currentInterest = listInterests.find(interest => interest.route === newDataForm.selectInterest)
		const idCategoriesByInterest: number[] = [];
		listCategoriesByInterests.filter(categoryByInterest => {
			if (categoryByInterest.idInterest === currentInterest?.id) {
				if (!idCategoriesByInterest.includes(categoryByInterest.idCategory)) idCategoriesByInterest.push(categoryByInterest.idCategory)
				return true;
			}
		})
		const newlistCategories = listCategories.filter(category => idCategoriesByInterest.includes(category.id))
		newDataSelects = {...newDataSelects, listCategories: newlistCategories};

		setDataSelects(newDataSelects)
	}

	const getCurrentDateYYYYMMDD = () => {
		return new Date().toISOString().substring(0,16)
	}

	const plusYearsDateYYYYMMDD = () => {
		const currentDate = new Date();
		currentDate.setFullYear(currentDate.getFullYear() + 1);
		return currentDate.toISOString().substring(0,16)
	}

	if (session) {
		return (
			<div className={styles.proposeMeeting}>
				<Head>
					<title>{textTranslation[ML.key.titleProposeMeeting]}</title>
					<meta name="description" content={textTranslation[ML.key.descriptionProposeMeeting]} />
				</Head>
				<Main>
					<h1 className={styles.title}>{textTranslation[ML.key.offerToMeet]}</h1>
					{loading ? <Loading textTranslation={textTranslation[ML.key.loading]} /> : 
						<DivDefault className={styles.divForm}>
							<form  id="propose-meeting" onSubmit={handleSubmit}  className={styles.form}>
								<Select
									nameSelect='selectCountry'
									nameEmptyOption={textTranslation[ML.key.selectCountry]}
									nameKeyOption='id'
									nameValueOption='route'
									nameInnerOption='translation'
									list={listCountries}
									valueSelect={(value: string, name?: string) => handleSelect(value, name)}
									required={true}
									error={(dataForm.selectCountry.length === 0 && trySubmit) ? true : false}
								/>
								<Select
									nameSelect='selectCity'
									nameEmptyOption={textTranslation[ML.key.selectCity]}
									nameKeyOption='id'
									nameValueOption='route'
									nameInnerOption='translation'
									nameSelectedOption={dataForm.selectCity}
									list={dataSelects.listCities}
									valueSelect={(value: string, name?) => handleSelect(value, name)}
									required={true}
									error={(dataForm.selectCity.length === 0 && trySubmit) ? true : false}
								/>
								<Select
									nameSelect='selectInterest'
									nameEmptyOption={textTranslation[ML.key.selectInterest] as string}
									nameKeyOption='id'
									nameValueOption='route'
									nameInnerOption='translation'
									nameSelectedOption={dataForm.selectInterest}
									list={dataSelects.listInterests}
									valueSelect={(value: string, name?) => handleSelect(value, name)}
									required={true}
									error={(dataForm.selectInterest.length === 0 && trySubmit) ? true : false}
								/>
								<Select
									nameSelect='selectCategory'
									nameEmptyOption={textTranslation[ML.key.selectCategory] as string}
									nameKeyOption='id'
									nameValueOption='route'
									nameInnerOption='translation'
									nameSelectedOption={dataForm.selectCategory}
									list={dataSelects.listCategories}
									valueSelect={(value: string, name?) => handleSelect(value, name)}
									required={true}
									error={(dataForm.selectCategory.length === 0 && trySubmit) ? true : false}
								/>
								<Select
									nameSelect='selectLanguage'
									nameEmptyOption={textTranslation[ML.key.selectLanguage] as string}
									nameKeyOption='id'
									nameValueOption='route'
									nameInnerOption='name'
									list={listLanguages}
									valueSelect={(value: string, name?) => handleSelect(value, name)}
									required={true}
									error={(dataForm.selectLanguage.length === 0 && trySubmit) ? true : false}
								/>
								<input type="datetime-local" id="start" name="selectDateMeeting"
									className={(dataForm.selectDateMeeting.length === 0 && trySubmit) ? 'error' : ''}
									min={getCurrentDateYYYYMMDD()}
									max={plusYearsDateYYYYMMDD()}
									required
									onChange={(value) => handleSelect(value.target.value, value.target.name)}
								/>
								<textarea
									name="selectPlaceMeeting" rows={3} placeholder={textTranslation[ML.key.writeMeetingPlace]}
									onChange={(value) => handleSelect(value.target.value, value.target.name)}
								/>
								<button type='submit'>{textTranslation[ML.key.continue]}</button>
								
							</form>
						</DivDefault>
					}
					<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: '/your-meetings'})}} />
				</Main>
			</div>
		);
	}

	return (
		<></>
	);
}

ProposeMeetingPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export type TypeDataMeeting = {
	idUser: string;
	idCountry: number;
	idCity: number;
	idInterest: number;
	idCategory: number;
	idLanguage: number;
	dateMeeting: string;
	placeMeeting: string;
	typeMeeting: number;
	dateCreation: string;
	status: number;
}

export type TypeDataForm = {
	selectCountry: string;
	selectCity: string;
	selectInterest: string;
	selectCategory: string;
	selectLanguage: string;
	selectDateMeeting: string;
	selectPlaceMeeting: string;
}