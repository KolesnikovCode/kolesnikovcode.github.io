export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export type ContactId = 'email' | 'telegram' | 'github';

export type UiCopy = {
	metaTitle: string;
	metaDescription: string;
	photoAlt: string;
	role: string;
	heroLead: string;
	ctaContact: string;
	ctaAbout: string;
	aboutEyebrow: string;
	aboutTitleLine1: string;
	aboutTitleLine2: string;
	aboutP1: string;
	aboutP2Lead: string;
	aboutP2Past: string;
	aboutP3: string;
	aboutP4: string;
	metaLocationLabel: string;
	metaLocationValue: string;
	metaHobbyLabel: string;
	metaHobbyValue: string;
	contactsEyebrow: string;
	contactsTitle: string;
	contactsLead: string;
	contactHints: Record<ContactId, string>;
	footerName: string;
	firstName: string;
	lastName: string;
	langRu: string;
	langEn: string;
	langSwitcherLabel: string;
};

export const ui: Record<Locale, UiCopy> = {
	ru: {
		metaTitle: 'Kolesnikov — Head of Frontend',
		metaDescription:
			'Юрий Колесников — Head of Frontend / Lead Frontend Engineer. React, Vue, TypeScript.',
		photoAlt: 'Юрий Колесников',
		role: 'Head of Frontend · Lead Engineer',
		heroLead:
			'Строю архитектуру фронтенда, команды и процессы — React, Vue и TypeScript в масштабе продуктов.',
		ctaContact: 'Связаться',
		ctaAbout: 'Обо мне',
		aboutEyebrow: 'Обо мне',
		aboutTitleLine1: 'Системы, люди',
		aboutTitleLine2: 'и интерфейсы',
		aboutP1:
			'Head of Frontend с 7+ годами опыта. React/Next, Vue/Nuxt, TypeScript — архитектура SPA/SSR и Developer Experience.',
		aboutP2Lead:
			'Сейчас руковожу фронтендом в А7-Технологии: стратегия, стандарты, менторинг лидов и процессы.',
		aboutP2Past:
			'Раньше — Lead в IPChain, стриминговой медиаплатформе TeleSport и Kaspersky Container Security.',
		aboutP3:
			'Собирал HLS-плееры и WebRTC для live-видео, а также кастомные аудиоплееры с анализом звука и отрисовкой волноформы. Был опыт в web3 и трейдинге: высокопроизводительный интерфейс, который слушал десятки и сотни событий в секунду.',
		aboutP4:
			'При необходимости пишу бэкенд на Node.js и Go. Для себя изучал Rust, на C++ иногда делаю VST-плагины в своё удовольствие.',
		metaLocationLabel: 'Локация',
		metaLocationValue: 'Москва',
		metaHobbyLabel: 'Хобби',
		metaHobbyValue: 'Мотоциклы и звукорежиссура',
		contactsEyebrow: 'Контакты',
		contactsTitle: 'Открыт к диалогу',
		contactsLead:
			'Пишите на почту или в Telegram — отвечу по сотрудничеству, менторству и техническому лидерству.',
		contactHints: {
			email: 'Предпочитаемый способ связи',
			telegram: 'Быстрые сообщения',
			github: 'Код и эксперименты',
		},
		footerName: 'Юрий Колесников',
		firstName: 'Юрий',
		lastName: 'Колесников',
		langRu: 'RU',
		langEn: 'EN',
		langSwitcherLabel: 'Язык',
	},
	en: {
		metaTitle: 'Kolesnikov — Head of Frontend',
		metaDescription:
			'Yuri Kolesnikov — Head of Frontend / Lead Frontend Engineer. React, Vue, TypeScript.',
		photoAlt: 'Yuri Kolesnikov',
		role: 'Head of Frontend · Lead Engineer',
		heroLead:
			'I build frontend architecture, teams, and processes — React, Vue, and TypeScript at product scale.',
		ctaContact: 'Contact',
		ctaAbout: 'About',
		aboutEyebrow: 'About',
		aboutTitleLine1: 'Systems, people',
		aboutTitleLine2: 'and interfaces',
		aboutP1:
			'Head of Frontend with 7+ years of experience. React/Next, Vue/Nuxt, TypeScript — SPA/SSR architecture and Developer Experience.',
		aboutP2Lead:
			'I currently lead frontend at A7-Technology: strategy, standards, mentoring leads, and processes.',
		aboutP2Past:
			'Previously — Lead at IPChain, the streaming media platform TeleSport, and Kaspersky Container Security.',
		aboutP3:
			'I built HLS players and WebRTC for live video, plus custom audio players with sound analysis and waveform rendering. I also worked in web3 and trading: a high-performance UI that handled tens to hundreds of events per second.',
		aboutP4:
			'When needed, I write backend services in Node.js and Go. I have been learning Rust for myself, and sometimes build VST plugins in C++ for fun.',
		metaLocationLabel: 'Location',
		metaLocationValue: 'Moscow',
		metaHobbyLabel: 'Hobbies',
		metaHobbyValue: 'Motorcycles and sound engineering',
		contactsEyebrow: 'Contacts',
		contactsTitle: 'Open to conversation',
		contactsLead:
			'Email or Telegram — happy to talk about collaboration, mentorship, and engineering leadership.',
		contactHints: {
			email: 'Preferred way to reach me',
			telegram: 'Quick messages',
			github: 'Code and experiments',
		},
		footerName: 'Yuri Kolesnikov',
		firstName: 'Yuri',
		lastName: 'Kolesnikov',
		langRu: 'RU',
		langEn: 'EN',
		langSwitcherLabel: 'Language',
	},
};

export function getLocalePath(locale: Locale): string {
	return locale === defaultLocale ? '/' : `/${locale}/`;
}

export function getCvHref(locale: Locale): string {
	return locale === 'en' ? '/Yuri_Kolesnikov_CV_EN.pdf' : '/Yuri_Kolesnikov_CV_RU.pdf';
}

export function getUi(locale: Locale): UiCopy {
	return ui[locale];
}
