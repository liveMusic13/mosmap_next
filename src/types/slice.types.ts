export interface IAdresFilterString {
	srcRequest: string;
}

export interface IItemsFilter {
	item_id: number;
	item_name: string;
}

export interface IDataFilters {
	caption: string;
	id: number;
	items?: IItemsFilter[];
	multiple?: number;
	name: string;
	type: string;
}

export interface IValues {
	disabled: number;
	el: string;
	label: string;
	name: string;
	type?: string;
	id?: string;
	value: string | number;
}

export interface IDataObjectInfo {
	area?: number[]; //TODO: УЗНАТЬ ПРО ДАННЫЕ ЧТО ТУТ БУДУТ
	color?: string;
	crd?: [number, number];
	cuts?: number[]; //TODO: УЗНАТЬ ПРО ДАННЫЕ ЧТО ТУТ БУДУТ
	icon?: string;
	id?: number;
	name?: number;
	name_map?: null;
	polygon?: [number, number][];
	raion_id?: string;
	values?: IValues[];
}

export interface IUserMap {
	map: string;
}

export interface IViewSettings {
	isViewFilters: boolean;
	isViewObjects: boolean;
	isSettingsMap: boolean;
	isObjectInfo: boolean;
	isLoading: boolean;
	isLoadingObject: boolean;
	isDisplay: boolean;
}

export interface IDataMap {
	title: string;
	'all-points': number;
	clastering: number;
	canvas_map: string;
	icons_ref: string;
	color_ref: string;
	icons: {
		[key: string]: string;
	};
	colors: {
		[key: string]: string;
	};
	icon_sizes: { [key: string]: string[] };
	points: IMarker[];
}

export interface IMarker {
	crd: [number, number];
	id: number;
	icon: string;
	color: string;
	raion_id: string;
	polygon: number[][] | any;
	name: string;
	name_map: null | any;
}

export interface IDataObjectsInMap {
	points: IDataMap | any;
	centerMapObject: [number, number];
}
