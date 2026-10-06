<script lang="ts">
	// Side-by-side comparison of every shadcn component before the 1.7.0 update
	// (the files from the sveltekit-3 branch, copied to ui-before) and after it.
	// One snippet per component renders both columns, so markup and state are
	// identical and only the component implementation differs. Dev aid only:
	// the site is prerendered, so this route and ui-before must not be committed.
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import InfoIcon from '@lucide/svelte/icons/info';
	import SearchIcon from '@lucide/svelte/icons/search';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

	import * as AccordionBefore from '#lib/components/ui-before/accordion/index.js';
	import * as AlertBefore from '#lib/components/ui-before/alert/index.js';
	import * as ButtonBefore from '#lib/components/ui-before/button/index.js';
	import * as CheckboxBefore from '#lib/components/ui-before/checkbox/index.js';
	import * as DialogBefore from '#lib/components/ui-before/dialog/index.js';
	import * as DropdownMenuBefore from '#lib/components/ui-before/dropdown-menu/index.js';
	import * as InputBefore from '#lib/components/ui-before/input/index.js';
	import * as LabelBefore from '#lib/components/ui-before/label/index.js';
	import * as PopoverBefore from '#lib/components/ui-before/popover/index.js';
	import * as SelectBefore from '#lib/components/ui-before/select/index.js';
	import * as SeparatorBefore from '#lib/components/ui-before/separator/index.js';
	import * as SwitchBefore from '#lib/components/ui-before/switch/index.js';
	import * as ToggleGroupBefore from '#lib/components/ui-before/toggle-group/index.js';
	import * as ToggleBefore from '#lib/components/ui-before/toggle/index.js';
	import * as AccordionAfter from '#lib/components/ui/accordion/index.js';
	import * as AlertAfter from '#lib/components/ui/alert/index.js';
	import * as ButtonAfter from '#lib/components/ui/button/index.js';
	import * as CheckboxAfter from '#lib/components/ui/checkbox/index.js';
	import * as DialogAfter from '#lib/components/ui/dialog/index.js';
	import * as DropdownMenuAfter from '#lib/components/ui/dropdown-menu/index.js';
	import * as InputAfter from '#lib/components/ui/input/index.js';
	import * as LabelAfter from '#lib/components/ui/label/index.js';
	import * as PopoverAfter from '#lib/components/ui/popover/index.js';
	import * as SelectAfter from '#lib/components/ui/select/index.js';
	import * as SeparatorAfter from '#lib/components/ui/separator/index.js';
	import * as SwitchAfter from '#lib/components/ui/switch/index.js';
	import * as ToggleGroupAfter from '#lib/components/ui/toggle-group/index.js';
	import * as ToggleAfter from '#lib/components/ui/toggle/index.js';

	const sides = [
		{
			label: 'before (sveltekit-3 branch)',
			ui: {
				Accordion: AccordionBefore,
				Alert: AlertBefore,
				Button: ButtonBefore,
				Checkbox: CheckboxBefore,
				Dialog: DialogBefore,
				DropdownMenu: DropdownMenuBefore,
				Input: InputBefore,
				Label: LabelBefore,
				Popover: PopoverBefore,
				Select: SelectBefore,
				Separator: SeparatorBefore,
				Switch: SwitchBefore,
				Toggle: ToggleBefore,
				ToggleGroup: ToggleGroupBefore
			}
		},
		{
			label: 'after (shadcn-svelte 1.7.0)',
			ui: {
				Accordion: AccordionAfter,
				Alert: AlertAfter,
				Button: ButtonAfter,
				Checkbox: CheckboxAfter,
				Dialog: DialogAfter,
				DropdownMenu: DropdownMenuAfter,
				Input: InputAfter,
				Label: LabelAfter,
				Popover: PopoverAfter,
				Select: SelectAfter,
				Separator: SeparatorAfter,
				Switch: SwitchAfter,
				Toggle: ToggleAfter,
				ToggleGroup: ToggleGroupAfter
			}
		}
	];
	type Ui = (typeof sides)[number]['ui'];

	const sections: { title: string; render: typeof buttons }[] = [
		{ title: 'Button', render: buttons },
		{ title: 'Checkbox', render: checkboxes },
		{ title: 'Switch', render: switches },
		{ title: 'Input + Label', render: inputs },
		{ title: 'Select', render: selects },
		{ title: 'Dialog', render: dialogs },
		{ title: 'Dropdown menu', render: dropdowns },
		{ title: 'Popover', render: popovers },
		{ title: 'Accordion', render: accordions },
		{ title: 'Alert', render: alerts },
		{ title: 'Separator', render: separators },
		{ title: 'Toggle', render: toggles },
		{ title: 'Toggle group', render: toggleGroups }
	];

	const options = [
		{ value: '1', label: '1 hour' },
		{ value: '6', label: '6 hours' },
		{ value: '24', label: '24 hours' }
	];
</script>

{#snippet buttons(ui: Ui)}
	<div class="flex flex-wrap items-center gap-2">
		<ui.Button.Button>Default</ui.Button.Button>
		<ui.Button.Button variant="secondary">Secondary</ui.Button.Button>
		<ui.Button.Button variant="outline">Outline</ui.Button.Button>
		<ui.Button.Button variant="ghost">Ghost</ui.Button.Button>
		<ui.Button.Button variant="link">Link</ui.Button.Button>
		<ui.Button.Button variant="destructive">Destructive</ui.Button.Button>
		<ui.Button.Button disabled>Disabled</ui.Button.Button>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<ui.Button.Button size="sm">Small</ui.Button.Button>
		<ui.Button.Button size="default">Default</ui.Button.Button>
		<ui.Button.Button size="lg">Large</ui.Button.Button>
		<ui.Button.Button size="icon" aria-label="Search"><SearchIcon /></ui.Button.Button>
		<ui.Button.Button variant="outline"><CalendarIcon /> With icon</ui.Button.Button>
		<ui.Button.Button href="#top" variant="outline">As link</ui.Button.Button>
	</div>
	<div class="flex items-center gap-2 rounded-md bg-slate-900 p-3">
		<ui.Button.Button variant="outline-white">Outline white</ui.Button.Button>
	</div>
{/snippet}

{#snippet checkboxes(ui: Ui)}
	<div class="flex flex-wrap items-center gap-6">
		<ui.Checkbox.Checkbox aria-label="Unchecked" />
		<ui.Checkbox.Checkbox checked aria-label="Checked" />
		<ui.Checkbox.Checkbox indeterminate aria-label="Indeterminate" />
		<ui.Checkbox.Checkbox checked disabled aria-label="Disabled" />
	</div>
	<div class="group flex items-center gap-2">
		<ui.Checkbox.Checkbox
			id="site-style"
			class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-current"
			checked
		/>
		<ui.Label.Label for="site-style">Site style, as on the docs pages</ui.Label.Label>
	</div>
{/snippet}

{#snippet switches(ui: Ui)}
	<div class="flex flex-wrap items-center gap-6">
		<ui.Switch.Switch aria-label="Off" />
		<ui.Switch.Switch checked aria-label="On" />
		<ui.Switch.Switch checked disabled aria-label="Disabled" />
	</div>
{/snippet}

{#snippet inputs(ui: Ui)}
	<div class="grid max-w-sm gap-3">
		<ui.Label.Label for="name">Label</ui.Label.Label>
		<ui.Input.Input id="name" placeholder="Placeholder" />
		<ui.Input.Input value="With a value" />
		<ui.Input.Input value="Disabled" disabled />
		<ui.Input.Input type="file" />
	</div>
{/snippet}

{#snippet selects(ui: Ui)}
	<div class="grid max-w-sm gap-4">
		<div class="relative">
			<ui.Select.Root type="single" value="6">
				<ui.Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
					>6 hours</ui.Select.Trigger
				>
				<ui.Select.Content preventScroll={false} class="border-border">
					{#each options as { value, label } (value)}
						<ui.Select.Item {value}>{label}</ui.Select.Item>
					{/each}
				</ui.Select.Content>
			</ui.Select.Root>
			<ui.Label.Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
				>Forecast hours, site style</ui.Label.Label
			>
		</div>
		<ui.Select.Root type="single">
			<ui.Select.Trigger>Plain trigger</ui.Select.Trigger>
			<ui.Select.Content>
				<ui.Select.Group>
					<ui.Select.GroupHeading>Group heading</ui.Select.GroupHeading>
					{#each options as { value, label } (value)}
						<ui.Select.Item {value}>{label}</ui.Select.Item>
					{/each}
				</ui.Select.Group>
			</ui.Select.Content>
		</ui.Select.Root>
	</div>
{/snippet}

{#snippet dialogs(ui: Ui)}
	<ui.Dialog.Root>
		<ui.Dialog.Trigger
			type="button"
			class="hover:bg-accent border-border flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md border px-5"
			><SearchIcon class="size-4" /> Open dialog</ui.Dialog.Trigger
		>
		<ui.Dialog.Content>
			<ui.Dialog.Header>
				<ui.Dialog.Title>Dialog title</ui.Dialog.Title>
				<ui.Dialog.Description>Description text under the title.</ui.Dialog.Description>
			</ui.Dialog.Header>
			<p>Body content of the dialog.</p>
			<ui.Dialog.Footer>
				<ui.Button.Button variant="outline">Cancel</ui.Button.Button>
				<ui.Button.Button>Confirm</ui.Button.Button>
			</ui.Dialog.Footer>
		</ui.Dialog.Content>
	</ui.Dialog.Root>
{/snippet}

{#snippet dropdowns(ui: Ui)}
	<ui.DropdownMenu.Root>
		<ui.DropdownMenu.Trigger
			class="border-border hover:bg-accent flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-3"
			>Open menu</ui.DropdownMenu.Trigger
		>
		<ui.DropdownMenu.Content>
			<ui.DropdownMenu.Label>Label</ui.DropdownMenu.Label>
			<ui.DropdownMenu.Item
				>Item <ui.DropdownMenu.Shortcut>⌘K</ui.DropdownMenu.Shortcut></ui.DropdownMenu.Item
			>
			<ui.DropdownMenu.Item disabled>Disabled item</ui.DropdownMenu.Item>
			<ui.DropdownMenu.Separator />
			<ui.DropdownMenu.CheckboxItem checked>Checkbox item</ui.DropdownMenu.CheckboxItem>
			<ui.DropdownMenu.RadioGroup value="a">
				<ui.DropdownMenu.RadioItem value="a">Radio A</ui.DropdownMenu.RadioItem>
				<ui.DropdownMenu.RadioItem value="b">Radio B</ui.DropdownMenu.RadioItem>
			</ui.DropdownMenu.RadioGroup>
			<ui.DropdownMenu.Sub>
				<ui.DropdownMenu.SubTrigger>Sub menu</ui.DropdownMenu.SubTrigger>
				<ui.DropdownMenu.SubContent>
					<ui.DropdownMenu.Item>Sub item</ui.DropdownMenu.Item>
				</ui.DropdownMenu.SubContent>
			</ui.DropdownMenu.Sub>
		</ui.DropdownMenu.Content>
	</ui.DropdownMenu.Root>
{/snippet}

{#snippet popovers(ui: Ui)}
	<ui.Popover.Root>
		<ui.Popover.Trigger
			class="border-border hover:bg-accent flex h-10 cursor-pointer items-center rounded-md border px-3"
			>Open popover</ui.Popover.Trigger
		>
		<ui.Popover.Content>Popover content with some text.</ui.Popover.Content>
	</ui.Popover.Root>
{/snippet}

{#snippet accordions(ui: Ui)}
	<ui.Accordion.Root type="single" value="one" class="border-border rounded-lg border">
		<ui.Accordion.Item value="one" class="px-4">
			<ui.Accordion.Trigger>First item, open</ui.Accordion.Trigger>
			<ui.Accordion.Content>Content of the first item.</ui.Accordion.Content>
		</ui.Accordion.Item>
		<ui.Accordion.Item value="two" class="px-4">
			<ui.Accordion.Trigger>Second item</ui.Accordion.Trigger>
			<ui.Accordion.Content>Content of the second item.</ui.Accordion.Content>
		</ui.Accordion.Item>
	</ui.Accordion.Root>
{/snippet}

{#snippet alerts(ui: Ui)}
	<div class="grid gap-3">
		{#each ['default', 'destructive', 'warning', 'info'] as const as variant (variant)}
			<ui.Alert.Root {variant}>
				{#if variant === 'warning'}<TriangleAlertIcon />{:else}<InfoIcon />{/if}
				<ui.Alert.Title>{variant} alert</ui.Alert.Title>
				<ui.Alert.Description
					>It is recommended to select a timezone for daily data. Per default the API will use
					GMT+0.</ui.Alert.Description
				>
			</ui.Alert.Root>
		{/each}
	</div>
{/snippet}

{#snippet separators(ui: Ui)}
	<div class="max-w-sm">
		<p>Above</p>
		<ui.Separator.Separator class="my-3" />
		<div class="flex h-6 items-center gap-3">
			<span>Left</span>
			<ui.Separator.Separator orientation="vertical" />
			<span>Right</span>
		</div>
	</div>
{/snippet}

{#snippet toggles(ui: Ui)}
	<div class="flex flex-wrap items-center gap-2">
		<ui.Toggle.Toggle aria-label="Off">Off</ui.Toggle.Toggle>
		<ui.Toggle.Toggle pressed aria-label="Pressed">Pressed</ui.Toggle.Toggle>
		<ui.Toggle.Toggle variant="outline" aria-label="Outline">Outline</ui.Toggle.Toggle>
		<ui.Toggle.Toggle size="sm" aria-label="Small">Small</ui.Toggle.Toggle>
		<ui.Toggle.Toggle size="lg" aria-label="Large">Large</ui.Toggle.Toggle>
		<ui.Toggle.Toggle disabled aria-label="Disabled">Disabled</ui.Toggle.Toggle>
	</div>
{/snippet}

{#snippet toggleGroups(ui: Ui)}
	<div class="grid gap-3">
		<ui.ToggleGroup.Root type="single" value="b">
			<ui.ToggleGroup.Item value="a">A</ui.ToggleGroup.Item>
			<ui.ToggleGroup.Item value="b">B</ui.ToggleGroup.Item>
			<ui.ToggleGroup.Item value="c">C</ui.ToggleGroup.Item>
		</ui.ToggleGroup.Root>
		<ui.ToggleGroup.Root type="single" value="x" variant="outline">
			<ui.ToggleGroup.Item value="x">Outline X</ui.ToggleGroup.Item>
			<ui.ToggleGroup.Item value="y">Outline Y</ui.ToggleGroup.Item>
		</ui.ToggleGroup.Root>
	</div>
{/snippet}

<svelte:head>
	<title>Component comparison</title>
</svelte:head>

<div class="container mx-auto my-8 px-4" id="top">
	<h1 class="mb-2 text-2xl font-bold">shadcn components: before and after</h1>
	<p class="text-muted-foreground mb-8">
		Same markup and state in both columns; only the component files differ.
	</p>
	{#each sections as section (section.title)}
		<h2 class="border-border mt-10 mb-4 border-b pb-1 text-xl font-semibold">{section.title}</h2>
		<div class="grid gap-8 md:grid-cols-2">
			{#each sides as side (side.label)}
				<div class="flex flex-col gap-4">
					<div class="text-muted-foreground text-xs tracking-wide uppercase">{side.label}</div>
					{@render section.render(side.ui)}
				</div>
			{/each}
		</div>
	{/each}
</div>
