import type { TabId } from '@/sdk/tabkit/store';
import { ReactNode } from 'react';
import type { IconType } from 'react-icons';

declare global {
	interface SidebarProps {
		icon: IconType;
		label: string;
	}

	interface NavProps {
		icon: IconType;
	}

	interface BrandProps {
		width?: number;
		height?: number;
	}

	interface RouteProps {
		label: string;
		path: string;
	}

	interface LanguageProps {
		title: string;
		extension: string;
		iconProps: {
			icon: IconType;
			className: string;
			size: number;
		};
	}

	type ModalProps = Partial<{
		title: string;
		description: string;
		children: ReactNode;
		onClose: () => void;
	}>;

	interface OnboardingProps {
		links: RouteProps[];
		texts: string[];
	}

	interface TabBarProps extends SidebarProps {}

	interface TabProps {
		id: string;
		title: string;
		activeTabId: TabId;
		setActiveTab: (id: TabId) => void;
		closeTab: (
			e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
			id: TabId
		) => void;
	}
}
