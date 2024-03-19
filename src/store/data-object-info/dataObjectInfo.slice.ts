import { createSlice } from '@reduxjs/toolkit';

import { IDataObjectInfo } from '@/types/slice.types';

const initialState: IDataObjectInfo | any = {};

export const dataObjectInfo = createSlice({
	name: 'dataObjectInfo',
	initialState,
	reducers: {
		addObjectInfo: (state, { payload }) => {
			return payload;
		},
		deleteObjectInfo: (state, { payload }) => {
			return {};
		},
	},
});

export const { actions, reducer } = dataObjectInfo;
