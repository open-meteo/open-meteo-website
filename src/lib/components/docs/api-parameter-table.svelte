<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface ApiParameter {
		/** An array renders parameter names on separate lines. */
		name: string | readonly string[];
		format: string;
		required?: boolean;
		/** Non-empty defaults are highlighted consistently across APIs. */
		defaultValue?: string;
		description: string | Snippet;
	}
</script>

<script lang="ts">
	interface Props {
		parameters: readonly ApiParameter[];
		caption?: string | Snippet;
		minWidth?: 'min-w-200' | 'min-w-250' | 'min-w-300';
	}

	let { parameters, caption, minWidth = 'min-w-300' }: Props = $props();
</script>

<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
	<table class={['docs-table w-full', minWidth]}>
		{#if caption}
			<caption>
				{#if typeof caption === 'string'}
					{caption}
				{:else}
					{@render caption()}
				{/if}
			</caption>
		{/if}
		<thead>
			<tr>
				<th scope="col">Parameter</th>
				<th scope="col">Format</th>
				<th scope="col">Required</th>
				<th scope="col">Default</th>
				<th scope="col">Description</th>
			</tr>
		</thead>
		<tbody>
			{#each parameters as parameter (typeof parameter.name === 'string' ? parameter.name : parameter.name.join(','))}
				<tr>
					<th scope="row">
						{#if typeof parameter.name === 'string'}
							{parameter.name}
						{:else}
							{#each parameter.name as name, index (name)}
								{#if index > 0}<br />{/if}{name}
							{/each}
						{/if}
					</th>
					<td>{parameter.format}</td>
					<td>{parameter.required ? 'Yes' : 'No'}</td>
					<td>
						{#if parameter.defaultValue}<mark>{parameter.defaultValue}</mark>{/if}
					</td>
					<td>
						{#if typeof parameter.description === 'string'}
							{parameter.description}
						{:else}
							{@render parameter.description()}
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
