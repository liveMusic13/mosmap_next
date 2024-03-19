'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useSelector } from 'react-redux';

import { IDataObjectsInMap } from '@/types/slice.types';

import { RootState } from '@/store/store';

import useWindowDimensions from '@/hooks/useWindowDimensions';

import CanvasMarkersLayer from './CanvasMarkersLayer';
import FlyToLocation from './FlyToLocation';
import RenderMarkers from './RenderMarkers';
import ZoomTracker from './ZoomTracker';

// const DynamicMapContainer = dynamic(
// 	() => import('react-leaflet').then(mod => mod.MapContainer),
// 	{ ssr: false },
// );

export function CustomMap() {
	const dataObjectsInMap: IDataObjectsInMap = useSelector(
		(state: RootState) => state.dataObjectsInMap,
	);
	const { width } = useWindowDimensions();
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [isInitialized, setIsInitialized] = useState<boolean>(false); //HELP: ДЛЯ ОТСЛЕЖИВАНИЯ ИНИЦИАЛИЗАЦИИ, ЧТОБЫ ПРИ ПЕРВОМ ЗАПУСКЕ ЗУМ НА 17 НЕ СТАВИЛСЯ
	const [center, setCenter] = useState<[number, number]>([55.7522, 37.6156]); // Значения по умолчанию

	useEffect(() => {
		if (width) {
			if (width <= 767.98) {
				setIsMobile(true);
			}
		}
	}, [width]);

	const [zoomLevel, setZoomLevel] = useState<number>(13);

	useEffect(() => {
		if (
			Array.isArray(dataObjectsInMap.centerMapObject) &&
			dataObjectsInMap.centerMapObject.length === 2
		) {
			setCenter(dataObjectsInMap.centerMapObject as [number, number]);
		}
	}, [dataObjectsInMap.centerMapObject]); //HELP: ПРОВЕРКА, ЧТОБЫ НЕ РУГАЛСЯ TYPESCRIPT

	console.log('загрузился');
	return (
		<MapContainer
			center={center}
			zoom={13}
			minZoom={10}
			maxZoom={17}
			style={{ width: '100%', height: '98%' }}
			maxBounds={[
				[56.934709, 35.189603], //HELP: Северо-западные координаты
				[54.294416, 40.128181], //HELP: Юго-восточные координаты
			]}
		>
			<TileLayer url='https://www.moscowmap.ru/leaflet/tiles/{z}/{x}/{y}.png' />
			<ZoomTracker setZoomLevel={setZoomLevel} />
			{dataObjectsInMap.points.canvas_map === 0 ? (
				dataObjectsInMap.points.clastering === 0 ? (
					<RenderMarkers isMobile={isMobile} zoomLevel={zoomLevel} />
				) : (
					<MarkerClusterGroup chunkedLoading={true}>
						<RenderMarkers isMobile={isMobile} zoomLevel={zoomLevel} />
					</MarkerClusterGroup>
				)
			) : (
				<CanvasMarkersLayer
					isMobile={isMobile}
					markersData={dataObjectsInMap.points.points}
				/>
			)}
			<FlyToLocation
				centerMapObject={dataObjectsInMap.centerMapObject}
				isInitialized={isInitialized} //HELP: ДЛЯ ОТСЛЕЖИВАНИЯ ИНИЦИАЛИЗАЦИИ, ЧТОБЫ ПРИ ПЕРВОМ ЗАПУСКЕ ЗУМ НА 17 НЕ СТАВИЛСЯ
				setIsInitialized={setIsInitialized}
			/>
		</MapContainer>
	);
}
