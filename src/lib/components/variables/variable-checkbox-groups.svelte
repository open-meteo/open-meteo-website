<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	interface Props {
		groups: { value: string; label: string }[][];
		/** The bound selection array, e.g. `$params.hourly` */
		values: string[] | undefined;
		/** DOM id suffix: `hourly`, `daily`, `current`, `model`, `minutely_15`, ... */
		idSuffix: string;
		class?: string;
		groupClass?: string;
		isDisabled?: (value: string) => boolean;
	}

	let {
		groups,
		values = $bindable(),
		idSuffix,
		class: className,
		groupClass,
		isDisabled
	}: Props = $props();

	// Deliberately the controlled checked/onCheckedChange API instead of
	// bits-ui's Checkbox.Group: the bound arrays also change externally (URL
	// hash restore, back navigation), and Checkbox.Group only re-syncs a
	// checkbox when its own `value` prop changes — deriving `checked` from the
	// array keeps the UI correct under any external change.
	const toggle = (value: string) => {
		if (!values) return;
		values = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
	};
</script>

<div class={className}>
	{#each groups as group, i (i)}
		<div class={groupClass}>
			{#each group as { value, label } (value)}
				<div class="group flex items-center" title={label}>
					<Checkbox
						id="{value}_{idSuffix}"
						class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
						{value}
						disabled={isDisabled?.(value) ?? false}
						checked={values?.includes(value)}
						aria-labelledby="{value}_{idSuffix}_label"
						onCheckedChange={() => toggle(value)}
					/>
					<Label
						id="{value}_{idSuffix}_label"
						for="{value}_{idSuffix}"
						class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
					>
				</div>
			{/each}
		</div>
	{/each}
</div>
