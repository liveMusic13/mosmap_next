'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Content } from '@/components/content/Content';
import { SettingsMap } from '@/components/settings-map/SettingsMap';

import { RootState } from '@/store/store';
import { actions as userMapAction } from '@/store/user-map/userMap.slice';
import { actions as viewSettingsActions } from '@/store/view-settings/viewSettings.slice';

import { useInitRequest } from '@/hooks/useInitRequest';
import useWindowDimensions from '@/hooks/useWindowDimensions';

export default function Home() {
	//TODO: ЕСЛИ ТАК НЕ ПОЛУЧИТЬСЯ, ТО СОЗДАТЬ ОТДЕЛЬНЫЙ КОМПОНЕНТ, В НЕГО ВСЕ ПОМЕСТИТЬ, А В ЭТОМ КОМПОНЕНТЕ ПРОСТО В RETURN ВЕРНУТЬ И ВСЁ

	const dispatch = useDispatch();
	const adresFilterString = useSelector(
		(state: RootState) => state.adresFilterString,
	);
	const { isSettingsMap } = useSelector(
		(state: RootState) => state.viewSettings,
	);
	const { width } = useWindowDimensions();
	const { push } = useRouter();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const { getObject, getFilters } = useInitRequest();
	const [initApp, setInitApp] = useState(false);

	useEffect(() => {
		dispatch(userMapAction.addNumMap(map));
	}, []);

	useEffect(() => {
		if (adresFilterString.srcRequest !== '') {
			setInitApp(true);
		}
	}, [adresFilterString.srcRequest]);

	useEffect(() => {
		if (!map) {
			push(`?map=7`);
		} else {
			getObject();
			getFilters();
		}
	}, [map, initApp]);

	useEffect(() => {
		if (width && width <= 767.98) {
			dispatch(viewSettingsActions.defaultFilters(''));
			dispatch(viewSettingsActions.defaultObjects(''));
		}
	}, [width]);

	console.log('render Home');
	return (
		<div style={{ height: '100%' }}>
			<Content />
			{isSettingsMap && <SettingsMap />}
		</div>
	);
}
