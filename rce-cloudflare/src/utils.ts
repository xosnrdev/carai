export { errorResponse, getAccessToken };

function errorResponse(status: number, message: string): Response {
	return new Response(JSON.stringify({ message }), {
		status,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

function getAccessToken(request: Request): string {
	return request.headers.get('X-Access-Token') ?? '';
}
