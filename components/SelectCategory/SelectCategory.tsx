import { SelectCategoryProps } from "./SelectCategory.props";
import React, { useState, useEffect } from 'react';
import { Select, Button } from '../../components';
import { useRouter } from "next/router";
import { CategoryInterface } from '../../typesAndInterfaces/interfaces';
import { ML } from "../../globals";

export const SelectCategory = ({ listCategories, text }: SelectCategoryProps): JSX.Element => {
	const router = useRouter();
	
	const translateInterests = () => {
		listCategories.map(category => {
			if (text[category.route]) category.translation = text[category.route];
		});
	}
	translateInterests();

	const [list, setList] = useState<CategoryInterface.Db[]>(listCategories || []);
	const [pathCategory, setPathCategory] = useState<string | null>(null);

	const handleClick = () => {
		if (pathCategory) {
			router.push({
				pathname: '/[countries]/[cities]/[interests]/[categories]',
				query: {countries: router.query.countries, cities: router.query.cities, interests: router.query.interests, categories: pathCategory}
			});
		}
	};

	const handleSelect = (value:string) => setPathCategory(value);

	useEffect(() => {
		setList(listCategories);
	}, [listCategories]);

	return (
		<div>
			<Select
				nameEmptyOption={text[ML.key.selectCategory]}
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
