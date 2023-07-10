import React, { useEffect, useRef, useState } from 'react';
import styles from './MapFolding.module.css';
import cn from 'classnames';

export const MapFolding = ():JSX.Element => {
	const [activeAnimation, setActiveAnimation] = useState(false);
	const mapRef = useRef();

	useEffect(() => {
		window.addEventListener('scroll', scrollHandler);
		return () => window.removeEventListener('scroll', scrollHandler);
	}, []);

	const scrollHandler = () => {
		const topScreen = window.pageYOffset;
		const bottomScreen = window.pageYOffset + window.innerHeight;
		const topBlock = mapRef.current.offsetTop;
		const bottomBlock = mapRef.current.offsetTop + mapRef.current.offsetHeight;
		if(topBlock >= topScreen && topBlock <= bottomScreen
			|| bottomBlock >= topScreen && bottomBlock <= bottomScreen
		) {
			setActiveAnimation(true);
		} else {
			setActiveAnimation(false);
		}
	}
	return (
		<>
			<div ref = {mapRef} className={cn(styles.mapBox, {[styles.activeAnimation]: activeAnimation})}
				onMouseMove={() => setActiveAnimation(false)}
				onMouseLeave={() => setActiveAnimation(true)}
			>
				<div className={styles.map}>
					<div className={styles.fold}></div>
					<div className={styles.fold}></div>
					<div className={styles.fold}></div>
					<div className={styles.fold}></div>
					<div className={styles.fold}></div>
				</div>
			</div>
		</>
	);
};