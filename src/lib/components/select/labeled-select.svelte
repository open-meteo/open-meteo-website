<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	interface Props {
		name: string;
		label: string;
		options: { value: string; label: string }[];
		/** The bound parameter, e.g. `$params.forecast_hours` */
		value: string | undefined;
		class?: string;
	}

	let {
		name,
		label,
		options,
		value = $bindable(),
		class: className = 'relative'
	}: Props = $props();

	let selected = $derived(options.find((option) => String(option.value) == value));
</script>

<div class={className}>
	<Select.Root {name} type="single" bind:value>
		<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
			>{selected?.label}</Select.Trigger
		>
		<Select.Content preventScroll={false} class="border-border">
			{#each options as { value, label } (value)}
				<Select.Item {value}>{label}</Select.Item>
			{/each}
		</Select.Content>
		<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
			>{label}</Label
		>
	</Select.Root>
</div>
