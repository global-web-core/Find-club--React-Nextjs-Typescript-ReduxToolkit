import { BreadCrumbsProps } from './BreadCrumbs.props';
import styles from './BreadCrumbs.module.css';
import React from 'react';
import Image from 'next/image';
import {iconHome, iconEarth, iconCity, iconNetworking, iconCategory, iconAdd, iconMeeting } from './images';
import Link from 'next/link';
import { ML } from '../../globals';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from "querystring";

export const BreadCrumbs = ({ text }: BreadCrumbsProps): JSX.Element => {
	const router = useRouter();
	const currentRoute: ParsedUrlQuery | string = Object.keys(router.query).length > 0 ? router.query : router.pathname;
	const lastItemRoute = Object.entries(currentRoute)[Object.keys(currentRoute).length - 1]
	return (
		<>
			<div className={styles.breadcrumb}>
				<ul>
					<li className={!lastItemRoute ? styles["active"] : ''}>
						<Link href="/"><Image src={iconHome} alt="icon" width={24} height={24} /></Link>
					</li>
					{typeof currentRoute === 'object' && currentRoute.countries &&
						<li className={lastItemRoute[1] == currentRoute.countries ? styles["active"] : ''}>
							<Link href={
									{pathname: '/[countries]', query: {countries: currentRoute.countries}}
								}><Image src={iconEarth} alt="icon" width={24} height={24} />{text[ML.key.country]}
							</Link>
						</li>
					}
					{typeof currentRoute === 'object' && currentRoute.cities &&
						<li className={lastItemRoute[1] == currentRoute.cities ? styles["active"] : ''}>
							<Link href={
									{pathname: '/[countries]/[cities]', query: {countries: currentRoute.countries, cities: currentRoute.cities}}
								}><Image src={iconCity} alt="icon" width={24} height={24} />{text[ML.key.city]}
							</Link>
						</li>
					}
					{typeof currentRoute === 'object' && currentRoute.interests &&
						<li className={lastItemRoute[1] == currentRoute.interests ? styles["active"] : ''}>
							<Link href={
									{pathname: '/[countries]/[cities]/[interests]', query: {countries: currentRoute.countries, cities: currentRoute.cities, interests: currentRoute.interests}}
								}><Image src={iconNetworking} alt="icon" width={24} height={24} />{text[ML.key.interest]}
							</Link>
						</li>
					}
					{typeof currentRoute === 'object' && currentRoute.categories &&
						<li className={lastItemRoute[1] == currentRoute.categories ? styles["active"] : ''}>
							<Link href={
									{pathname: '/[countries]/[cities]/[interests]/[categories]', query: {countries: currentRoute.countries, cities: currentRoute.cities, interests: currentRoute.interests, categories: currentRoute.categories}}
								}><Image src={iconCategory} alt="icon" width={24} height={24} />{text[ML.key.category]}
							</Link>
						</li>
					}
					{currentRoute === '/propose-meeting' &&
						<li className={styles["active"]}>
							<Link href={
									{pathname: currentRoute}
								}><Image src={iconAdd} alt="icon" width={24} height={24} />{text[ML.key.offerToMeet]}
							</Link>
						</li>
					}
					{currentRoute === '/your-meetings' &&
						<li className={styles["active"]}>
							<Link href={
									{pathname: currentRoute}
								}><Image src={iconMeeting} alt="icon" width={24} height={24} />{text[ML.key.yourMeetings]}
							</Link>
						</li>
					}
				</ul>
			</div>
		</>
	);
};