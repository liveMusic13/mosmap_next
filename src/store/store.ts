import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { reducer as adresFilterString } from './adres-filter-string/adresFilterString.slice';
import { reducer as dataFilters } from './data-filters/dataFilters.slice';
import { reducer as dataObjectInfo } from './data-object-info/dataObjectInfo.slice';
import { reducer as dataObjectsInMap } from './data-objects-in-map/dataObjectsInMap.slice';
import { reducer as userMap } from './user-map/userMap.slice';
import { reducer as viewSettings } from './view-settings/viewSettings.slice';

const reducers = combineReducers({
	viewSettings: viewSettings,
	dataObjectsInMap: dataObjectsInMap,
	dataObjectInfo: dataObjectInfo,
	userMap: userMap,
	dataFilters: dataFilters,
	adresFilterString: adresFilterString,
});

export const store = configureStore({
	reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
