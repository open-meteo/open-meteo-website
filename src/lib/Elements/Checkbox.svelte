<script lang="ts">
    export let id: string;
    export let name: string;
	export let value: string;
    export let bindGroup: string|string[] = [];

	function onChange({ target }) {
		const { value, checked } = target;
        bindGroup = Array.isArray(bindGroup) ? bindGroup : [bindGroup]
		if (checked) {
			bindGroup = [...bindGroup, value];
		} else {
			bindGroup = bindGroup.filter((item) => item !== value);
		}
	}
</script>

<div class="form-check">
	<input
		class="form-check-input"
		type="checkbox"
		{id}
		{name}
		{value}
		checked={bindGroup.includes(value)}
		on:change={onChange}
	/>
	<label class="form-check-label" for={id}>
		<slot />
	</label>
</div>
