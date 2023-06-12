import {SelectCountryProps} from './SelectCountry.props';
import {CountriesInterface, LanguagesInterface} from '../../interfaces';
import React, {useState} from 'react';
import {useRouter} from "next/router";
import {ML} from '../../globals';
import {SelectWithImage} from '../../components';
import styles from './SelectCountry.module.css';

export const SelectCountry = ({listCountries, listLanguages, text}: SelectCountryProps): JSX.Element => {
	const translateCountries = () => {
		listCountries.map(country => {
			if (text[country.route]) country.translation = text[country.route];
		});
	}
	translateCountries();

	const router = useRouter();
	const [countries] = useState<CountriesInterface.Country[]>(listCountries || []);
	const [languages] = useState<LanguagesInterface.Languages[]>(listLanguages || []);
	const [pathCountry, setPathCountry] = useState<string | null>(null);

	const handleClick = () => {
		let urlCountry = pathCountry;
		if (urlCountry) {
			const settingLanguage = ML.getLanguage();
			const currentCountry = countries.find(country => country.route === urlCountry);
			const currentLanguage = languages.find((language: LanguagesInterface.Languages) => currentCountry && language.idCountry === currentCountry.id);
			if (!settingLanguage && currentLanguage) ML.setLanguage(currentLanguage.route);

			urlCountry = urlCountry + ML.addInPathLanguage(settingLanguage, currentLanguage);

			router.push({
				pathname: '[countries]',
				query: {countries: urlCountry}
			});
		}
	};

	const handleSelectCountry = (value: string) => {
		setPathCountry(ML.getPathByCountry(countries, languages, value));
	};
	
	return (
		<div className={styles.selectCountry}>
			<SelectWithImage
				nameEmptyOption={text[ML.key.selectCountry as keyof typeof text]}
				nameKeyOption='id'
				nameValueOption='route'
				nameInnerOption='translation'
				// nameSelectedOption={null}
				settingPathsImages='selectwithimage/countries'
				extensionFilesImages='png'
				list={countries}
				valueSelect={(value:string) => handleSelectCountry(value)}
				button={true}
				nameButton={text[ML.key.goTo] as string}
				clickButton={handleClick}
			/>
		</div>
	);
};