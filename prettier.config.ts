export default {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	importOrder: [
		'<THIRD_PARTY_MODULES>',
		'^.$lib/utils/(.*)$',
		'^.$lib/components/(.*)$',
		'^./(?!types|options)',
		'/types',
		'/options'
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
