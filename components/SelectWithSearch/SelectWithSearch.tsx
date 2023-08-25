import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ArrowOpen } from '../ArrowOpen/ArrowOpen';
import styles from './SelectWithSearch.module.css';
import { SelectWithSearchProps } from './SelectWithSearch.props';
import cn from 'classnames';
import {useOutsideClick} from '../../hooks';
import { ListEmpty } from '../ListEmpty/ListEmpty';
import { AdditionalInterface } from '../../typesAndInterfaces/interfaces';

const getLabelFromOptions = (options: AdditionalInterface.ListOptions, selectValue: string) => {
	if (options && selectValue) {
		const findElement = options.find(el => el.value === selectValue)
		if (findElement) return findElement.label
	}
	console.log('===test1')
}

export const SelectWithSearch = ({name, options, placeholder, defaultValue, onChange}: SelectWithSearchProps): JSX.Element => {
	const blockRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<string | undefined>('');
	const [selectedOption, setSelectedOption] = useState({name, value: ''});
	const [activeOptions, setActiveOptions] = useState(options || []);

	const handleOutsideClick = () => {
		setOpen(false);
	}
	useOutsideClick(blockRef, () => handleOutsideClick())

	const changeSelectedOption = (selectValue: string | null) => {
		if (selectValue) {
			if (selectValue?.length >= 0) {
				setOpen(false);
				const result = {name: name, value: selectValue};
				onChange(result);
				setSelectedOption(result)
				setValue(getLabelFromOptions(options, selectValue))
			}
		}
	}

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		setOpen(true);

		setValue(e.target.value)
		if (e.target.value === '') {
			setActiveOptions(options);
		}
		
		const filterOption = options.filter(option => option.label.toLowerCase().includes(e.target.value.toLowerCase()))
		setActiveOptions(filterOption);

		if (e.target.value === '' && selectedOption.value.length > 0) {
			changeSelectedOption('');
		}
	}

	useEffect(() => {
		if (options?.length >= 0) setActiveOptions(options)
	}, [options])

	useEffect(() => {
		if (options && defaultValue) {
			if (selectedOption.value == defaultValue) setValue(getLabelFromOptions(options, defaultValue))
			if (selectedOption.value != defaultValue) setValue(getLabelFromOptions(options, selectedOption.value))
		} else if (options && !defaultValue && value && value?.length > 0) {
			const selectedValue = options.find(option => option.label === value);
			if (!selectedValue) setValue('')
		}
	}, [options, defaultValue])

	useEffect(() => {
		changeSelectedOption(defaultValue);
	}, [defaultValue]);

	return (
		<>
			<div className={cn(styles.selectWithSearch, {[styles.open]: open})} ref={blockRef}>
				<div className={styles.header} onClick={() => setOpen(!open)}>
					<input type="text" placeholder={placeholder}
						onChange={handleInput}
						value={value || ''}
					/>
					<div className={styles.arrow}>
						<ArrowOpen open={open} color='light' />
					</div>
				</div>
				<div className={styles.list}>
					<ul>
						{activeOptions?.map((v, i) => (
							<li key={i} value={v.value} onClick={() => changeSelectedOption(v.value)}>{v.label}</li>
						))}
						{activeOptions?.length === 0  && <ListEmpty/>}
					</ul>
				</div>
			</div>
		</>
	);
};