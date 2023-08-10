import React, { useEffect, useState } from 'react';
import styles from './NavigationMeetings.module.css';
import { NavigationMeetingsProps } from './NavigationMeetings.props';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { Constants, ML } from '../../globals';
import { useAppSelector } from '../../store/hook';
import { TextTranslationSlice } from '../../store/slices';
import {SelectCountry, SelectWithImage, SelectWithSearch} from '../../components';

export const NavigationMeetings = ({country, listCountries, listLanguages}: NavigationMeetingsProps): JSX.Element => {
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const [optionsCountries, setOptionsCountries] = useState([]);

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

	useEffect(() => {
		createListCountriesForOptions(listCountries);
	}, [listCountries, textTranslation]);


	const handleSelects = (selectValue) => {
    const { name, value } = selectValue;
    setNavigation((prevState) => ({...prevState, [name]: value}));
	}

	useEffect(() => {
		console.log('===navigation', navigation)
	}, [navigation])


	return (
		<>
			<div className={styles.navigationMeetings}>
				<SelectWithSearch
					name={Constants.navigationMeetings.country}
					placeholder={textTranslation[ML.key.selectCountry as keyof typeof textTranslation]}
					options={optionsCountries}
					onChange={handleSelects}
					defaultValue={country.route}
				/>
			</div>
		</>
	);
};