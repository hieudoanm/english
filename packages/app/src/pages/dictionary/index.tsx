import { Navbar } from '@english/components/Navbar';
import { logger } from '@english/utils/log';
import { tryCatch } from '@english/utils/try-catch';
import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';

export type Word = {
	word: string;
	results: {
		definition: string;
		partOfSpeech: string;
		synonyms: string[];
		anonyms: string[];
		usageOf: string[];
		typeOf: string[];
	}[];
};

const DictionaryPage: NextPage = () => {
	const [{ word }, setState] = useState<{ word: string }>({ word: 'example' });

	const {
		isFetching = false,
		isPending = false,
		data = { word: '', results: [] },
		error = null,
	} = useQuery<Word>({
		queryKey: [word],
		queryFn: async () => {
			if (word === '') throw new Error('Empty Word');
			const wordQuery: string = encodeURI(word.trim().toLowerCase());
			const url: string = `https://raw.githubusercontent.com/hieudoanm/words/refs/heads/master/packages/data/english/words/${wordQuery}.json`;
			const { data: response, error: fetchError } = await tryCatch(fetch(url));
			if (fetchError) {
				logger.error(fetchError);
				throw new Error('Fetch Error');
			}
			const { data, error } = await tryCatch<Word>(response.json());
			if (error) {
				logger.error(error);
				throw new Error('JSON Error');
			}
			return data;
		},
	});

	return (
		<div className="bg-base-200 flex min-h-screen flex-col">
			<Navbar />
			<div className="container mx-auto p-8">
				<div className="flex flex-col gap-8">
					<input
						id="word"
						name="word"
						placeholder="Type a word..."
						className="input mx-auto w-full"
						value={word}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setState((prev) => ({ ...prev, word: event.target.value }))
						}
					/>

					{(isPending || isFetching) && (
						<div className="text-center text-lg font-medium">Loading...</div>
					)}

					{error && (
						<div className="alert alert-error text-center shadow-lg">
							<div>{error.message}</div>
						</div>
					)}

					{!data && !isFetching && !error && (
						<div className="text-center text-lg text-gray-500">
							No data found
						</div>
					)}

					{data && !isFetching && !error && (
						<div className="flex flex-col gap-6">
							<h1 className="text-center text-4xl font-bold">{data.word}</h1>

							{data.results.map(
								(
									{ partOfSpeech, definition, synonyms = [], anonyms = [] },
									index,
								) => (
									<div
										key={`${partOfSpeech}-${index}`}
										className="card bg-base-100 border-base-300 border p-4 shadow-2xl">
										<div className="card-body">
											<h2 className="card-title capitalize">{partOfSpeech}</h2>
											<p className="mt-2">
												<span className="font-semibold">Definition:</span>{' '}
												{definition}
											</p>

											{synonyms.length > 0 && (
												<p className="mt-2">
													<span className="font-semibold">Synonyms:</span>{' '}
													{synonyms.map((synonym) => (
														<span
															key={synonym}
															className="badge badge-primary mt-1 mr-2 cursor-pointer"
															onClick={() =>
																setState((prev) => ({ ...prev, word: synonym }))
															}>
															{synonym}
														</span>
													))}
												</p>
											)}

											{anonyms.length > 0 && (
												<p className="mt-2">
													<span className="font-semibold">Antonyms:</span>{' '}
													{anonyms.map((anonym) => (
														<span
															key={anonym}
															className="badge badge-outline badge-secondary mt-1 mr-2 cursor-pointer"
															onClick={() =>
																setState((prev) => ({ ...prev, word: anonym }))
															}>
															{anonym}
														</span>
													))}
												</p>
											)}
										</div>
									</div>
								),
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default DictionaryPage;
