'use client';

import L, { Canvas } from 'leaflet';
import { FC, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import { ICanvasMarkersLayer } from '@/types/props.types';
import { IDataObjectInfo } from '@/types/slice.types';

import { actions as dataObjectInfoAction } from '@/store/data-object-info/dataObjectInfo.slice';
import { RootState } from '@/store/store';
import { actions as viewSettingsAction } from '@/store/view-settings/viewSettings.slice';

import { ARGBtoHEX } from '@/utils/convertColor';
import { getIconForMarker } from '@/utils/iconForMarker';

import { $axios } from '@/api/api';

const CanvasMarkersLayer: FC<ICanvasMarkersLayer> = ({
	markersData,
	isMobile,
}) => {
	const dataObjectInfo: IDataObjectInfo = useSelector(
		(state: RootState) => state.dataObjectInfo,
	);
	const map = useMap();
	const dispatch = useDispatch();
	const markersRef = useRef([]);
	const polygonsRef = useRef<L.Polygon<any>[]>([]);
	const iconsRef = useRef<L.Marker<any>[]>([]);
	const bounds = map.getBounds(); //HELP: ФУНКЦИЯ ПОЛУЧЕНИЯ КООРДИНАТ В ОБЛАСТИ ВИДИМОСТИ
	const canvasLayerRef = useRef<Canvas | null>(null);
	const targetMarker = useRef<L.Marker<any> | null>(null);

	const getInfoObject = (marker: IDataObjectInfo) => async () => {
		//HELP: ЗАПРОС НА ПОЛУЧЕНИЕ ИНФОРМАЦИИ ОБ ОБЪЕКТЕ
		if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));

		dispatch(viewSettingsAction.toggleObjectInfo(''));

		try {
			dispatch(viewSettingsAction.activeLoadingObject(''));

			const response = await $axios.get(`/api/object_info.php?id=${marker.id}`);
			console.log(response);

			dispatch(dataObjectInfoAction.addObjectInfo(response.data));
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(viewSettingsAction.defaultLoadingObject(''));
		}
	};

	useEffect(() => {
		if (canvasLayerRef.current) {
			//HELP: УДАЛЕНИЕ ПРЕДЫДУЩЕГО СЛОЯ КАНВАСА, ЧТОБЫ НЕ ЗАБИВАТЬ DOM ДЕРЕВО СЛОЯМИ ПРИ ЗУМАХ
			map.removeLayer(canvasLayerRef.current);
		}

		markersRef.current.forEach(marker => map.removeLayer(marker)); //HELP: ОЧИСТКА МАССИВОВ В МАРКЕРАМИ ПОЛИГОНОВ КРУЖКОВ И ИКОНОК
		markersRef.current = [];
		polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
		polygonsRef.current = [];
		iconsRef.current.forEach(icon => map.removeLayer(icon));
		iconsRef.current = [];

		canvasLayerRef.current = L.canvas({ padding: 0.5 }); //HELP: СОЗДАНИЕ СЛОЯ И ДОБАВЛЕНИЕ НА КАРТУ
		canvasLayerRef.current.addTo(map);

		const zoomLevels = map.getZoom(); //HELP: ПОЛУЧЕНИЕ УРОВНЯ ЗУМА

		if (zoomLevels >= 13) {
			//HELP: ТОЧЕЧНАЯ ОЧИСТКА ПРИ РАЗНЫХ ЗУМАХ. НЕСМОТРЯ НА ОЧИСТКУ ВЫШЕ, ОНА НУЖНА И ЗДЕСЬ
			markersRef.current.forEach(marker => map.removeLayer(marker));
			markersRef.current = [];
		} else if (zoomLevels >= 13 && zoomLevels < 16) {
			iconsRef.current.forEach(icon => map.removeLayer(icon));
			iconsRef.current = [];
		} else {
			polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
			polygonsRef.current = [];
		}

		for (let marker of markersData) {
			let mapObject;

			if (zoomLevels >= 16 && marker.polygon && marker.polygon.length > 0) {
				mapObject = new L.Polygon(marker.polygon, {
					color:
						dataObjectInfo.id === marker.id
							? 'black'
							: ARGBtoHEX(marker.color ? marker.color : '000'),
					weight: dataObjectInfo.id === marker.id ? 6 : 3,
				}).addTo(map);

				mapObject.on('click', getInfoObject(marker));
				mapObject.bindPopup(marker.name ? marker.name.toString() : 'No Name');
				polygonsRef.current.push(mapObject);
			}
		}

		for (let marker of markersData) {
			//HELP: ОТРИСОВКА КРУЖКОВ
			let mapObject;
			const zoomLevelsForCircle = map.getZoom(); //HELP: ОТДЕЛЬНО ПОЛУЧАЕМ УРОВЕНЬ ЗУМА, ПОТОМУ ЧТО НЕКОРРЕКТНО ОТОБРАЖАЕТ ЕСЛИ ИСПОЛЬЗОВАТЬ ОБЩИЙ ЗУМ, ОБЪЯВЛЕННЫЙ ВЫШЕ

			if (zoomLevelsForCircle <= 13) {
				mapObject = new L.CircleMarker(marker.crd ? marker.crd : [0, 0], {
					renderer: canvasLayerRef.current,
					radius: 5,
					color:
						dataObjectInfo.id === marker.id
							? 'black'
							: ARGBtoHEX(marker.color ? marker.color : '000'),
				}).addTo(map);

				mapObject.on('click', getInfoObject(marker));
				mapObject.bindPopup(marker.name ? marker.name.toString() : 'No Name');
			}

			if (dataObjectInfo.id === marker.id && zoomLevelsForCircle < 16) {
				const targetIcon = L.icon({
					iconUrl: '../images/icons/target.svg',
					iconSize: [60, 58],
					iconAnchor: [22, 21],
				});

				let targetMapObject = L.marker(marker.crd ? marker.crd : [0, 0], {
					icon: targetIcon,
				}).addTo(map);
				iconsRef.current.push(targetMapObject);

				if (targetMarker.current) {
					map.removeLayer(targetMarker.current);
					targetMarker.current = null;
				} else {
					targetMarker.current = targetMapObject;
				}
			}
		}

		function handleMoveEndZoomEnd() {
			let bounds = map.getBounds();
			const zoomLevelForIcon = map.getZoom();

			for (let marker of markersData) {
				if (
					(zoomLevelForIcon > 13 &&
						zoomLevelForIcon < 16 &&
						bounds.contains(marker.crd ? marker.crd : [0, 0])) ||
					(zoomLevelForIcon > 15 && //HELP: СТАВЛЮ 15 ХОТЯ СРАБАТЫВАЕТ НА 16. СКОРЕЕ ВСЕГО ПОТОМУ ЧТО НЕПРАВИЛЬНО ОТРАБАТЫВАЕТ УРОВЕНЬ ЗУМА, ПОЭТОМУ ДЛЯ ПРАВИЛЬНОЙ РАБОТЫ МЕНЯЮ НА 15.
						(!marker.polygon || marker.polygon.length === 0) &&
						bounds.contains(marker.crd ? marker.crd : [0, 0]))
				) {
					let svg = getIconForMarker(marker); //HELP: ПОЛУЧАЕМ МАРКЕР
					let encodedSvg = encodeURIComponent(svg); //HELP: КОНВЕРТИРУЕМ В ССЫЛКУ
					let dataUrl = 'data:image/svg+xml,' + encodedSvg; //HELP: ДОБАВЛЯЕМ К НЕМУ DATA И ТЕПЕРЬ ЭТО ССЫЛКА НА КАРТИНКУ

					const icon = L.icon({
						//HELP: СОЗДАЕМ ИКОНКУ
						iconUrl: dataUrl,
						iconSize: [20, 18],
						iconAnchor: [10, 9],
					});

					let mapObject = L.marker(marker.crd ? marker.crd : [0, 0], {
						icon: icon,
					}).addTo(map);
					iconsRef.current.push(mapObject);

					if (dataObjectInfo.id === marker.id) {
						const targetIcon = L.icon({
							iconUrl: '../images/icons/target.svg',
							iconSize: [60, 58],
							iconAnchor: [22, 21],
						});

						let targetMapObject = L.marker(marker.crd ? marker.crd : [0, 0], {
							icon: targetIcon,
						}).addTo(map);
						iconsRef.current.push(targetMapObject);

						if (targetMarker.current) {
							map.removeLayer(targetMarker.current);
							targetMarker.current = null;
						} else {
							targetMarker.current = targetMapObject;
						}
					}

					mapObject.on('click', getInfoObject(marker));
					mapObject.bindPopup(marker.name ? marker.name.toString() : 'No Name');
				}
			}
			setTimeout(() => {
				map.invalidateSize();
			}, 2000);
		}

		map.on('moveend zoomend', handleMoveEndZoomEnd);

		function updateMarkers() {
			//HELP: функция смещает координаты с центра, чтобы имитировать движение по карте. Это решает проблему, в которой при подгрузке данных или зуме, не отображался новый холст пока не передвинешь карту мышкой
			const timeoutId = setTimeout(() => {
				//HELP: ТАЙМАУТ УБИРАЕТ БАГ "ПЕРВОГО КЛИКА" ПО НЕКОТОРЫМ ОБЪЕКТАМ
				var center = map.getCenter();
				map.panTo(center);
			}, 500);
			return () => clearTimeout(timeoutId);
		}
		updateMarkers();

		return () => {
			//HELP: Удаление обработчика событий при очистке эффекта
			map.off('moveend zoomend', handleMoveEndZoomEnd);
		};
	}, [map, markersData, bounds, dataObjectInfo]);
	return null;
};

export default CanvasMarkersLayer;
