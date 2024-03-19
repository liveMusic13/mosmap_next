import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IInput } from '@/types/props.types';

import { actions as adresFilterStringAction } from '@/store/adres-filter-string/adresFilterString.slice';
import { RootState } from '@/store/store';

import styles from './Input.module.scss';

const Input: FC<IInput> = ({ placeholder, name, clearFilter }) => {
	const { map } = useSelector((state: RootState) => state.userMap);
	const [test, setTest] = useState<string>('');
	const [isInputValid, setIsInputValid] = useState<boolean>(true);
	const dispatch = useDispatch();
	// const navigate = useNavigate();
	// const { search } = useLocation();
	// const [searchParams, setSearchParams] = useSearchParams();

	// const updateURL = debounce((name, value) => {
	// 	setSearchParams(prevPar => {
	// 		if (value === '') {
	// 			prevPar.delete(name);
	// 		} else {
	// 			prevPar.set(name, value);
	// 		}
	// 	});
	// 	navigate('?' + searchParams.toString());
	// }, 500); //HELP: 500 миллисекунд задержки
	const router = useRouter();
	// const searchParams = useSearchParams()

	const searchParams = new URLSearchParams(window.location.search);

	const updateURL = debounce((name, value) => {
		// const searchParams = new URLSearchParams(window.location.search);

		if (value === '') {
			searchParams.delete(name);
		} else {
			searchParams.set(name, value);
		}

		router.push('?' + searchParams.toString());
	}, 500);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const isValidNumber = /^\d*$/.test(value);
		if (isValidNumber) {
			setTest(value);
			setIsInputValid(true);
			updateURL(name, value);
		} else {
			setIsInputValid(false);
		}
	};
	//TODO: ПРОВЕРИТЬ РАБОТАЕТ ЛИ МОЙ ПОДХОД С window.location.search ВМЕСТО USELOCATION
	useEffect(() => {
		dispatch(adresFilterStringAction.addGetParams(window.location.search));
	}, [searchParams]); //HELP: ВМЕСТО ОТСЛЕЖИВАНИЯ window.location.search Я ОТСЛЕЖИВАЮ searchParams ЧТОБЫ ПРИ КАЖДОМ ОБНОВЛЕНИИ ПАРАМЕТРОВ ДОБАВЛЯТЬ ИХ В СТЕЙТ РЕДАКСА И ТЕМ САМЫМ УСТРАНИТЬ БАГ, ГДЕ ПРИ ПЕРВОМ НАЖАТИИ НА ПОИСК В ФИЛЬТРАХ, УХОДИЛ ПУСТОЙ ЗАПРОС С ПРЕДЫДУЩЕМ ЗНАЧЕНИЕМ, Т.К. БЕЗ USELOCATION НЕ ОБНОВЛЯЛО НОРМАЛЬНО А АНАЛОГА В NEXT Я ТАК И НЕ НАШЕЛ

	useEffect(() => {
		// const searchParams = new URLSearchParams(window.location.search);

		if (clearFilter) {
			setTest('');
			// searchParams.set('map', `${userMap.map}`);
			// window.location.href = window.location.pathname;
			let paramsToDelete = [];

			for (let param of searchParams.keys()) {
				if (param !== 'map') {
					paramsToDelete.push(param);
				}
			}

			paramsToDelete.forEach(param => {
				searchParams.delete(param);
			});
			window.history.replaceState(
				{},
				document.title,
				window.location.pathname + '?' + searchParams.toString(),
			);
			// window.history.replaceState({}, document.title, window.location.pathname); //TODO: С ЭТИМ ВАРИАНТОМ ВСЕ УДАЛЯЕТСЯ И ДЕЛАЕТСЯ ЗАПРОС С НУЛЕВЫМИ ДАННЫМИ
			dispatch(adresFilterStringAction.clearGetParams(''));
		}
	}, [clearFilter]);

	useEffect(() => {
		// const searchParams = new URLSearchParams(window.location.search);
		const paramValue = searchParams.get(name);

		if (paramValue !== null) {
			setTest(paramValue);
		}
	}, []);

	return (
		<div className={styles.wrapper_input}>
			<input
				className={styles.input}
				placeholder={placeholder}
				type='text'
				value={test}
				onChange={onChange}
				style={
					name === 'fix_bag_247'
						? { width: '0px', height: '0px', margin: '0px' }
						: test !== ''
							? { borderBottom: '1px solid #26a69a' }
							: {}
				}
			/>
			{!isInputValid && (
				<p style={{ color: 'red' }} className={styles.error}>
					Пожалуйста, введите только цифры.
				</p>
			)}
		</div>
	);
};

export default Input;
