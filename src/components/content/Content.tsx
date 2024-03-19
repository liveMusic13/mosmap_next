'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store/store';
import { actions as viewSettingsAction } from '@/store/view-settings/viewSettings.slice';

import useWindowDimensions from '@/hooks/useWindowDimensions';

import styles from './Content.module.scss';
import { AllObjects } from './all-objects/AllObjects';
import Filters from './filters/Filters';
import ObjectInfo from './object-info/ObjectInfo';

const DynamicMapCustom = dynamic(
	() => import('./custom-map/CustomMap').then(mod => mod.CustomMap),
	{ ssr: false },
);

export function Content() {
	const viewSettings = useSelector((state: RootState) => state.viewSettings);
	const dataObjectsInMap = useSelector(
		(state: RootState) => state.dataObjectsInMap,
	);
	// const windowSize = window.innerWidth;
	const { width } = useWindowDimensions();
	const [isDisplay, setIsDisplay] = useState<boolean>(true);
	const dispatch = useDispatch();

	useEffect(() => {
		if (width && width <= 768) {
			setIsDisplay(false);
			dispatch(viewSettingsAction.defaultDisplay(''));
		} else if (width && width > 768) {
			setIsDisplay(true);
			dispatch(viewSettingsAction.activeDisplay(''));
		}
	}, [width]);
	console.log('content', isDisplay);
	return (
		<div className={styles.wrapper}>
			{viewSettings.isViewFilters && <Filters isDisplay={isDisplay} />}
			{viewSettings.isObjectInfo && <ObjectInfo isDisplay={isDisplay} />}
			{viewSettings.isViewObjects &&
				dataObjectsInMap.points['all-points'] <= 5000 && (
					<AllObjects isDisplay={isDisplay} />
				)}
			<div className={styles.block__map}>
				<DynamicMapCustom />
				<div className={styles.logo__image}>
					<a href='https://mosmap.ru'></a>
				</div>
			</div>
		</div>
	);
}
