import { Navbar } from '@words/components/Navbar';
import { NextPage } from 'next';

const languages = [
	'English',
	'Korean',
	'Spanish',
	'French',
	'German',
	'Japanese',
	'Chinese',
	'Vietnamese',
	'Italian',
	'Portuguese',
	'Russian',
	'Arabic',
];

const LanguagesPage: NextPage = () => {
	return (
		<div className="bg-base-200 flex min-h-screen flex-col">
			<Navbar />
			<div className="px-6 py-16">
				<div className="container mx-auto text-center">
					<h1 className="mb-8 text-4xl font-bold">Supported Languages</h1>
					<p className="mb-12 text-gray-600">
						Learn and explore words in multiple languages. Select a language to
						get started.
					</p>

					<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
						{languages.map((lang) => (
							<div
								key={lang}
								className="card bg-base-100 flex cursor-pointer items-center justify-center p-4 shadow-lg transition hover:shadow-xl">
								<div className="card-body">
									<p className="text-lg font-semibold">{lang}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LanguagesPage;
