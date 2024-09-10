import { errorResponse, getAccessToken } from './utils';

interface Env {
	BASE_URL: string;
}

export default {
	async fetch(request, env: Env): Promise<Response> {
		if (request.method !== 'POST') {
			return errorResponse(405, 'Method Not Allowed');
		}

		const accessToken = getAccessToken(request);
		if (!accessToken) {
			return errorResponse(401, 'Unauthorized');
		}

		const requestBody = request.clone().body;

		return fetch(`${env.BASE_URL}/run`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Access-Token': accessToken,
			},
			body: requestBody,
		});
	},
} satisfies ExportedHandler<Env>;
