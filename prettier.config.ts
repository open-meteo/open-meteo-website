export default {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	importOrder: [
		'^svelte($|/)',
		'<THIRD_PARTY_MODULES>',
		'app/',
		'lib/stores',
		'lib/utils',
		'.svx($)',
		'lib/components/ui',
		'lib/components',
		'lib/assets',
		'^~/',
		'^\\.',
		'<THIRD_PARTY_TS_TYPES>',
		'<TS_TYPES>'
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	plugins: [
		'prettier-plugin-svelte',
		'prettier-plugin-tailwindcss',
		'@trivago/prettier-plugin-sort-imports'
	],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	]
};
