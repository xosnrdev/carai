'use client';

import Editor from '@/components/ui/editor';
import Onboarding from '@/components/ui/onboarding';
import { useTabContext } from '@/sdk/tabkit/store';
import { FC } from 'react';

const Home: FC = () => {
	const { isTabOnboarding, isTabEditor } = useTabContext();

	const view = () => {
		switch (true) {
			case isTabOnboarding:
				return <Onboarding />;

			case isTabEditor:
				return <Editor />;

			default:
				return <Onboarding />;
		}
	};

	return <main className="flex flex-col">{view()}</main>;
};

export default Home;
