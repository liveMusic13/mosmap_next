'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AllObjects } from '@/components/content/all-objects/AllObjects';
import Filters from '@/components/content/filters/Filters';
import ObjectInfo from '@/components/content/object-info/ObjectInfo';

import { RootState } from '@/store/store';
import { actions as viewSettingsAction } from '@/store/view-settings/viewSettings.slice';

import useWindowDimensions from '@/hooks/useWindowDimensions';

import styles from './SettingsMap.module.scss';

export function SettingsMap() {
	const viewSettings = useSelector((state: RootState) => state.viewSettings);
	const dispatch = useDispatch();
	const { width } = useWindowDimensions();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		if (width && width <= 767.98) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	}, [width]);

	return (
		<div className={styles.wrapper_settings}>
			<button
				className={styles.settings__button}
				onClick={() => {
					dispatch(viewSettingsAction.toggleSettingsMap(''));
					if (viewSettings.isViewFilters)
						dispatch(viewSettingsAction.toggleFilters(''));
					if (viewSettings.isViewObjects)
						dispatch(viewSettingsAction.toggleObjects(''));
					if (width && width <= 767.98)
						dispatch(viewSettingsAction.defaultObjectInfo(''));
				}}
			>
				<span></span>
			</button>
			{viewSettings.isViewFilters && <Filters isMobile={isMobile} />}
			{viewSettings.isObjectInfo && <ObjectInfo isMobile={isMobile} />}
			{viewSettings.isViewObjects && <AllObjects isMobile={isMobile} />}
		</div>
	);
}
