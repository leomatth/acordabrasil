/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.camara.leg.br",
			},
			{
				protocol: "https",
				hostname: "www.senado.leg.br",
			},
			{
				protocol: "https",
				hostname: "www3.al.sp.gov.br",
			},
			{
				protocol: "https",
				hostname: "upload.wikimedia.org",
			},
		],
	},
};

export default nextConfig;
