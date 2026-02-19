import { logger } from '@english/utils/log';
import { tryCatch } from '@english/utils/try-catch';
import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import Link from 'next/link';
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

const HomePage: NextPage = () => {
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

	const { results } = data ?? { results: [] };
	const partsOfSpeech = [
		...new Set(results.map((result) => result.partOfSpeech)),
	];

	const resultsByPartsOfSpeech = partsOfSpeech.map((partOfSpeech) => ({
		partOfSpeech,
		results: results.filter((result) => result.partOfSpeech === partOfSpeech),
	}));

	return (
		<div className="bg-base-200 divide-base-100 flex h-screen flex-col divide-y">
			<div className="navbar px-4 py-2 md:px-8 md:py-4">
				<div className="container mx-auto flex items-center justify-between gap-x-4 md:gap-x-8">
					<Link href="/" className="text-lg normal-case md:text-xl">
						English
					</Link>
					<div className="grow">
						<input
							id="word"
							name="word"
							placeholder="Type a word..."
							className="input w-full"
							value={word}
							onChange={(event: ChangeEvent<HTMLInputElement>) =>
								setState((prev) => ({ ...prev, word: event.target.value }))
							}
						/>
					</div>
				</div>
			</div>
			<div className="grow overflow-auto p-4 md:p-8">
				<div className="container mx-auto">
					<div className="flex flex-col gap-8">
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

								{resultsByPartsOfSpeech.map(({ partOfSpeech, results }) => (
									<div
										key={partOfSpeech}
										className="card bg-base-100 border-base-300 border p-4 shadow-2xl">
										<div className="card-body flex flex-col gap-y-4">
											<h2 className="card-title text-sm capitalize">
												{partOfSpeech}
											</h2>

											{results.map(
												(
													{
														partOfSpeech,
														definition,
														synonyms = [],
														anonyms = [],
													},
													index,
												) => (
													<div key={`${partOfSpeech}-${index}`}>
														<p className="indent-4 md:indent-8">
															<span className="text-sm font-black">
																Definition:
															</span>{' '}
															{definition}
														</p>

														{synonyms.length > 0 && (
															<div className="flex items-center gap-x-2 pl-4 md:pl-8">
																<span className="font-semibold">Synonyms:</span>
																{synonyms.map((synonym) => (
																	<button
																		key={synonym}
																		className="badge badge-sm badge-primary mt-1 mr-2 cursor-pointer"
																		onClick={() =>
																			setState((prev) => ({
																				...prev,
																				word: synonym,
																			}))
																		}>
																		{synonym}
																	</button>
																))}
															</div>
														)}

														{anonyms.length > 0 && (
															<div className="flex items-center gap-x-2 pl-4 md:pl-8">
																<span className="font-semibold">Antonyms:</span>{' '}
																{anonyms.map((anonym) => (
																	<button
																		key={anonym}
																		className="badge badge-sm badge-primary mt-1 mr-2 cursor-pointer"
																		onClick={() =>
																			setState((prev) => ({
																				...prev,
																				word: anonym,
																			}))
																		}>
																		{anonym}
																	</button>
																))}
															</div>
														)}
													</div>
												),
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
