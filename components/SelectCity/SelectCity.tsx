import { SelectCityProps } from './SelectCity.props';
import { CitiesInterface } from '../../interfaces';
import React, { useState, useEffect } from 'react';
import { Select, Button } from '../../components';
import { useRouter } from "next/router";
import { ML } from '../../globals';

export const SelectCity = ({ listCities, text }: SelectCityProps): JSX.Element => {
	const translateCountries = () => {
		listCities.map(city => {
			if (text[city.route]) city.translation = text[city.route];
		});
	}
	translateCountries();

	const [list, setList] = useState<CitiesInterface.City[]>(listCities || []);
	const [pathCity, setPathCity] = useState<string | null>(null);
	const router = useRouter();

	const handleClick = () => {
		if (pathCity) {
			router.push({
				pathname: '[countries]/[cities]',
				query: {countries: router.query.countries, cities: pathCity}
			});
		}
	};

	const handleSelect = (value: string) => setPathCity(value);
	
	useEffect(() => {
		setList(listCities);
	}, [listCities]);

	
	return (
		<div>
			{/* {console.log('===list',list)} */}
			<Select
				nameEmptyOption={text[ML.key.selectCity]}
				nameKeyOption='id'
				nameValueOption='route'
				nameInnerOption='translation'
				list={list}
				valueSelect={(value: string) => handleSelect(value)}
				rightAngle={true}
			/>
			<Button
				name={text[ML.key.goTo]}
				onClick={handleClick}
				leftAngle={true}
			/>
		</div>
	);
};