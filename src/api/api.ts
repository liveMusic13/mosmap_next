import axios from 'axios';

const API_URL = 'https://app.mosmap.ru';

export const $axios = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});
