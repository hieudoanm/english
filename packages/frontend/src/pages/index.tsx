import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';

const HomePage: NextPage = () => {
	const [{ word }, setState] = useState<{ word: string }>({ word: 'example' });

	const { isFetching, isPending, data, error } = useQuery<{
		word: string;
		results: {
			definition: string;
			partOfSpeech: string;
			synonyms: string[];
			anonyms: string[];
			usageOf: string[];
			typeOf: string[];
		}[];
	}>({
		queryKey: [`word`, word],
		queryFn: async () => {
			const url: string = `https://raw.githubusercontent.com/hieudoanm/words/refs/heads/master/packages/data/english/words/${encodeURI(word)}.json`;
			const response = await fetch(url);
			return await response.json();
		},
	});

	return (
		<div className="container mx-auto p-8">
			<div className="flex w-full flex-col gap-y-8">
				<input
					id="word"
					name="word"
					placeholder="Word"
					className="input w-full"
					value={word}
					onChange={(event: ChangeEvent<HTMLInputElement>) => {
						setState((previous) => ({ ...previous, word: event.target.value }));
					}}
				/>
				{(isPending || isFetching) && (
					<div className="text-center">Loading...</div>
				)}
				{error && <div className="text-center">{error.message}</div>}
				{!data && !isFetching && !error && (
					<div className="text-center">No data found</div>
				)}
				{data && !isFetching && !error && (
					<div className="flex flex-col gap-y-4">
						<h1 className="text-4xl">{data.word}</h1>

						{data.results.map(
							(
								{ partOfSpeech, definition, synonyms = [], anonyms = [] },
								index,
							) => {
								return (
									<>
										<div key={`${partOfSpeech}-${index}`}>
											<h2 className="font-semibold">{partOfSpeech}</h2>
											<p>Definition: {definition}</p>
											{synonyms.length > 0 && (
												<p>
													<small>Synonyms</small>:{' '}
													{synonyms.map((synonym) => (
														<span
															key={synonym}
															className="mr-2 inline-block underline decoration-dotted">
															{synonym}
														</span>
													))}
												</p>
											)}
											{anonyms.length > 0 && (
												<p>
													<small>Anonyms</small>:{' '}
													{anonyms.map((anonym) => (
														<span
															key={anonym}
															className="mr-2 inline-block underline decoration-dotted">
															{anonym}
														</span>
													))}
												</p>
											)}
										</div>
										<hr />
									</>
								);
							},
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
