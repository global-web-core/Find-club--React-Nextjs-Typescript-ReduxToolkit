import {SelectInterestProps} from './SelectInterest.props';
import React, { useState, useEffect } from 'react';
import { Select, Button } from '../../components';
import { useRouter } from "next/router";
import { InterestsInterface } from '../../typesAndInterfaces/interfaces';
import { ML } from '../../globals';

export const SelectInterest = ({ listInterests, text }: SelectInterestProps): JSX.Element => {
	const router = useRouter();

	const translateInterests = () => {
		listInterests.map(interest => {
			if (text[interest.route]) interest.translation = text[interest.route];
		});
	}
	translateInterests();

	const [list, setList] = useState<InterestsInterface.Db[]>(listInterests || []);
	const [pathInterest, setPathInterest] = useState<string | null>(null);

	const handleClick = () => {
		if (pathInterest) {
			router.push({
				pathname: '/[countries]/[cities]/[interests]',
				query: {countries: router.query.countries, cities: router.query.cities, interests: pathInterest}
			});
		}
	};

	const handleSelect = (value: string) => setPathInterest(value);

	useEffect(() => {
		setList(listInterests);
	}, [listInterests]);

	return (
		<div>
			<Select
				nameEmptyOption={text[ML.key.selectInterest]}
				nameKeyOption='id'
				nameValueOption='route'
				nameInnerOption='translation'
				list={list}
				valueSelect={(value:string) => handleSelect(value)}
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