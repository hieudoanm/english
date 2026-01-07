import Link from 'next/link';
import { FC } from 'react';

export const Navbar: FC = () => {
	return (
		<div className="navbar bg-base-200 px-8 shadow-md">
			<div className="container mx-auto flex justify-between px-8 md:px-0">
				<Link href="/" className="btn btn-ghost text-xl normal-case">
					Words
				</Link>
				<div className="flex items-center gap-4">
					<Link href="/cards" className="text-sm">
						Cards
					</Link>
					<Link href="/dictionary" className="text-sm">
						Dictionary
					</Link>
				</div>
			</div>
		</div>
	);
};
