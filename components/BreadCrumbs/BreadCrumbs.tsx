import { BreadCrumbsProps, MultiRoute } from './BreadCrumbs.props';
import styles from './BreadCrumbs.module.css';
import React from 'react';
import Image from 'next/image';
import {iconHome, iconEarth, iconCity, iconNetworking, iconCategory, iconAdd, iconMeeting } from './images';
import Link from 'next/link';
import { ML } from '../../globals';

export const BreadCrumbs = ({ currentRoute, text }: BreadCrumbsProps): JSX.Element => {
	const lastItemRoute: string[] = Object.entries(currentRoute)[Object.keys(currentRoute).length - 1]
	
	return (
		<>
			<div className={styles.breadcrumb}>
				<ul>
					<li className={!lastItemRoute ? styles["active"] : ''}>
						<Link href="/"><Image src={iconHome} alt="icon" width={24} height={24} /></Link>
					</li>
					{(currentRoute as MultiRoute).countries && <li className={lastItemRoute[1] == (currentRoute as MultiRoute).countries ? styles["active"] : ''}>
						<Link href={
								{pathname: '/[countries]', query: {countries: (currentRoute as MultiRoute).countries}}
							}><Image src={iconEarth} alt="icon" width={24} height={24} />{text[ML.key.country]}
						</Link>
					</li>}
					{(currentRoute as MultiRoute).cities && <li className={lastItemRoute[1] == (currentRoute as MultiRoute).cities ? styles["active"] : ''}>
						<Link href={
								{pathname: '/[countries]/[cities]', query: {countries: (currentRoute as MultiRoute).countries, cities: (currentRoute as MultiRoute).cities}}
							}><Image src={iconCity} alt="icon" width={24} height={24} />{text[ML.key.city]}
						</Link>
					</li>}
					{(currentRoute as MultiRoute).interests && <li className={lastItemRoute[1] == (currentRoute as MultiRoute).interests ? styles["active"] : ''}>
						<Link href={
								{pathname: '/[countries]/[cities]/[interests]', query: {countries: (currentRoute as MultiRoute).countries, cities: (currentRoute as MultiRoute).cities, interests: (currentRoute as MultiRoute).interests}}
							}><Image src={iconNetworking} alt="icon" width={24} height={24} />{text[ML.key.interest]}
						</Link>
					</li>}
					{(currentRoute as MultiRoute).categories && <li className={lastItemRoute[1] == (currentRoute as MultiRoute).categories ? styles["active"] : ''}>
						<Link href={
								{pathname: '/[countries]/[cities]/[interests]/[categories]', query: {countries: (currentRoute as MultiRoute).countries, cities: (currentRoute as MultiRoute).cities, interests: (currentRoute as MultiRoute).interests, categories: (currentRoute as MultiRoute).categories}}
							}><Image src={iconCategory} alt="icon" width={24} height={24} />{text[ML.key.category]}
						</Link>
					</li>}
					{currentRoute === '/propose-meeting' && <li className={styles["active"]}>
						<Link href={
								{pathname: currentRoute}
							}><Image src={iconAdd} alt="icon" width={24} height={24} />{text[ML.key.offerToMeet]}
						</Link>
					</li>}
					{currentRoute === '/your-meetings' && <li className={styles["active"]}>
						<Link href={
								{pathname: currentRoute}
							}><Image src={iconMeeting} alt="icon" width={24} height={24} />{text[ML.key.yourMeetings]}
						</Link>
					</li>}
				</ul>
			</div>
		</>
	);
};


