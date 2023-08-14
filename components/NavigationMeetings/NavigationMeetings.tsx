import React, { useEffect, useState } from 'react';
import styles from './NavigationMeetings.module.css';
import { NavigationMeetingsProps } from './NavigationMeetings.props';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { Constants, Helpers, ML } from '../../globals';
import { useAppSelector } from '../../store/hook';
import { TextTranslationSlice } from '../../store/slices';
import {Button, SelectCountry, SelectWithImage, SelectWithSearch} from '../../components';
import { Categories, CategoriesByInterests, Cities, CitiesByCountries, Interests, InterestsByCities } from '../../models';
import { CitiesByCountriesInterface, CitiesInterface } from '../../interfaces';

export const NavigationMeetings = ({listCountries, listLanguages, textTranslation}: NavigationMeetingsProps): JSX.Element => {
	const router = useRouter();
	const [optionsCountries, setOptionsCountries] = useState([]);
	const [optionsCities, setOptionsCities] = useState([]);
	const [optionsInterest, setOptionsInterest] = useState([]);
	const [optionsCategories, setOptionsCategories] = useState([]);
	const [navigation, setNavigation] = useState({});

	const createListCountriesForOptions = (listCountries) => {
		const options = [];
		listCountries.forEach(country => {
			if (!country.route || !textTranslation[ML.key[country.route] as keyof typeof textTranslation]) return;

			const option = {
				value: country.route,
				label: textTranslation[ML.key[country.route] as keyof typeof textTranslation]
			}
			if (!options.includes(option)) options.push(option);
		})
		setOptionsCountries(options);
	}

	const createListCitiesForOptions = async () => {
		const options = [];
		if (navigation?.country.length >= 0) {
			const currentCountry = listCountries.find(country => country.route === navigation.country)
			if (currentCountry) {
				const citiesCountry = await CitiesByCountries.getAllByCountry(currentCountry.id);
				const idCities = citiesCountry.data.map((city: CitiesByCountriesInterface.CityByCountries) => city.idCity);
				const citiesData = await Cities.getAll();
				const listCities = citiesData.data.filter((city: CitiesInterface.City) => idCities.includes(city.id));
				listCities.forEach(city => {
					if (!city.route || !textTranslation[city.route as keyof typeof textTranslation]) return;
		
					const option = {
						value: city.route,
						label: textTranslation[city.route as keyof typeof textTranslation]
					}
					if (!options.includes(option)) options.push(option);
				})
			}
		}
		setOptionsCities(options);
	}

	const createListInterestForOptions = async () => {
		const options = [];
		if (navigation?.city?.length >= 0) {
			const currentCity = (await Cities.getAllByRouteCity(navigation.city))?.data[0];
			if (currentCity) {
				const interestscity = (await InterestsByCities.getAllByCity(currentCity.id))?.data;
				const idInterests = interestscity.map((interest) => interest.idInterest);
				const interestsData = await Interests.getAll();
				const listInterests = interestsData.data.filter((interest) => idInterests.includes(interest.id));
				listInterests.forEach(interest => {
					if (!interest.route || !textTranslation[interest.route as keyof typeof textTranslation]) return;
					
					const option = {
						value: interest.route,
						label: textTranslation[interest.route as keyof typeof textTranslation]
					}
					if (!options.includes(option)) options.push(option);
				})
			}
		}
		setOptionsInterest(options);
	}

	const createListCategoriesForOptions = async () => {
		const options = [];
		if (navigation?.interest?.length >= 0) {
			const currentInterest = (await Interests.getAllByRouteInterest(navigation.interest))?.data[0];
			if (currentInterest) {
				const categoriesCity = (await CategoriesByInterests.getAllByIdInterest(currentInterest.id))?.data;
				const idCategories = categoriesCity.map((category) => category.idCategory);
				const categoriesData = await Categories.getAll();
				const listCategories = categoriesData.data.filter((category) => idCategories.includes(category.id));
				listCategories.forEach(category => {
					if (!category.route || !textTranslation[category.route as keyof typeof textTranslation]) return;
					
					const option = {
						value: category.route,
						label: textTranslation[category.route as keyof typeof textTranslation]
					}
					if (!options.includes(option)) options.push(option);
				})
			}
		}
		setOptionsCategories(options);
	}

	useEffect(() => {
		console.log('===route', router.query.cities)
		if (listCountries && Object.keys(textTranslation).length > 0) {
			createListCountriesForOptions(listCountries);
		}
	}, [listCountries]);


	const handleSelects = (selectValue) => {
		console.log('===selectValue', selectValue)
    const { name, value } = selectValue;
		if (name === Constants.navigationMeetings.country && navigation?.city) {
			
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
			});
		} else if (name === Constants.navigationMeetings.city && navigation?.interest) {
			// Remove interest from another country and add new city
			setNavigation(prevState => {
				if (prevState[Constants.navigationMeetings.country] !== value) {
					const newState = { ...prevState };
					delete newState[Constants.navigationMeetings.interest];
					delete newState[Constants.navigationMeetings.category];
					newState[name] = value;
					return newState;
				}
			});
			setOptionsInterest([]);
		} else if (name === Constants.navigationMeetings.interest && navigation?.category) {
			// Remove category from another country and add new interest
			setNavigation(prevState => {
				if (prevState[Constants.navigationMeetings.category] !== value) {
					const newState = { ...prevState };
					delete newState[Constants.navigationMeetings.category];
					newState[name] = value;
					return newState;
				}
			});
		} else {
			setNavigation((prevState) => ({...prevState, [name]: value}));
		}
	}

	useEffect(() => {
		if (navigation?.country?.length >=0 && Object.keys(textTranslation).length > 0) {
			createListCitiesForOptions();
			createListInterestForOptions();
			createListCategoriesForOptions();
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
					placeholder={textTranslation[ML.key.selectCountry as keyof typeof textTranslation]}
					options={optionsCountries}
					onChange={handleSelects}
					defaultValue={Helpers.getCountryByUrlCountry(router.query.countries)}
				/>
				<SelectWithSearch
					name={Constants.navigationMeetings.city}
					placeholder={textTranslation[ML.key.selectCity as keyof typeof textTranslation]}
					options={optionsCities}
					onChange={handleSelects}
					defaultValue={router.query.cities}
				/>
				<SelectWithSearch
					name={Constants.navigationMeetings.interest}
					placeholder={textTranslation[ML.key.selectInterest as keyof typeof textTranslation]}
					options={optionsInterest}
					onChange={handleSelects}
				/>
				<SelectWithSearch
					name={Constants.navigationMeetings.category}
					placeholder={textTranslation[ML.key.selectCategory as keyof typeof textTranslation]}
					options={optionsCategories}
					onChange={handleSelects}
				/>
				<Button name={textTranslation[ML.key.goTo]} onClick={handleGoTo} />
			</div>
		</>
	);
};