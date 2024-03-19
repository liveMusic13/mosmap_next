import { Dispatch, SetStateAction } from 'react';

import { IIconsData } from './iconsData.types';
import { IDataFilters, IDataObjectInfo, IMarker } from './slice.types';

export interface IZoomTracker {
	setZoomLevel: Dispatch<SetStateAction<number>>;
}

export interface IRenderMarkers {
	isMobile: boolean;
	zoomLevel: number;
}

export interface IIconMarker {
	object: IDataObjectInfo;
}

export interface IFlyToLocation {
	centerMapObject: [number, number];
	isInitialized: boolean;
	setIsInitialized: Dispatch<SetStateAction<boolean>>;
}

export interface ICanvasMarkersLayer {
	markersData: IDataObjectInfo[];
	isMobile: boolean;
}

export interface IButton {
	icon: IIconsData;
	newCenter?: (arr: number[]) => void;
	elem?: IMarker;
}

export interface ILoading {
	height: string;
}

export interface IAllObjects {
	isDisplay?: boolean;
	isMobile?: boolean;
}

export interface IInput {
	placeholder: string;
	name: string;
	clearFilter: boolean;
}

export interface IBlockInput {
	title: string;
	id: number;
	clearFilter: boolean;
}

export interface ICustomSelect {
	isMultiChoice: boolean;
	title: string;
	isImage: boolean;
	dataSelect: IDataFilters;
	clearFilter: boolean;
}
