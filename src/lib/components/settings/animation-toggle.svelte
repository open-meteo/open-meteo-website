<script lang="ts">
	import { animationsDisabled } from '$lib/stores/settings';

	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

	interface Props {
		id?: string;
	}

	let { id = 'animations-toggle' }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<Switch
		{id}
		checked={!$animationsDisabled}
		onCheckedChange={(checked) => animationsDisabled.set(!checked)}
	/>
	<Label for={id} class="text-muted-foreground cursor-pointer">Animations</Label>
</div>
