import React, { useEffect, useState } from 'react';
import styles from './NavigationMeetings.module.css';
import { NavigationMeetingsProps } from './NavigationMeetings.props';
import { useRouter } from 'next/router';
import { Constants, Helpers, ML } from '../../globals';
import {Button, SelectWithSearch} from '../../components';
import { Categories, CategoriesByInterests, Cities, CitiesByCountries, Interests, InterestsByCities } from '../../models';
import { AdditionalInterface, CitiesByCountriesInterface, CitiesInterface, CountriesInterface } from '../../typesAndInterfaces/interfaces';
import { DefaultValues, Navigation } from './NavigationMeetings.types';

export const NavigationMeetings = ({listCountries, listLanguages, textTranslation}: NavigationMeetingsProps): JSX.Element => {
	const router = useRouter();
	const [optionsCountries, setOptionsCountries] = useState<AdditionalInterface.ListOptions>([]);
	const [optionsCities, setOptionsCities] = useState<AdditionalInterface.ListOptions>([]);
	const [optionsInterest, setOptionsInterest] = useState<AdditionalInterface.ListOptions>([]);
	const [optionsCategories, setOptionsCategories] = useState<AdditionalInterface.ListOptions>([]);
	const [navigation, setNavigation] = useState<Navigation>({});
	const [defaultValues, setDefaultValues] = useState<DefaultValues>({
		country: typeof router.query.countries === "string" ? Helpers.getCountryByUrlCountry(router.query.countries) || null : null,
		city: typeof router.query.cities === "string" ? router.query.cities : null,
		interest: typeof router.query.interests === "string" ? router.query.interests : null,
		category: typeof router.query.categories === "string" ? router.query.categories : null
	});

	const createListCountriesForOptions = (listCountries: CountriesInterface.Db[]) => {
		const options: AdditionalInterface.ListOptions = [];
		listCountries.forEach(country => {
			if (!country.route || !textTranslation[ML.key[country.route]]) return;

			const option = {
				value: country.route,
				label: textTranslation[ML.key[country.route]]
			}
			if (!options.includes(option)) options.push(option);
		})
		setOptionsCountries(options);
	}

	const createListCitiesForOptions = async () => {
		const options: AdditionalInterface.ListOptions = [];
		if (navigation?.country) {
			if (navigation?.country.length >= 0) {
				const currentCountry = listCountries.find(country => country.route === navigation.country)
				if (currentCountry) {
					const citiesCountry = await CitiesByCountries.getAllByCountry(currentCountry.id);
					const idCities = citiesCountry?.data?.map((city: CitiesByCountriesInterface.Db) => city.idCity);
					const citiesData = await Cities.getAll();
					const listCities = citiesData?.data?.filter((city: CitiesInterface.Db) => idCities?.includes(city.id));
					listCities?.forEach(city => {
						if (!city.route || !textTranslation[city.route]) return;
			
						const option = {
							value: city.route,
							label: textTranslation[city.route]
						}
						if (!options.includes(option)) options.push(option);
					})
				}
			}
			setOptionsCities(options);
		}
	}

	const createListInterestForOptions = async () => {
		const options: AdditionalInterface.ListOptions = [];
		if (navigation?.city) {
			if (navigation?.city?.length >= 0) {
				const currentCity = (await Cities.getAllByRouteCity(navigation.city))?.data?.[0];
				if (currentCity) {
					const interestscity = (await InterestsByCities.getAllByCity(currentCity.id))?.data;
					const idInterests = interestscity?.map((interest) => interest.idInterest);
					const interestsData = await Interests.getAll();
					const listInterests = interestsData?.data?.filter((interest) => idInterests?.includes(interest.id));
					listInterests?.forEach(interest => {
						if (!interest.route || !textTranslation[interest.route]) return;
						
						const option = {
							value: interest.route,
							label: textTranslation[interest.route]
						}
						if (!options.includes(option)) options.push(option);
					})
				}
			}
			setOptionsInterest(options);
		}
	}

	const createListCategoriesForOptions = async () => {
		const options: AdditionalInterface.ListOptions = [];
		if (navigation?.interest) {
			if (navigation?.interest?.length >= 0) {
				const currentInterest = (await Interests.getAllByRouteInterest(navigation.interest))?.data?.[0];
				if (currentInterest) {
					const categoriesCity = (await CategoriesByInterests.getAllByIdInterest(currentInterest.id))?.data;
					const idCategories = categoriesCity?.map((category) => category.idCategory);
					const categoriesData = await Categories.getAll();
					const listCategories = categoriesData?.data?.filter((category) => idCategories?.includes(category.id));
					listCategories?.forEach(category => {
						if (!category.route || !textTranslation[category.route]) return;
						
						const option = {
							value: category.route,
							label: textTranslation[category.route]
						}
						if (!options.includes(option)) options.push(option);
					})
				}
			}
			setOptionsCategories(options);
		}
	}

	useEffect(() => {
		if (listCountries && Object.keys(textTranslation).length > 0) {
			createListCountriesForOptions(listCountries);
		}
	}, [listCountries]);


	const handleSelects = (selectValue: AdditionalInterface.SelectValue) => {
    const { name, value } = selectValue;
		if (name === Constants.navigationMeetings.country && navigation?.city) {
			if (router.query.cities) {
				setDefaultValues(prevValues => ({
					...prevValues,
					city: null,
					interest: null,
					category: null
				}));
			}
			
			// Remove city, interest from another country and add new country
			setNavigation(prevState => {
				if (prevState[Constants.navigationMeetings.country] !== value) {
					const newState = { ...prevState };
					delete newState[Constants.navigationMeetings.city];
					delete newState[Constants.navigationMeetings.interest];
					delete newState[Constants.navigationMeetings.category];
					newState[name] = value;
					return newState;
				}
				return prevState;
			});
		} else if (name === Constants.navigationMeetings.city && navigation?.interest) {
			if (router.query.interests) {
				setDefaultValues(prevValues => ({
					...prevValues,
					interest: null,
					category: null
				}));
			}

			// Remove interest from another country and add new city
			setNavigation(prevState => {
				if (prevState[Constants.navigationMeetings.country] !== value) {
					const newState = { ...prevState };
					delete newState[Constants.navigationMeetings.interest];
					delete newState[Constants.navigationMeetings.category];
					newState[name] = value;
					return newState;
				}
				return prevState;
			});
			setOptionsInterest([]);
		} else if (name === Constants.navigationMeetings.interest && navigation?.category) {
			if (router.query.categories) {
				setDefaultValues(prevValues => ({
					...prevValues,
					category: null
				}));
			}

			// Remove category from another country and add new interest
			setNavigation(prevState => {
				if (prevState[Constants.navigationMeetings.category] !== value) {
					const newState = { ...prevState };
					delete newState[Constants.navigationMeetings.category];
					newState[name] = value;
					return newState;
				}
				return prevState;
			});
		} else {
			setNavigation((prevState) => ({...prevState, [name]: value}));
		}
	}

	useEffect(() => {
		if (navigation?.country) {
			if (navigation?.country?.length >=0 && Object.keys(textTranslation).length > 0) {
				createListCitiesForOptions();
				createListInterestForOptions();
				createListCategoriesForOptions();
			}
		}
	}, [navigation])

	const handleGoTo = () => {
		const urlCountry = Helpers.getUrlCountry(navigation.country, listCountries, listLanguages);
		const urlCity = navigation?.city;
		const urlInterest = navigation?.interest;
		const urlCategory = navigation?.category;
		if (urlCountry && !urlCity) {
			router.push({
				pathname: '/[countries]',
				query: {countries: urlCountry}
			}).then(() => router.reload());
		}
		if (urlCountry && urlCity && !urlInterest) {
			router.push({
				pathname: '/[countries]/[cities]',
				query: {countries: urlCountry, cities:urlCity}
			}).then(() => router.reload());
		}
		if (urlCountry && urlCity && urlInterest && !urlCategory) {
			router.push({
				pathname: '/[countries]/[cities]/[interests]',
				query: {countries: urlCountry, cities:urlCity, interests:urlInterest}
			}).then(() => router.reload());
		}
		if (urlCountry && urlCity && urlInterest && urlCategory) {
			router.push({
				pathname: '/[countries]/[cities]/[interests]/[categories]',
				query: {countries: urlCountry, cities:urlCity, interests:urlInterest, categories:urlCategory}
			}).then(() => router.reload());
		}
	};


	return (
		<>
			<div className={styles.navigationMeetings}>
				<SelectWithSearch
					name={Constants.navigationMeetings.country}
					placeholder={textTranslation[ML.key.selectCountry]}
					options={optionsCountries}
					onChange={handleSelects}
					defaultValue={defaultValues?.country}
				/>
				<SelectWithSearch
					name={Constants.navigationMeetings.city}
					placeholder={textTranslation[ML.key.selectCity]}
					options={optionsCities}
					onChange={handleSelects}
					defaultValue={defaultValues.city}
				/>
				<SelectWithSearch
					name={Constants.navigationMeetings.interest}
					placeholder={textTranslation[ML.key.selectInterest]}
					options={optionsInterest}
					onChange={handleSelects}
					defaultValue={defaultValues.interest}
				/>
				<SelectWithSearch
					name={Constants.navigationMeetings.category}
					placeholder={textTranslation[ML.key.selectCategory]}
					options={optionsCategories}
					onChange={handleSelects}
					defaultValue={defaultValues.category}
				/>
				<Button name={textTranslation[ML.key.goTo]} onClick={handleGoTo} />
			</div>
		</>
	);
};