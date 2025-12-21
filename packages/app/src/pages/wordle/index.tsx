import { NextPage } from 'next';
import { useState } from 'react';

const WORDS: string[] = ['apple', 'grape', 'melon', 'peach', 'berry']; // example words
const MAX_ATTEMPTS: number = 5;

const RANDOM_TARGET_WORD: string =
	WORDS[Math.floor(Math.random() * WORDS.length)];

type LetterState = 'correct' | 'present' | 'absent';
type Guess = { word: string; result: LetterState[] };

const WordlePage: NextPage = () => {
	const [targetWord, setTargetWord] = useState(RANDOM_TARGET_WORD);
	const [guesses, setGuesses] = useState<Guess[]>([]);
	const [currentGuess, setCurrentGuess] = useState('');
	const [message, setMessage] = useState('');

	const checkGuess = (guess: string) => {
		return guess.split('').map((char, i) => {
			if (char === targetWord[i]) return 'correct';
			if (targetWord.includes(char)) return 'present';
			return 'absent';
		});
	};

	const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			if (currentGuess.length !== targetWord.length) {
				setMessage('Word length mismatch!');
				return;
			}

			const result = checkGuess(currentGuess);
			setGuesses([...guesses, { word: currentGuess, result }]);
			setCurrentGuess('');
			setMessage('');

			if (currentGuess === targetWord) setMessage('🎉 You won!');
			else if (guesses.length + 1 >= MAX_ATTEMPTS)
				setMessage(`Game over! Word: ${targetWord}`);
		}
	};

	const startNewGame = () => {
		setGuesses([]);
		setCurrentGuess('');
		setMessage('');
		setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
	};

	// Render all attempts including empty ones
	const renderGrid = () => {
		const rows = [];
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			const guess = guesses[i]?.word || '';
			const result = guesses[i]?.result || [];
			rows.push(
				<div key={i} className="mb-2 grid grid-cols-5 gap-2">
					{Array.from({ length: targetWord.length }).map((_, j) => {
						let bg = 'bg-base-100';
						let text = '';
						if (guess[j]) {
							text = guess[j];
							if (result[j] === 'correct') bg = 'bg-success text-white';
							if (result[j] === 'present') bg = 'bg-warning text-white';
							if (result[j] === 'absent') bg = 'bg-neutral text-white';
						} else if (i === guesses.length) {
							// current typing row
							text = currentGuess[j] || '';
						}

						return (
							<div
								key={j}
								className={`card card-compact flex h-14 w-14 items-center justify-center font-bold uppercase ${bg} shadow-md transition duration-300`}>
								{text}
							</div>
						);
					})}
				</div>,
			);
		}
		return rows;
	};

	return (
		<div className="bg-base-200 flex min-h-screen flex-col items-center justify-center px-4">
			<h1 className="mb-6 text-4xl font-bold">Wordle Clone</h1>

			{/* Full Grid */}
			{renderGrid()}

			{/* Input */}
			<input
				type="text"
				className="input input-bordered input-md mb-4 text-center uppercase"
				maxLength={targetWord.length}
				value={currentGuess}
				onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
				onKeyDown={handleKey}
				autoFocus
			/>

			{/* Buttons */}
			<div className="mb-4 flex gap-2">
				<button className="btn btn-primary" onClick={() => setCurrentGuess('')}>
					Clear
				</button>
				<button className="btn btn-secondary" onClick={startNewGame}>
					New Game
				</button>
			</div>

			{/* Message */}
			{message && <p className="mt-2 font-semibold">{message}</p>}
		</div>
	);
};

export default WordlePage;
