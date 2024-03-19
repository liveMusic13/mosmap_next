'use client';

import { useSelector } from 'react-redux';

import Button from '@/components/ui/button/Button';

import { RootState } from '@/store/store';

import styles from './Header.module.scss';
import { arrayNumSettingIcons } from './icons.data';

export function Header() {
	const dataObjectsInMap = useSelector(
		(state: RootState) => state.dataObjectsInMap,
	);

	return (
		<header className={styles.header}>
			<div className={styles.map__buttons}>
				<div className={styles.block__title}>
					<h1 className={styles.title}>
						{dataObjectsInMap?.points?.title
							? dataObjectsInMap?.points?.title
							: 'Тестовая карта'}
					</h1>
				</div>
			</div>
			<div className={styles.settings__buttons}>
				{arrayNumSettingIcons.map(icon => {
					if (dataObjectsInMap.points['all-points'] >= 5000 && icon.id === 7) {
						return null;
					} else {
						return <Button key={icon.id} icon={icon} />;
					}
				})}
			</div>
		</header>
	);
}
