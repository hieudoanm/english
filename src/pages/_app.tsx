import '@words/styles/globals.css';
import type { AppProps } from 'next/app';
import { FC } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import Head from 'next/head';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<title>Words</title>
			</Head>
			<div className={`${geistSans.className} ${geistMono.className}`}>
				<Component {...pageProps} />
			</div>
		</>
	);
};

export default App;
