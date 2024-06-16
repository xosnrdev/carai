
/**
 * @type {import('next').NextConfig}
 */
export const nextConfig = {
	poweredByHeader: false,
	output: 'standalone',
}

export async function rewrites() {
	return [
		{
			source: '/api/:path*',
			destination: 'https://cexaengine.com/api/:path*',
		},
	]
}

