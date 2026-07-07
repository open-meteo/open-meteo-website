<script lang="ts">
	import SparklesIcon from '@lucide/svelte/icons/sparkles';

	import { animationsDisabled } from '$lib/stores/settings';

	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

	interface Props {
		id?: string;
		small?: boolean;
	}

	let { id = 'animations-toggle', small = false }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<SparklesIcon class="text-muted-foreground {small ? 'size-3.5' : 'size-4'}" />
	<Label for={id} class="text-muted-foreground cursor-pointer {small ? 'text-xs' : ''}"
		>Animations</Label
	>
	<Switch
		{id}
		class={small ? 'scale-90' : ''}
		checked={!$animationsDisabled}
		onCheckedChange={(checked) => animationsDisabled.set(!checked)}
	/>
</div>
