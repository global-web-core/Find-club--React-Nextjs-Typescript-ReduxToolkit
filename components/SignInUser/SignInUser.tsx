import { SignInUserProps } from './SignInUser.props';
import React from 'react';
import styles from './SignInUser.module.css';
import Image from 'next/image';
import {iconGoogle} from './images';

export const SignInUser = ({ listProviders, handleSignIn }: SignInUserProps): JSX.Element => {
	const handleClick = (providerId: string) => {
		handleSignIn(providerId);
	}
	
	return (
		<>
			{Object.values(listProviders).map((provider) => (
				<div key={provider.name} className={styles.signin}>
					<div className={styles.main}>
						<h1>Войдите в ваш аккаунт</h1>
						<div className={styles.item} onClick={() => handleClick(provider.id)}>
							<Image  className={styles.image} src={provider.id === 'google' && iconGoogle || ''} alt="icon" width={48} height={48} />
							<span>{provider.name}</span>
						</div>
					</div>
        </div>
      ))}
		</>
	);
};