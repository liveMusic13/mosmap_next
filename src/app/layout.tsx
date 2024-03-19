import type { Metadata } from 'next';

import { Header } from '@/components/header/Header';

import { ReduxStore } from '@/providers/ReduxStore';

import '../styles/global.scss';

export const metadata: Metadata = {
	title: 'Mosmap',
	description: 'Map in Moscow',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>
				<ReduxStore>
					<Header />
					{children}
				</ReduxStore>
			</body>
		</html>
	);
}
