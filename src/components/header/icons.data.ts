import { IIconsData } from '@/types/iconsData.types';

export const arrayNumIcons: IIconsData[] = [
	{
		id: 1,
		src: '/images/svg/sprite.svg#home-search-outline',
		hover_text: 'Поиск адреса',
	},
	{
		id: 2,
		src: '/images/svg/sprite.svg#selection-search',
		hover_text: 'Выделить область',
	},
	{
		id: 3,
		src: '/images/svg/sprite.svg#map-legend',
		hover_text: 'Легенда',
	},
	{
		id: 4,
		src: '/images/svg/sprite.svg#map-marker-distance',
		hover_text: 'Построить маршрут',
	},
	{
		id: 5,
		src: '/images/svg/sprite.svg#palete-outline',
		hover_text: 'Закрасить районы',
	},
];

export const arrayNumSettingIcons: IIconsData[] = [
	{
		id: 6,
		src: '/images/svg/sprite.svg#filter-off',
		src_active: '/images/svg/sprite.svg#filter',
		hover_text: 'Показать/скрыть фильтры',
	},
	{
		id: 7,
		src: '/images/svg/sprite.svg#clipboard-text-off',
		src_active: '/images/svg/sprite.svg#clipboard-text',
		hover_text: 'Показать/скрыть список',
	},
	{
		id: 8,
		src: '/images/svg/sprite.svg#logout',
		hover_text: 'Выйти',
	},
];
