import { Navbar } from '@words/components/Navbar';
import { NextPage } from 'next';
import { useState } from 'react';

const WORDS: string[] = ['apple', 'grape', 'melon', 'peach', 'berry']; // example words
const MAX_ATTEMPTS: number = 5;
const RANDOM_TARGET_WORD: string =
	WORDS[Math.floor(Math.random() * WORDS.length)];
const ALPHABET = 'qwertyuiopasdfghjklzxvbcnm'.split('');

type LetterState = 'correct' | 'present' | 'absent';
type Guess = { word: string; result: LetterState[] };

const WordlePage: NextPage = () => {
	const [targetWord, setTargetWord] = useState(RANDOM_TARGET_WORD);
	const [guesses, setGuesses] = useState<Guess[]>([]);
	const [currentGuess, setCurrentGuess] = useState('');
	const [message, setMessage] = useState('');

	const checkGuess = (guess: string) =>
		guess.split('').map((char, i) => {
			if (char === targetWord[i]) return 'correct';
			if (targetWord.includes(char)) return 'present';
			return 'absent';
		});

	const submitGuess = (guess: string) => {
		if (guess.length !== targetWord.length) {
			setMessage('Word length mismatch!');
			return;
		}

		const result = checkGuess(guess);
		setGuesses([...guesses, { word: guess, result }]);
		setCurrentGuess('');
		setMessage('');

		if (guess === targetWord) setMessage('🎉 You won!');
		else if (guesses.length + 1 >= MAX_ATTEMPTS)
			setMessage(`Game over! Word: ${targetWord}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') submitGuess(currentGuess);
	};

	const handleKeyboardClick = (letter: string) => {
		if (currentGuess.length < targetWord.length)
			setCurrentGuess((prev) => prev + letter);
	};

	const handleBackspace = () => {
		setCurrentGuess((prev) => prev.slice(0, -1));
	};

	const startNewGame = () => {
		setGuesses([]);
		setCurrentGuess('');
		setMessage('');
		setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
	};

	// Build a mapping of letter → status for the keyboard
	const getKeyboardStatus = () => {
		const statusMap: Record<string, LetterState> = {};
		guesses.forEach(({ word, result }) => {
			word.split('').forEach((char, idx) => {
				const prev = statusMap[char];
				const newState = result[idx];
				// correct overrides anything, present overrides absent
				if (prev === 'correct') return;
				if (prev === 'present' && newState === 'absent') return;
				statusMap[char] = newState;
			});
		});
		return statusMap;
	};

	const keyboardStatus = getKeyboardStatus();

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
		<div className="bg-base-200 flex min-h-screen flex-col">
			<Navbar />
			<div className="flex grow flex-col items-center justify-center p-8">
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
					onKeyDown={handleKeyDown}
					autoFocus
				/>

				{/* On-screen keyboard */}
				<div className="mb-4 grid grid-cols-10 gap-2">
					{ALPHABET.map((letter) => {
						let btnClass = 'btn btn-sm';
						const status = keyboardStatus[letter];
						if (status === 'correct') btnClass += ' btn-success';
						else if (status === 'present') btnClass += ' btn-warning';
						else if (status === 'absent') btnClass += ' btn-neutral';
						else btnClass += ' btn-outline';

						return (
							<button
								key={letter}
								className={btnClass}
								onClick={() => handleKeyboardClick(letter)}>
								{letter.toUpperCase()}
							</button>
						);
					})}
					<button
						className="btn btn-sm btn-error col-span-2"
						onClick={handleBackspace}>
						Backspace
					</button>
				</div>

				{/* Buttons */}
				<div className="mb-4 flex gap-2">
					<button
						className="btn btn-primary"
						onClick={() => setCurrentGuess('')}>
						Clear
					</button>
					<button className="btn btn-secondary" onClick={startNewGame}>
						New Game
					</button>
					<button
						className="btn btn-accent"
						onClick={() => submitGuess(currentGuess)}>
						Enter
					</button>
				</div>

				{/* Message */}
				{message && <p className="mt-2 font-semibold">{message}</p>}
			</div>
		</div>
	);
};

export default WordlePage;
