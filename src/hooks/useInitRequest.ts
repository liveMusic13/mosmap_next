import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions as dataFiltersAction } from '@/store/data-filters/dataFilters.slice';
import { actions as dataObjectsInMapAction } from '@/store/data-objects-in-map/dataObjectsInMap.slice';
import { RootState } from '@/store/store';
import { actions as viewSettingsActions } from '@/store/view-settings/viewSettings.slice';

import { $axios } from '@/api/api';

export const dynamic = true;

export const useInitRequest = () => {
	const adresFilterString = useSelector(
		(state: RootState) => state.adresFilterString,
	);
	const dispatch = useDispatch();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	const getObject = useCallback(async () => {
		try {
			dispatch(viewSettingsActions.activeLoading(''));
			if (adresFilterString.srcRequest === '') {
				const response = await $axios.get(`/api/get_objects.php?map=${map}`);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
			} else {
				const response = await $axios.get(
					`/api/get_objects.php${adresFilterString.srcRequest}`,
				);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
			}
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(viewSettingsActions.defaultLoading(''));
		}
	}, [
		map,
		dispatch,
		viewSettingsActions,
		dataObjectsInMapAction,
		adresFilterString.srcRequest,
	]);

	const getFilters = useCallback(async () => {
		try {
			const responce = await axios.get(
				`https://mosmap.ru/api/filters.php?map=${map}`,
			);
			dispatch(dataFiltersAction.addFilters(responce.data));
		} catch (error) {
			console.log(error);
		}
	}, [map, dispatch, dataFiltersAction]);

	return { getObject, getFilters };
};
