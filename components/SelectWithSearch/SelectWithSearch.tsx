import { RefObject, useEffect, useRef, useState } from 'react';
import { ArrowOpen } from '../ArrowOpen/ArrowOpen';
import styles from './SelectWithSearch.module.css';
import { SelectWithSearchProps } from './SelectWithSearch.props';
import cn from 'classnames';
import { useRouter } from 'next/router';
import {useOutsideClick} from '../../hooks';
import { ML } from '../../globals';
import { useAppSelector } from '../../store/hook';
import { TextTranslationSlice } from '../../store/slices';
import { ListEmpty } from '../ListEmpty/ListEmpty';

const getLabelFromOptions = (options, selectValue) => {
	if (options, selectValue) {
		const findElement = options.find(el => el.value === selectValue)
		if (findElement) return findElement.label
	}
}

export const SelectWithSearch = ({options, placeholder, defaultValue, onChange}: SelectWithSearchProps): JSX.Element => {
	const blockRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [activeOptions, setActiveOptions] = useState(options || []);

	const handleOutsideClick = () => {
		setOpen(false);
	}
	useOutsideClick(blockRef, () => handleOutsideClick())

	const selectedOption = (selectValue) => {
		if (selectValue) {
			setOpen(false);
			onChange(selectValue);
	
			setValue(getLabelFromOptions(options, selectValue))

		}
	}

	const handleInput = (e) => {
		setOpen(true);

		setValue(e.target.value)
		if (e.target.value === '') {
			setActiveOptions(options);
			return
		}
		
		const filterOption = options.filter(option => option.label.toLowerCase().includes(e.target.value.toLowerCase()))
		setActiveOptions(filterOption);
	}

	useEffect(() => {
		if (options?.length >= 0) setActiveOptions(options)
	}, [options])

	useEffect(() => {
		if (options, defaultValue) {
			setValue(getLabelFromOptions(options, defaultValue))
		}
	}, [options, defaultValue])

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
							<li key={i} value={v.value} onClick={() => selectedOption(v.value)}>{v.label}</li>
						))}
						{activeOptions?.length === 0  && <ListEmpty/>}
					</ul>
				</div>
			</div>
		</>
	);
};