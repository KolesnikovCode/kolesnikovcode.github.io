import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Link,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import { lazy, Suspense, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { getCvHref, getLocalePath, getUi, type ContactId, type Locale } from '../i18n/ui';
import { Provider } from './ui/provider';

const Scene3D = lazy(() => import('./Scene3D'));

const MotionDiv = motion.div;

const contactBase: Array<{
	id: ContactId;
	label: string;
	value: string;
	href: string;
}> = [
	{
		id: 'email',
		label: 'Email',
		value: 'yuri.kolesnikov.dev@gmail.com',
		href: 'mailto:yuri.kolesnikov.dev@gmail.com',
	},
	{
		id: 'telegram',
		label: 'Telegram',
		value: '@kolesnikov_dev',
		href: 'https://t.me/kolesnikov_dev',
	},
	{
		id: 'github',
		label: 'GitHub',
		value: 'KolesnikovCode',
		href: 'https://github.com/KolesnikovCode',
	},
];

function MailIcon() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M4 6.5h16a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 17.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path d="m4 8 8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

function TelegramIcon() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M20.5 4.5 3.8 11.1c-1.1.4-1.1 1.1-.2 1.4l4.3 1.3 1.7 5.1c.2.7.7.8 1.3.5l2.5-2.1 4.5 3.3c.8.5 1.4.2 1.6-.8L21.7 5.7c.3-1.2-.4-1.7-1.2-1.2Z"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function GitHubIcon() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M9.5 19c-4 1.3-4-2-5.5-2m11 4v-3.5c0-1 .3-1.7.9-2.2 2.9-.3 6-1.4 6-6.4a4.9 4.9 0 0 0-1.3-3.4 4.6 4.6 0 0 0-.1-3.4s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C8.1 2.8 7 3.1 7 3.1a4.6 4.6 0 0 0-.1 3.4A4.9 4.9 0 0 0 5.6 9.9c0 5 3.1 6.1 6 6.4.6.5.9 1.3.9 2.2V21"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

const contactIcons: Record<ContactId, ReactNode> = {
	email: <MailIcon />,
	telegram: <TelegramIcon />,
	github: <GitHubIcon />,
};

function SceneFallback() {
	return (
		<Box
			position="absolute"
			inset={0}
			bg="radial-gradient(ellipse at 70% 40%, #0a3f3e 0%, #05080f 55%)"
		/>
	);
}

function LanguageSwitch({ locale }: { locale: Locale }) {
	const t = getUi(locale);

	return (
		<Flex
			as="nav"
			align="center"
			gap={2}
			aria-label={t.langSwitcherLabel}
			fontFamily="heading"
			fontSize="sm"
			fontWeight="700"
			letterSpacing="0.04em"
		>
			<Link
				href={getLocalePath('ru')}
				color={locale === 'ru' ? 'brand.solid' : 'fg.muted'}
				textDecoration="none"
				_hover={{ color: 'brand.solid' }}
				aria-current={locale === 'ru' ? 'page' : undefined}
			>
				{t.langRu}
			</Link>
			<Text color="fg.subtle" aria-hidden="true">
				|
			</Text>
			<Link
				href={getLocalePath('en')}
				color={locale === 'en' ? 'brand.solid' : 'fg.muted'}
				textDecoration="none"
				_hover={{ color: 'brand.solid' }}
				aria-current={locale === 'en' ? 'page' : undefined}
			>
				{t.langEn}
			</Link>
		</Flex>
	);
}

function BusinessCardContent({ locale }: { locale: Locale }) {
	const t = getUi(locale);
	const reduceMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const headerHeight = { base: '4.25rem', md: '4.75rem' };

	const fadeUp = (delay = 0) =>
		reduceMotion
			? { initial: false, animate: { opacity: 1 } }
			: {
					initial: { opacity: 0, y: 28 },
					animate: { opacity: 1, y: 0 },
					transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
				};

	const fadeInView = (delay = 0) =>
		reduceMotion
			? { initial: false }
			: {
					initial: { opacity: 0, y: 28 },
					whileInView: { opacity: 1, y: 0 },
					viewport: { once: true, amount: 0.35 },
					transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
				};

	const contacts = contactBase.map((contact) => ({
		...contact,
		hint: t.contactHints[contact.id],
	}));

	return (
		<Box minH="100vh" bg="bg" color="fg" position="relative" overflow="hidden">
			<Box
				position="fixed"
				inset={0}
				zIndex={0}
				pointerEvents="none"
				aria-hidden="true"
			>
				{mounted ? (
					<Suspense fallback={<SceneFallback />}>
						<Scene3D />
					</Suspense>
				) : (
					<SceneFallback />
				)}
				<Box
					position="absolute"
					inset={0}
					bg={{
						base: 'linear-gradient(105deg, rgba(5,8,15,0.94) 0%, rgba(5,8,15,0.82) 42%, rgba(5,8,15,0.35) 72%, rgba(5,8,15,0.55) 100%)',
						md: 'linear-gradient(105deg, rgba(5,8,15,0.92) 0%, rgba(5,8,15,0.78) 38%, rgba(5,8,15,0.2) 68%, rgba(5,8,15,0.45) 100%)',
					}}
				/>
			</Box>

			<Box position="relative" zIndex={1} pt={headerHeight}>
				<Box
					as="header"
					position="fixed"
					top={0}
					left={0}
					right={0}
					zIndex={20}
					h={headerHeight}
					px={{ base: 5, md: 8 }}
					display="flex"
					alignItems="center"
					bg={scrolled ? 'rgba(5, 8, 15, 0.82)' : 'rgba(5, 8, 15, 0.35)'}
					backdropFilter="blur(14px)"
					borderBottom="1px solid"
					borderColor={scrolled ? 'border' : 'transparent'}
					transition="background 0.25s ease, border-color 0.25s ease"
				>
					<Flex align="center" justify="space-between" maxW="8xl" mx="auto" w="100%" gap={4}>
						<Link
							href="#top"
							fontFamily="heading"
							fontWeight="700"
							letterSpacing="-0.04em"
							fontSize="sm"
							color="brand.fg"
							textDecoration="none"
							_hover={{ color: 'brand.solid' }}
							transition="color 0.2s"
							onClick={(event) => {
								event.preventDefault();
								window.scrollTo({ top: 0, behavior: 'smooth' });
							}}
						>
							kolesnikov.code
						</Link>
						<Flex align="center" gap={{ base: 4, md: 6 }}>
							<LanguageSwitch locale={locale} />
							<Link
								href={getCvHref(locale)}
								target="_blank"
								rel="noopener noreferrer"
								fontFamily="heading"
								fontSize="sm"
								fontWeight="700"
								letterSpacing="0.04em"
								color="brand.fg"
								_hover={{ color: 'brand.solid' }}
								transition="color 0.2s"
							>
								CV (PDF)
							</Link>
						</Flex>
					</Flex>
				</Box>

				<Box
					as="section"
					minH={{ base: 'calc(92vh - 4.25rem)', md: 'calc(100vh - 4.75rem)' }}
					display="flex"
					alignItems="center"
					px={{ base: 5, md: 8 }}
					pb={{ base: 16, md: 20 }}
				>
					<Container maxW="8xl" px={0}>
						<Stack gap={{ base: 7, md: 9 }} maxW={{ base: '100%', lg: '72%' }}>
							<MotionDiv {...fadeUp(0.05)}>
								<Flex
									direction={{ base: 'column', md: 'row' }}
									align={{ base: 'center', md: 'center' }}
									gap={{ base: 6, md: 0 }}
								>
									<Box
										as="div"
										role="img"
										aria-label={t.photoAlt}
										flexShrink={0}
										mr={{ base: 0, md: 8 }}
										w={{ base: '220px', sm: '240px', md: '180px', lg: '200px' }}
										h={{ base: '220px', sm: '240px', md: '180px', lg: '200px' }}
										borderRadius="full"
										border="1px solid"
										borderColor="border"
										boxShadow="0 0 0 1px rgba(61, 217, 197, 0.18), 0 24px 80px rgba(0, 0, 0, 0.45)"
										style={{
											backgroundImage: 'url(/photo.jpg)',
											backgroundSize: 'cover',
											backgroundRepeat: 'no-repeat',
											backgroundPosition: 'center center',
										}}
									/>
									<Heading
										as="h1"
										fontFamily="heading"
										fontWeight="800"
										letterSpacing={{ base: '-0.04em', md: '-0.06em' }}
										lineHeight="0.92"
										fontSize="clamp(2.35rem, 9.2vw, 6rem)"
										color="fg"
										textAlign={{ base: 'center', md: 'left' }}
										overflowWrap="normal"
										wordBreak="keep-all"
										hyphens="none"
										maxW="100%"
									>
										{t.firstName}
										<br />
										{t.lastName}
									</Heading>
								</Flex>
							</MotionDiv>

							<MotionDiv {...fadeUp(0.18)}>
								<Text
									fontFamily="heading"
									fontWeight="600"
									fontSize={{ base: 'xl', md: '2xl' }}
									letterSpacing="-0.02em"
									color="brand.fg"
									textAlign={{ base: 'center', md: 'left' }}
								>
									{t.role}
								</Text>
							</MotionDiv>

							<MotionDiv {...fadeUp(0.28)}>
								<Text
									fontSize={{ base: 'md', md: 'lg' }}
									color="fg.muted"
									maxW="34rem"
									mx={{ base: 'auto', md: 0 }}
									lineHeight="1.7"
									textAlign={{ base: 'center', md: 'left' }}
								>
									{t.heroLead}
								</Text>
							</MotionDiv>

							<MotionDiv
								{...fadeUp(0.4)}
								style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 8 }}
							>
								<Box
									display="flex"
									gap={3}
									flexWrap="wrap"
									justifyContent={{ base: 'center', md: 'flex-start' }}
									w="100%"
								>
									<Button
										asChild
										size="lg"
										bg="brand.solid"
										color="brand.contrast"
										fontWeight="700"
										px={7}
										_hover={{ opacity: 0.92, transform: 'translateY(-1px)' }}
										transition="all 0.2s"
									>
										<a href="#contacts">{t.ctaContact}</a>
									</Button>
									<Button
										asChild
										size="lg"
										variant="outline"
										borderColor="border"
										color="fg"
										fontWeight="600"
										px={7}
										_hover={{ borderColor: 'brand.solid', color: 'brand.fg' }}
									>
										<a href="#about">{t.ctaAbout}</a>
									</Button>
								</Box>
							</MotionDiv>
						</Stack>
					</Container>
				</Box>

				<Box
					as="section"
					id="about"
					px={{ base: 5, md: 8 }}
					py={{ base: 16, md: 24 }}
					scrollMarginTop={headerHeight}
				>
					<Container maxW="8xl" px={0}>
						<Stack gap={{ base: 8, md: 10 }} maxW={{ base: '100%', md: '50%' }}>
							<MotionDiv {...fadeInView(0)}>
								<Text
									fontFamily="heading"
									fontWeight="700"
									fontSize="sm"
									letterSpacing="0.14em"
									textTransform="uppercase"
									color="brand.fg"
									mb={3}
								>
									{t.aboutEyebrow}
								</Text>
								<Heading
									as="h2"
									fontFamily="heading"
									fontWeight="700"
									letterSpacing="-0.04em"
									fontSize={{ base: '2.4rem', md: '3rem' }}
									lineHeight="1.05"
								>
									{t.aboutTitleLine1}
									<br />
									{t.aboutTitleLine2}
								</Heading>
							</MotionDiv>

							<MotionDiv {...fadeInView(0.12)}>
								<Stack gap={5}>
									<Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" lineHeight="1.75">
										{t.aboutP1}
									</Text>
									<Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" lineHeight="1.75">
										{t.aboutP2Lead}
										<br />
										{t.aboutP2Past}
									</Text>
									<Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" lineHeight="1.75">
										{t.aboutP3}
									</Text>
									<Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" lineHeight="1.75">
										{t.aboutP4}
									</Text>

									<SimpleGrid
										columns={{ base: 1, sm: 2 }}
										gap={{ base: 4, sm: 6 }}
										pt={5}
										mt={1}
										borderTop="1px solid"
										borderColor="border"
									>
										{(
											[
												{ label: t.metaLocationLabel, value: t.metaLocationValue },
												{ label: t.metaHobbyLabel, value: t.metaHobbyValue },
											] as const
										).map((item) => (
											<Box key={item.label}>
												<Text
													fontFamily="heading"
													fontWeight="700"
													fontSize="xs"
													letterSpacing="0.12em"
													textTransform="uppercase"
													color="brand.fg"
													mb={1.5}
												>
													{item.label}
												</Text>
												<Text fontSize="sm" color="fg.muted" lineHeight="1.5">
													{item.value}
												</Text>
											</Box>
										))}
									</SimpleGrid>
								</Stack>
							</MotionDiv>
						</Stack>
					</Container>
				</Box>

				<Box
					as="section"
					id="contacts"
					px={{ base: 5, md: 8 }}
					pt={{ base: 8, md: 12 }}
					pb={{ base: 20, md: 28 }}
					scrollMarginTop={headerHeight}
				>
					<Container maxW="8xl" px={0}>
						<Stack gap={{ base: 8, md: 10 }}>
							<MotionDiv {...fadeInView(0)} style={{ maxWidth: '32rem' }}>
								<Text
									fontFamily="heading"
									fontWeight="700"
									fontSize="sm"
									letterSpacing="0.14em"
									textTransform="uppercase"
									color="brand.fg"
									mb={3}
								>
									{t.contactsEyebrow}
								</Text>
								<Heading
									as="h2"
									fontFamily="heading"
									fontWeight="700"
									letterSpacing="-0.04em"
									fontSize={{ base: '2.4rem', md: '3rem' }}
									lineHeight="1.05"
									mb={4}
								>
									{t.contactsTitle}
								</Heading>
								<Text color="fg.muted" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7">
									{t.contactsLead}
								</Text>
							</MotionDiv>

							<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
								{contacts.map((contact, index) => (
									<MotionDiv
										key={contact.id}
										initial={reduceMotion ? false : { opacity: 0, y: 20 }}
										whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.4 }}
										transition={{ duration: 0.55, delay: index * 0.08 }}
										whileHover={
											reduceMotion
												? undefined
												: { y: -4, rotateX: 4, rotateY: -3, transition: { duration: 0.25 } }
										}
										style={
											{
												transformStyle: 'preserve-3d',
												perspective: 800,
											} satisfies CSSProperties
										}
									>
										<Link
											href={contact.href}
											target={contact.href.startsWith('http') ? '_blank' : undefined}
											rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
											display="block"
											h="100%"
											p={{ base: 5, md: 6 }}
											borderRadius="xl"
											border="1px solid"
											borderColor="border"
											bg="whiteAlpha.50"
											backdropFilter="blur(8px)"
											textDecoration="none"
											color="inherit"
											transition="background 0.2s, border-color 0.2s, color 0.2s"
											_hover={{
												bg: 'whiteAlpha.100',
												borderColor: 'brand.solid',
												color: 'brand.fg',
											}}
										>
											<Flex align="center" gap={3} mb={4} color="brand.fg">
												{contactIcons[contact.id]}
												<Text
													fontFamily="heading"
													fontWeight="700"
													fontSize="sm"
													letterSpacing="0.08em"
													textTransform="uppercase"
												>
													{contact.label}
												</Text>
											</Flex>
											<Text
												fontFamily="heading"
												fontWeight="600"
												fontSize={{ base: 'lg', md: 'xl' }}
												letterSpacing="-0.02em"
												mb={2}
												wordBreak="break-word"
												color="fg"
											>
												{contact.value}
											</Text>
											<Text fontSize="sm" color="fg.muted">
												{contact.hint}
											</Text>
										</Link>
									</MotionDiv>
								))}
							</SimpleGrid>
						</Stack>
					</Container>
				</Box>

				<Box as="footer" px={{ base: 5, md: 8 }} pb={10}>
					<Box
						maxW="8xl"
						mx="auto"
						borderTop="1px solid"
						borderColor="border"
						pt={6}
						textAlign="center"
					>
						<Text fontSize="sm" color="fg.subtle">
							© {new Date().getFullYear()} {t.footerName}
						</Text>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default function BusinessCard({ locale = 'ru' }: { locale?: Locale }) {
	return (
		<Provider>
			<BusinessCardContent locale={locale} />
		</Provider>
	);
}
