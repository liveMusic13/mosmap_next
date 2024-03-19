import { createSlice } from '@reduxjs/toolkit';

import { IUserMap } from '@/types/slice.types';

const initialState: IUserMap = {
	map: '247',
};

export const userMap = createSlice({
	name: 'userMap',
	initialState,
	reducers: {
		addNumMap: (state, { payload }) => {
			state.map = payload;
		},
	},
});

export const { actions, reducer } = userMap;
