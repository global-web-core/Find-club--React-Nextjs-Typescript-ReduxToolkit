import { SelectProps } from './Select.props';
import React, { useEffect, useState } from 'react';
import styles from './Select.module.css';
import cn from 'classnames';

export const Select = ({ list, nameKeyOption, nameValueOption, nameInnerOption, nameEmptyOption, nameSelectedOption = '', nameSelect, rightAngle=false, required, error=false, ...props }: SelectProps): JSX.Element => {
	const [selectValue, setSelectValue] = useState(nameSelectedOption || '');
	const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
		setSelectValue((e.target as HTMLSelectElement).value);
		if ((e.target as HTMLSelectElement).name.length) {
			props.valueSelect((e.target as HTMLSelectElement).value, (e.target as HTMLSelectElement).name);
			return;
		}
		props.valueSelect((e.target as HTMLSelectElement).value);
	}

	useEffect(() => {
		setSelectValue(nameSelectedOption);
	}, [nameSelectedOption])
	
	return (
		<>
			<select name={nameSelect} className={cn(styles.select, {[styles.rightAngle]: rightAngle, [styles.error]: error})} onChange={handleChange} value={selectValue} required={required}>
				<option value="">{nameEmptyOption}</option>
				{list.length && nameKeyOption && nameValueOption && nameInnerOption && 
					list.map((v) => (
						<option
							key={v[nameKeyOption as keyof typeof v]}
							value={v[nameValueOption as keyof typeof v]}
						>{v[nameInnerOption as keyof typeof v]}</option>
					))
				}
			</select>
		</>
	);
};