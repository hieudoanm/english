import { Navbar } from '@words/components/Navbar';
import { useEffect, useState } from 'react';

export type FlashCard = {
	front: string; // Korean word
	back: string; // English meaning
};

// Example flash cards
const flashCardsData: FlashCard[] = [
	{ front: '사과', back: 'Apple' },
	{ front: '책', back: 'Book' },
	{ front: '컴퓨터', back: 'Computer' },
	{ front: '태양', back: 'Sun' },
];

const FlashCardsPage = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);

	const nextCard = () => {
		setFlipped(false);
		setCurrentIndex((prev) => (prev + 1) % flashCardsData.length);
	};

	const prevCard = () => {
		setFlipped(false);
		setCurrentIndex(
			(prev) => (prev - 1 + flashCardsData.length) % flashCardsData.length,
		);
	};

	const flipCard = () => {
		setFlipped((prev) => !prev);
	};

	// Handle keyboard events
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'ArrowRight') nextCard();
			if (e.code === 'ArrowLeft') prevCard();
			if (e.code === 'Space') {
				e.preventDefault(); // Prevent page scrolling
				flipCard();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const currentCard = flashCardsData[currentIndex];

	return (
		<div className="bg-base-200 flex min-h-screen flex-col">
			<Navbar />
			<div className="flex grow flex-col items-center justify-center p-6">
				<h1 className="mb-8 text-4xl font-bold">Flash Cards</h1>

				<div
					className={`card bg-base-100 flex h-56 w-96 cursor-pointer items-center justify-center p-4 text-center shadow-xl transition-transform duration-500`}
					onClick={flipCard}>
					<div className="card-body">
						<p className="flex h-full items-center justify-center text-2xl font-semibold">
							{flipped ? currentCard.back : currentCard.front}
						</p>
					</div>
				</div>

				<div className="mt-6 flex gap-4">
					<button className="btn btn-outline" onClick={prevCard}>
						Previous
					</button>
					<button className="btn btn-primary" onClick={nextCard}>
						Next
					</button>
				</div>

				<p className="mt-4 text-gray-500">
					Card {currentIndex + 1} of {flashCardsData.length}
				</p>

				<p className="mt-2 text-sm text-gray-400">
					Use ← / → to navigate, Space to flip
				</p>
			</div>
		</div>
	);
};

export default FlashCardsPage;
