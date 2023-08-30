import styles from '../styles/ProposeMeetingPage.module.css'
import Head from 'next/head'
import { Main, Select, Loading, Button, DivDefault } from '../components';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages, Categories, CategoriesByInterests, Meetings, Users, Desires } from '../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, CitiesByCountriesInterface, LanguagesInterface, CategoryInterface, InterestsByCitiesInterface, CategoriesByInterestsInterface, DesiresInterface, ProposeMeetingInterface, MeetingsInterface } from '../typesAndInterfaces/interfaces';
import { ML, Helpers, Constants } from '../globals';
import { ReactElement, useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { AlertsSlice, TextTranslationSlice } from '../store/slices'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { Layout } from '../layout/Layout';
import { Get } from '../typesAndInterfaces/interfaces/http.interface';

export default function ProposeMeetingPage(): JSX.Element {
	const { data: session, status } = useSession();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const [listLanguages, setListLanguages] = useState<LanguagesInterface.Db[]>([]);
	const [listCountries, setListCountries] = useState<CountriesInterface.WithTranslation[]>([]);
	const [listCities, setListCities] = useState<CitiesInterface.WithTranslation[]>([]);
	const [listInterests, setListInterests] = useState<InterestsInterface.WithTranslation[]>([]);
	const [listCategories, setListCategories] = useState<CategoryInterface.WithTranslation[]>([]);
	const [listCitiesByCountries, setListCitiesByCountries] = useState<CitiesByCountriesInterface.Db[]>([]);
	const [listInterestsByCities, setListInterestsByCities] = useState<InterestsByCitiesInterface.Db[]>([]);
	const [listCategoriesByInterests, setListCategoriesByInterests] = useState<CategoriesByInterestsInterface.Db[]>([]);
	const [dataForm, setDataForm] = useState<ProposeMeetingInterface.DataForm>({selectCountry: '', selectCity: '', selectInterest: '', selectCategory: '', selectLanguage: '', selectDateMeeting: '', selectPlaceMeeting: ''});
	const [dataSelects, setDataSelects] = useState<ProposeMeetingInterface.DataSelects>({listCities: [], listInterests: [], listCategories: []})
	const [trySubmit, setTrySubmit] = useState(false);

	const updateLanguage = async () => {
		const language = ML.getLanguage();
		if (typeof window !== "undefined" && language) document.documentElement.lang = language
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
			
			const countriesDb = await Countries.getAll();
			const listCountriesDb = countriesDb.data;
			
			const citiesDb = await Cities.getAll();
			const listCitiesDb = citiesDb.data;
			
			const interestsDb = await Interests.getAll();
			const listInterestsDb = interestsDb.data;
			
			const categoriesDb = await Categories.getAll();
			const listCategoriesDb = categoriesDb.data;
			
			const citiesByCountriesDb = await CitiesByCountries.getAll();
			const listCitiesByCountriesDb = citiesByCountriesDb.data;
			
			const interestsByCitiesDb = await InterestsByCities.getAll();
			const listInterestsByCitiesDb = interestsByCitiesDb.data;
			
			const categoriesByInterestsDb = await CategoriesByInterests.getAll();
			const listCategoriesByInterestsDb = categoriesByInterestsDb.data;

			if (!listLanguagesDb || !listCountriesDb || !listCitiesDb || !listInterestsDb || !listCategoriesDb || !listCitiesByCountriesDb || !listInterestsByCitiesDb || !listCategoriesByInterestsDb) {
				setLoading(false);
				return;
			}
			
			setListLanguages(listLanguagesDb);
			ML.setLanguageByBrowser(listLanguagesDb);
			updateLanguage();
			setListCountries(listCountriesDb);
			setListCities(listCitiesDb);
			setListInterests(listInterestsDb);
			setListCategories(listCategoriesDb);
			setListCitiesByCountries(listCitiesByCountriesDb);
			setListInterestsByCities(listInterestsByCitiesDb);
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
			newDataForm = {...dataForm, ['selectDateMeeting']: value.length ? Helpers.convertDatetimeLocalForDb(new Date(value)) || '' : ''};
		}
		setDataForm(newDataForm);
		filterLists(newDataForm);
		translateCategories();
	}
	
  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (session?.user?.email !== undefined && session?.user?.image !== undefined && session?.user?.name !== undefined) {
			const dataUserBySession = await Users.getBySession(session?.user?.email, session?.user?.image, session?.user?.name)
			if (dataUserBySession?.data) {
				const idUser = dataUserBySession?.data.length > 0 && dataUserBySession?.data[0].id || null;
	
				setTrySubmit(true);
				if (dataForm.selectCountry.length > 0 && dataForm.selectCity.length > 0 && dataForm.selectInterest.length > 0 && dataForm.selectCategory.length && dataForm.selectLanguage.length && dataForm.selectDateMeeting.length) {
					
					const country = listCountries.find(country => country.route === dataForm.selectCountry);
					const city = listCities.find(city => city.route === dataForm.selectCity);
					const interest = listInterests.find(interest => interest.route === dataForm.selectInterest);
					const category = listCategories.find(category => category.route === dataForm.selectCategory);
					const language = listLanguages.find(language => language.route === dataForm.selectLanguage);
					
					if (country && city && interest && category && language && idUser) {
						const dataMeeting: MeetingsInterface.Add = {
							idCountry: country.id,
							idCity: city.id,
							idInterest: interest.id,
							idCategory: category.id,
							idLanguage: language.id,
							dateMeeting: dataForm.selectDateMeeting,
							placeMeeting: dataForm.selectPlaceMeeting,
							typeMeeting: Constants.typeMeeting.OWN,
							accessMeeting: Constants.accessMeeting.all,
							dateCreation: Helpers.currentDatetimeForDb(),
							status: Constants.activyStatus.ACTIVE
						};
		
						const oldMeetings = await Meetings.getByDataForm(dataMeeting);
						let oldDesires: Get<DesiresInterface.Db> | undefined;
						if (oldMeetings?.data) {
							if (oldMeetings?.data?.length > 0) oldDesires =  await Desires.getByIdUserAndIdMeeting(idUser, oldMeetings?.data[0].id);
						}
		
						if (oldMeetings?.data?.length === 0 || !oldMeetings || !oldDesires) {
							const idMeetingsAddDb = await Meetings.add(dataMeeting);
							if (idMeetingsAddDb?.data?.id) {
								const dataDesires: DesiresInterface.Add = {
									idUser: idUser,
									idMeeting: parseInt(idMeetingsAddDb.data.id),
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
			}
		}

		dispatch(AlertsSlice.add(textTranslation[ML.key.onAddingMeeting], textTranslation[ML.key.error], 'danger'));
  }

	const filterLists = (newDataForm: ProposeMeetingInterface.DataForm) => {
		let newDataSelects: ProposeMeetingInterface.DataSelects = JSON.parse(JSON.stringify(dataSelects)); // a deep copy of the object, to make sure that I do not change the object when assigning a new value
		
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

	const getMaxDateYYYYMMDD = () => {
		const currentDate = new Date();
		const increaseDate = Helpers.increaseDateByMonths(currentDate, Constants.maxVisibleMonth);
		if (increaseDate) return increaseDate.toISOString().substring(0,16)
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
									nameEmptyOption={textTranslation[ML.key.selectInterest]}
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
									nameEmptyOption={textTranslation[ML.key.selectCategory]}
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
									nameEmptyOption={textTranslation[ML.key.selectLanguage]}
									nameKeyOption='id'
									nameValueOption='route'
									nameInnerOption='name'
									list={listLanguages}
									valueSelect={(value: string, name?) => handleSelect(value, name)}
									required={true}
									error={(dataForm.selectLanguage.length === 0 && trySubmit) ? true : false}
								/>
								<input type="datetime-local" id="start" name="selectDateMeeting"
									className={(dataForm.selectDateMeeting?.length === 0 && trySubmit) ? 'error' : ''}
									min={getCurrentDateYYYYMMDD()}
									max={getMaxDateYYYYMMDD()}
									required
									onChange={(value) => handleSelect(value.target.value, value.target.name)}
								/>
								<textarea
									name="selectPlaceMeeting" rows={3} placeholder={textTranslation[ML.key.writeMeetingPlace]}
									onChange={(value) => handleSelect(value.target.value, value.target.name)}
								/>
								<button type='submit'>{textTranslation[ML.key.add]}</button>
								
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