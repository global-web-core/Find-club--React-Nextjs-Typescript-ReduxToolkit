import { SelectWithImageProps, OptionsType } from './SelectWithImage.props';
import styles from './SelectWithImage.module.css';
import cn from 'classnames';
import React, { useEffect, useState, useRef, useLayoutEffect, MouseEvent, RefObject } from 'react';
import Image from 'next/image';
import {iconList} from './images';
import { ArrowOpen, Button } from '../../components';
import { useOutsideClick } from '../../hooks';

export const SelectWithImage = ({ list, nameKeyOption, nameValueOption, nameInnerOption, nameEmptyOption, nameSelectedOption, settingPathsImages, extensionFilesImages, button=false, nameButton='', clickButton, ...props }: SelectWithImageProps): JSX.Element => {
	const [selectValue, setSelectValue] = useState('');
	const [openList, setOpenList] = useState(false);
	const [listPathsImages, setListPathsImages] = useState([] as {[key: string]: string}[]);
	const [widthButton, setWidthButton] = useState(0);

	const selectRef = useRef(null);
	const buttonRef = useRef(null);

	const basePath = '/../public/images/' + settingPathsImages + '/';
	
	const handleChange = (value: string) => {
		setSelectValue(value);
		props.valueSelect(value);
	}

	const toogleOpenList = (e: MouseEvent<HTMLElement>) => {
		if (e.target !== buttonRef.current) setOpenList(!openList);
	}

	const getSelectValue = (): OptionsType | string => {
		const option = (list as OptionsType[]).find((item: OptionsType) => {
			return item[nameValueOption as keyof typeof item] === selectValue;
		}) || '';
		return option;
	}

	const addPathsImagesInList = () => {
		const listPaths: {[key: string]: string}[] = [];
		list.forEach(option => {
			listPaths.push({
				optionName: option[nameValueOption as keyof typeof option] as string,
				imagePath: basePath + option[nameValueOption as keyof typeof option] + '.' + extensionFilesImages
			})
		})
		if (listPaths.length) setListPathsImages(listPaths);
	}

	const getPathImage = (optionValue: string) => {
		const pathImage = listPathsImages.find(image => {
			return image.optionName === optionValue;
		})
		if (pathImage) return pathImage.imagePath;
		return '';
	}

	useEffect(() => {
		addPathsImagesInList();
	}, []);

	useLayoutEffect(() => {
		if (buttonRef?.current && button && (buttonRef?.current as HTMLElement).innerHTML.length) {
			setWidthButton((buttonRef.current as HTMLElement).offsetWidth);
		}
  },  [button]);
	
	useEffect(() => {
		if (nameSelectedOption) setSelectValue(nameSelectedOption);
	}, [nameSelectedOption]);

	const handleOutsideClick = () => {
		setOpenList(false);
	}

	useOutsideClick(selectRef, () => handleOutsideClick())

	const styleOptionsMargin = {
		marginRight: 15 + widthButton + 'px'
	};

	const handleClick = () => {
		setOpenList(false);
		if (clickButton) clickButton();
	}

	return (
		<div className={styles.main}>
			<div ref={selectRef} className={cn(styles.selectWithImage, {[styles.open]: openList})} onClick={(e) => toogleOpenList(e)}>
				<div className={styles.header}>
					<div className={styles.itemHeader}>
						{list.length && <Image className={styles.icon} src={selectValue?.length ? getPathImage(getSelectValue()[nameValueOption as keyof typeof getSelectValue]) as string : iconList.src} width={30} height={30} alt='flag' />}
						{selectValue?.length ? <span>{getSelectValue()[nameInnerOption as keyof typeof getSelectValue]}</span> : <span>{nameEmptyOption}</span>}
					</div>
					<div className={cn(styles.headerRight, {[styles.useButton]: button})}>
						<ArrowOpen open={openList} />
						{button && <Button ref={buttonRef} name={nameButton} onClick={handleClick} />}
					</div>
				</div>
				<div className={styles.content}>
					<div className={styles.downSection}>
						<hr />
						<div className={styles.listItems}>
							<div className={styles.item}
								onClick={() => handleChange('')}
							>
								<Image className={styles.icon} src={iconList} width={30} height={30} alt='flag' />
								<span style={styleOptionsMargin}>{nameEmptyOption}</span>
							</div>
							{list.length && nameKeyOption && nameValueOption && nameInnerOption && 
								list.map((v) => (
									<div className={styles.item}
										key={v[nameKeyOption as keyof typeof v]}
										onClick={() => handleChange(v[nameValueOption as keyof typeof v] as string)}
									>
										{getPathImage(v[nameValueOption as keyof typeof v] as string) && <Image className={styles.icon} src={getPathImage(v[nameValueOption as keyof typeof v] as string)} width={30} height={30} alt='flag' />}
										<span>{v[nameInnerOption as keyof typeof v]}</span>
									</div>
								))
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};