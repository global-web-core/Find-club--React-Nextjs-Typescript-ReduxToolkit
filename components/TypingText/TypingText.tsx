import React, { useEffect, useState } from 'react';
import styles from './TypingText.module.css';
import cn from 'classnames';

export const TypingText = ({listText}):JSX.Element => {
	const [lengthListText, setLengthListText] = useState(0);
	const [text, setText] = useState(null);
	const [runningAnimation, setRunningAnimation] = useState(false);
	const [countAnimation, setCountAnimation] = useState(0);

	const timeTypingOneText = 5000;
	const maxCountRepeat = 50;

	let timerAnimation;
	let timerRestart;
	const addText = (textAdd, index) => {
		timerAnimation = setTimeout(() => {
			setText(textAdd);
			setRunningAnimation(true);
			setCountAnimation((prevValue) => ++prevValue)
		}, index * timeTypingOneText);	
	}

	const startTyping = () => {
		setLengthListText(listText.length);
		for (let index = 0; index < listText.length; index++) {
			const element = listText[index];
			addText(element, index);
		}
	}

	const restartTyping = () => {
		timerRestart = setTimeout(() => {
			setRunningAnimation(false);
			startTyping();
		}, lengthListText * timeTypingOneText);
	}

	const clearAllTimer = () => {
		clearTimeout(timerAnimation)
		clearTimeout(timerRestart)
	}

	useEffect(() => {
		startTyping();

		return () => {
			clearAllTimer()
		};
	}, [])

	useEffect(() => {
		if (countAnimation > maxCountRepeat) {
			setRunningAnimation(false)
			setText(null)
			clearAllTimer()
		} else {
			restartTyping();
		}
	}, [countAnimation])

	return (
		<>
			<div className={styles.typewriterBox}>
				<div className={styles.typewriter}>
					<span className={cn(styles.innerText, {[styles.runningAnimation]:runningAnimation})}>{text}</span>
				</div>
			</div>
		</>
	);
};