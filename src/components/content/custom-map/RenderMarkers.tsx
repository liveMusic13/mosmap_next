'use client';

import L, { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FC, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Polygon, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import IconMarker from '@/components/ui/icon-marker/IconMarker';

import { IRenderMarkers } from '@/types/props.types';
import { IDataObjectInfo, IDataObjectsInMap } from '@/types/slice.types';

import { actions as dataObjectInfoAction } from '@/store/data-object-info/dataObjectInfo.slice';
import { RootState } from '@/store/store';
import { actions as viewSettingsAction } from '@/store/view-settings/viewSettings.slice';

import { ARGBtoHEX } from '@/utils/convertColor';

import { $axios } from '@/api/api';

const RenderMarkers: FC<IRenderMarkers> = ({ isMobile, zoomLevel }) => {
	const dispatch = useDispatch();
	const dataObjectsInMap: IDataObjectsInMap = useSelector(
		(state: RootState) => state.dataObjectsInMap,
	);
	const dataObjectInfo: IDataObjectInfo = useSelector(
		(state: RootState) => state.dataObjectInfo,
	);

	useEffect(() => {}, [dataObjectInfo.id]);

	return (
		<>
			{dataObjectsInMap?.points?.points?.map((object: IDataObjectInfo) => {
				if (object && object.crd) {
					const getObjectInfo = async () => {
						if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));
						dispatch(viewSettingsAction.toggleObjectInfo(''));

						try {
							dispatch(viewSettingsAction.activeLoadingObject(''));

							const responce = await $axios.get(
								`/api/object_info.php?id=${object.id}`,
							);

							dispatch(dataObjectInfoAction.addObjectInfo(responce.data));
						} catch (error) {
							console.log(error);
						} finally {
							dispatch(viewSettingsAction.defaultLoadingObject(''));
						}
					};

					let customMarkerIcon;

					if (zoomLevel >= 16 && object.polygon && object.polygon.length > 0) {
						//HELP: Если уровень зума 16 или больше и у объекта есть полигон, отображаем полигон
						return (
							<Polygon
								key={`${object.id}-${dataObjectInfo.id === object.id}`}
								positions={object.polygon}
								color={
									dataObjectInfo.id === object.id
										? 'black'
										: ARGBtoHEX(object.color ? object.color : '000')
								}
								eventHandlers={{ click: getObjectInfo }}
								weight={dataObjectInfo.id === object.id ? 6 : 3}
							>
								<Popup>{object.name}</Popup>
							</Polygon>
						);
					} else {
						//HELP: Иначе отображаем маркер
						if (dataObjectInfo.id === object.id) {
							customMarkerIcon = L.icon({
								iconUrl: '../images/icons/target.svg',
								iconSize: [53, 53],
								iconAnchor: [18.5, 19],
							});
						} else {
							customMarkerIcon = divIcon({
								className: 'my-custom-icon',
								iconSize: [23, 23],
								html: renderToStaticMarkup(
									<IconMarker key={object.id} object={object} />,
								),
							});
						}
					}

					return (
						<Marker
							key={object.id}
							position={object.crd}
							icon={customMarkerIcon}
							eventHandlers={{ click: getObjectInfo }}
						>
							<Popup>{object.name}</Popup>
						</Marker>
					);
				}
			})}
		</>
	);
};

export default RenderMarkers;
