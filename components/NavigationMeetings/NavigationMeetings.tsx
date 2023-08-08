import React, { useEffect, useState } from 'react';
import styles from './NavigationMeetings.module.css';
import { NavigationMeetingsProps } from './NavigationMeetings.props';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { ML } from '../../globals';
import { useAppSelector } from '../../store/hook';
import { TextTranslationSlice } from '../../store/slices';
import {SelectCountry, SelectWithImage, SelectWithSearch} from '../../components';

export const NavigationMeetings = ({country, listCountries, listLanguages}: NavigationMeetingsProps): JSX.Element => {
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const [optionsCountries, setOptionsCountries] = useState([]);

	const [navigation, setNavigation] = useState({
    country: country,
  });

	const handleCityChange = (event) => {
		// console.log('===event', event.target.attributes)
    const { name, value } = event.target;
		console.log('===1', ML.key[value])
		console.log('===name', name)
		console.log('===value', value)
    setNavigation((prevCities) => ({
      ...prevCities,
      [name]: value,
    }));
    // Обработка значения для конкретного города
  }

	// useEffect(() => {
	// 	console.log('===listCountries', listCountries)
	// }, [])

	const handleSelect = () => {
		console.log('===test')
	}



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

	useEffect(() => {
		createListCountriesForOptions(listCountries);
	}, [listCountries, textTranslation]);


	const handleSelectCountry = (selectValue) => {
		console.log('===handleSelectCountry', selectValue)
	}


	return (
		<>
			<div className={styles.navigationMeetings}>
				<SelectWithSearch
					placeholder={textTranslation[ML.key.selectCountry as keyof typeof textTranslation]}
					options={optionsCountries}
					onChange={handleSelectCountry}
					defaultValue={country.route}
				/>
			</div>
		</>
	);
};