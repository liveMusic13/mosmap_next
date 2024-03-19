'use client';

import { FC, createRef, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/ui/button/Button';
import { Loading } from '@/components/ui/loading/Loading';

import { IAllObjects } from '@/types/props.types';
import { IDataObjectInfo, IMarker } from '@/types/slice.types';

import { actions as dataObjectInfoAction } from '@/store/data-object-info/dataObjectInfo.slice';
import { RootState } from '@/store/store';
import { actions as viewSettingsAction } from '@/store/view-settings/viewSettings.slice';

import { useSearchObjectInMap } from '@/hooks/useSearchObjectInMap';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import { $axios } from '@/api/api';

import styles from './AllObjects.module.scss';

export const AllObjects: FC<IAllObjects> = ({ isDisplay }) => {
	const dataObjectsInMap = useSelector(
		(state: RootState) => state.dataObjectsInMap,
	);
	const dataObjectInfo: IDataObjectInfo = useSelector(
		(state: RootState) => state.dataObjectInfo,
	);
	const viewSettings = useSelector((state: RootState) => state.viewSettings);
	const { newCenter } = useSearchObjectInMap();
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const dispatch = useDispatch();
	const { width } = useWindowDimensions();

	useEffect(() => {
		if (width && width <= 767.98) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	}, [width]);

	const getInfoObject = (marker: IMarker) => async () => {
		//HELP: ЗАПРОС НА ПОЛУЧЕНИЕ ИНФОРМАЦИИ ОБ ОБЪЕКТЕ
		if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));
		if (isMobile) dispatch(viewSettingsAction.defaultObjects(''));
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

	const objects = dataObjectsInMap?.points?.points;

	const targetObject = useMemo(
		() => objects.find((elem: IMarker) => elem.id === dataObjectInfo.id),
		[objects, dataObjectInfo.id],
	);

	const objectRefs = useRef(objects.map(() => createRef()));
	const containerRef = useRef<null | HTMLDivElement>(null); // ссылка на контейнер

	useEffect(() => {
		if (targetObject) {
			// Находим индекс целевого объекта
			const targetIndex = objects.findIndex(
				(obj: IMarker) => obj.id === targetObject.id,
			);

			// Получаем ссылки на элемент и контейнер
			const element = objectRefs.current[targetIndex].current;
			const container: any = containerRef.current;

			// Вычисляем необходимые значения
			let offsetTop = element.offsetTop; // вертикальное расстояние от элемента до верхней границы контейнера
			let middleOffset = container.offsetHeight / 2; // половина высоты контейнера

			// Прокручиваем к целевому объекту
			container.scrollTop = offsetTop - middleOffset;
		}
	}, [targetObject, objects]);

	const mapIcon = {
		id: 0,
		src: '/images/svg/sprite.svg#target',
		hover_text: 'Показать на карте',
	};

	let style: any = {};

	if (!(viewSettings.isObjectInfo || viewSettings.isViewFilters)) {
		style.left = '0';
	}

	// if (isDisplay && !isMobile) {
	// 	style.display = 'none';
	// } else {
	// 	style.display = 'block';
	// }
	console.log('style', isDisplay, isMobile);
	return (
		<div className={styles.block__allObjects} style={style}>
			<div className={styles.block__title}>
				<div className={styles.allObjects}>
					<p className={styles.description}>Всего объектов в списке:</p>
					<p className={styles.value}>
						{dataObjectsInMap.points['all-points']
							? dataObjectsInMap.points['all-points']
							: '0'}
					</p>
				</div>
				<div className={styles.allObjects__inMap}>
					<p className={styles.description}>Всего объектов на карте:</p>
					<p className={styles.value}>
						{dataObjectsInMap.points.points
							? dataObjectsInMap.points.points.filter((object: IMarker) =>
									Array.isArray(object.crd),
								).length
							: '0'}
					</p>
				</div>
			</div>
			<div className={styles.block__objects} ref={containerRef}>
				{viewSettings.isLoading ? (
					<>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
					</>
				) : (
					objects.map((elem: IMarker, index: number) => {
						return (
							<div
								ref={objectRefs.current[index]}
								key={elem.id}
								className={styles.object}
								style={
									dataObjectInfo.id === elem.id
										? { backgroundColor: '#e0e0e0' }
										: {}
								}
								onClick={getInfoObject(elem)}
							>
								<p>{elem.name}</p>
								<Button icon={mapIcon} newCenter={newCenter} elem={elem} />
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};
