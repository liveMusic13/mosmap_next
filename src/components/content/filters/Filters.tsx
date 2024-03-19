import dynamic from 'next/dynamic';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BlockInput from '@/components/ui/block-input/BlockInput';
import CustomSelect from '@/components/ui/custom-select/CustomSelect';

import { IAllObjects } from '@/types/props.types';
import { IDataFilters } from '@/types/slice.types';

import { actions as dataObjectsInMapAction } from '@/store/data-objects-in-map/dataObjectsInMap.slice';
import { RootState } from '@/store/store';
import { actions as viewSettingsActions } from '@/store/view-settings/viewSettings.slice';

import useWindowDimensions from '@/hooks/useWindowDimensions';

import { $axios } from '@/api/api';

import styles from './Filters.module.scss';

const DynamicInput = dynamic(
	() => import('../../ui/input/Input').then(mod => mod.default),
	{ ssr: false },
);

const Filters: FC<IAllObjects> = ({ isDisplay, isMobile }) => {
	const dispatch = useDispatch();
	const dataFilters: IDataFilters[] = useSelector(
		(state: RootState) => state.dataFilters,
	);
	const adresFilterString = useSelector(
		(state: RootState) => state.adresFilterString,
	);
	const { map } = useSelector((state: RootState) => state.userMap);
	const [clearFilter, setClearFilter] = useState<boolean>(false);

	const { width } = useWindowDimensions();

	const getFiltersObject = async () => {
		try {
			dispatch(viewSettingsActions.activeLoading(''));
			if (adresFilterString.srcRequest === '') {
				const response = await $axios.get(`/api/get_objects.php?map=${map}`);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
			} else {
				const response = await $axios.get(
					`/api/get_objects.php${adresFilterString.srcRequest}`,
				);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
			}
			if (width && width <= 767.98) {
				dispatch(viewSettingsActions.toggleSettingsMap(''));
				dispatch(viewSettingsActions.defaultFilters(''));
			}
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(viewSettingsActions.defaultLoading(''));
		}
	};

	return (
		<div
			className={styles.block__filters}
			// style={
			// 	isMobile && !isDisplay ? { display: 'block' } : { display: 'none' }
			// }
		>
			<h2 className={styles.title}>Фильтры</h2>
			<div className={styles.wrapper_block__filters}>
				{dataFilters?.map((field: IDataFilters) => {
					if (field.type === 'number') {
						return (
							<BlockInput
								key={field.id}
								title={field.caption}
								id={field.id}
								clearFilter={clearFilter}
							/>
						);
					} else {
						return (
							<CustomSelect
								key={field.id}
								isMultiChoice={field.multiple === 1 ? true : false}
								title={field.caption}
								isImage={field.multiple === 1 ? true : false}
								dataSelect={field}
								clearFilter={clearFilter}
							/>
						);
					}
				})}
				<DynamicInput
					placeholder='От'
					name={`fix_bag_247`}
					clearFilter={clearFilter}
				/>
				<div className={styles.block__buttons}>
					<button
						className={styles.button_clear}
						onClick={() => {
							setClearFilter(true);
							console.log('clear test');
							const timeoutId = setTimeout(() => {
								setClearFilter(false);
							}, 1000);
							return () => clearTimeout(timeoutId);
						}}
					>
						очистить
					</button>
					<button className={styles.button} onClick={getFiltersObject}>
						показать
					</button>
				</div>
			</div>
		</div>
	);
};

export default Filters;
