import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
	globalCss: {
		'html, body': {
			margin: 0,
			minHeight: '100%',
			background: 'bg',
			color: 'fg',
		},
		'html, body, #root': {
			height: '100%',
		},
		'*': {
			boxSizing: 'border-box',
		},
		'::selection': {
			background: 'brand.muted',
			color: 'fg',
		},
	},
	theme: {
		tokens: {
			fonts: {
				heading: { value: `'Syne', sans-serif` },
				body: { value: `'Manrope', sans-serif` },
			},
			colors: {
				ink: {
					950: { value: '#05080f' },
					900: { value: '#0a1018' },
					800: { value: '#121a26' },
					700: { value: '#1a2433' },
					600: { value: '#2a3648' },
					500: { value: '#4a5a70' },
					400: { value: '#7a8ba3' },
					300: { value: '#a8b6c8' },
					200: { value: '#c9d4e0' },
					100: { value: '#e4ebf2' },
					50: { value: '#f3f6f9' },
				},
				brand: {
					50: { value: '#e6fffb' },
					100: { value: '#b3fff3' },
					200: { value: '#7af0df' },
					300: { value: '#3dd9c5' },
					400: { value: '#1fbfab' },
					500: { value: '#0ea5a0' },
					600: { value: '#0b8580' },
					700: { value: '#0a6b68' },
					800: { value: '#0a5452' },
					900: { value: '#0a3f3e' },
					950: { value: '#062928' },
				},
			},
		},
		semanticTokens: {
			colors: {
				bg: {
					value: { _light: '{colors.ink.50}', _dark: '{colors.ink.950}' },
				},
				'bg.subtle': {
					value: { _light: '{colors.ink.100}', _dark: '{colors.ink.900}' },
				},
				'bg.muted': {
					value: { _light: '{colors.ink.200}', _dark: '{colors.ink.800}' },
				},
				fg: {
					value: { _light: '{colors.ink.900}', _dark: '{colors.ink.50}' },
				},
				'fg.muted': {
					value: { _light: '{colors.ink.500}', _dark: '{colors.ink.300}' },
				},
				'fg.subtle': {
					value: { _light: '{colors.ink.400}', _dark: '{colors.ink.400}' },
				},
				border: {
					value: { _light: '{colors.ink.200}', _dark: '{colors.ink.700}' },
				},
				'brand.solid': {
					value: { _light: '{colors.brand.600}', _dark: '{colors.brand.400}' },
				},
				'brand.contrast': {
					value: { _light: '{colors.ink.50}', _dark: '{colors.ink.950}' },
				},
				'brand.muted': {
					value: { _light: '{colors.brand.100}', _dark: '{colors.brand.900}' },
				},
				'brand.fg': {
					value: { _light: '{colors.brand.700}', _dark: '{colors.brand.300}' },
				},
			},
		},
	},
});

export const system = createSystem(defaultConfig, config);
