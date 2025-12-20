import { Navbar } from '@words/components/Navbar';
import { NextPage } from 'next';
import Link from 'next/link';

const LandingPage: NextPage = () => {
	return (
		<div className="bg-base-200 flex min-h-screen flex-col">
			{/* Navbar */}
			<Navbar />

			{/* Hero Section */}
			<div className="hero bg-base-200 min-h-[60vh]">
				<div className="hero-content text-center">
					<div className="max-w-lg">
						<h1 className="mb-4 text-5xl font-bold">Learn & Explore Words</h1>
						<p className="mb-6 text-lg text-gray-600">
							Enhance your vocabulary with our dictionary, flash cards, and
							multi-language support.
						</p>
						<Link href="/languages" className="btn btn-primary btn-lg">
							Get Started
						</Link>
					</div>
				</div>
			</div>

			<div className="divider my-8" />

			{/* Features Section */}
			<div id="apps" className="bg-base-200 py-16">
				<div className="container mx-auto px-8 text-center md:px-0">
					<h2 className="mb-12 text-4xl font-bold">Our Apps</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{/* Multi-language Support */}
						<div className="card bg-base-100 p-6 shadow-lg transition hover:shadow-xl">
							<div className="card-body">
								<h3 className="card-title mb-2 text-2xl">Multi-language</h3>
								<p className="text-gray-600">
									Expand your learning experience with support for multiple
									languages beyond English and Korean.
								</p>
							</div>
						</div>

						{/* Flash Cards */}
						<div className="card bg-base-100 p-6 shadow-lg transition hover:shadow-xl">
							<div className="card-body">
								<h3 className="card-title mb-2 text-2xl">Flash Cards</h3>
								<p className="text-gray-600">
									Learn vocabulary efficiently using interactive flash cards
									with Korean-English translations.
								</p>
							</div>
						</div>

						{/* English Dictionary */}
						<div className="card bg-base-100 p-6 shadow-lg transition hover:shadow-xl">
							<div className="card-body">
								<h3 className="card-title mb-2 text-2xl">English Dictionary</h3>
								<p className="text-gray-600">
									Quickly search words with clear definitions, synonyms, and
									antonyms to improve your English skills.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="divider my-8" />

			{/* Call to Action */}
			<div className="bg-base-200 py-16 text-center">
				<h2 className="mb-4 text-4xl font-bold">Start Learning Today</h2>
				<p className="mb-6 text-lg text-gray-700">
					Explore our apps and improve your vocabulary in a fun and interactive
					way.
				</p>
				<Link href="/languages" className="btn btn-primary btn-lg">
					Explore Apps
				</Link>
			</div>

			<div className="divider my-8" />

			{/* Footer */}
			<footer className="footer footer-center bg-base-200 text-base-content pb-8">
				<div>
					<p>© 2025 Words. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
