<script lang="ts">
	import { untrack } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { pad } from '$lib/utils';

	import { Button } from '$lib/components/ui/button';

	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import { defaultParameters } from './options';
	import { pythonInstallCode } from './python-install-code';
	import { pythonPreviewCodeExample } from './python-preview-code-example';

	let d = new SvelteDate();
	d.setUTCDate(d.getUTCDate() - 1);
	d.setUTCHours(0);
	d.setUTCMinutes(0);
	d.setUTCSeconds(0);
	d.setUTCMilliseconds(0);

	const defaultRun = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;

	/** Convert ISO run param (e.g. "2026-05-14T0000") to S3 path segment (e.g. "2026/05/14/0000Z") */
	const runToS3Path = (run: string): string => {
		const [date, time] = run.split('T');
		const [y, m, d] = date.split('-');
		return `${y}/${m}/${d}/${time}Z`;
	};

	/** Convert S3 path segment (e.g. "2026/05/14/0000Z") to ISO run param (e.g. "2026-05-14T0000") */
	const s3PathToRun = (path: string): string => {
		const [y, m, d, time] = path.split('/');
		return `${y}-${m}-${d}T${time.replace('Z', '')}`;
	};

	const params = urlHashStore({
		...defaultParameters,
		latitude: [52.52],
		longitude: [13.41],
		domain: 'ecmwf_ifs',
		run: defaultRun,
		variables: ['temperature_2m'],
		use_aws_endpoint: true
	});

	let endpoint = $derived(
		$params.use_aws_endpoint
			? 'https://openmeteo.s3.amazonaws.com'
			: 'https://s3.open-meteo.com/openmeteo'
	);

	const listPrefixes = async (prefix: string, ep: string): Promise<string[]> => {
		const encoded = prefix.replaceAll('/', '%2F');
		const res = await fetch(`${ep}/?list-type=2&delimiter=%2F&prefix=${encoded}`);
		const xml = await res.text();
		return [...xml.matchAll(/<Prefix>([^<]+)<\/Prefix>/g)]
			.map((m) => m[1])
			.filter((p) => p !== prefix);
	};

	type S3ObjectMeta = { size?: number; lastModified?: string };

	const formatFileSize = (bytes?: number): string => {
		if (bytes == null) return '';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
	};

	const formatLastModified = (iso?: string): string => {
		if (!iso) return '';
		const dt = new Date(iso);
		const y = dt.getUTCFullYear();
		const mo = String(dt.getUTCMonth() + 1).padStart(2, '0');
		const d = String(dt.getUTCDate()).padStart(2, '0');
		const hh = String(dt.getUTCHours()).padStart(2, '0');
		const mm = String(dt.getUTCMinutes()).padStart(2, '0');
		return `${y}-${mo}-${d} ${hh}:${mm} UTC`;
	};

	const listAllKeysWithMeta = async (
		prefix: string,
		ep: string
	): Promise<{ key: string; meta: S3ObjectMeta }[]> => {
		const objects: { key: string; meta: S3ObjectMeta }[] = [];
		let token: string | undefined;
		do {
			const encoded = prefix.replaceAll('/', '%2F');
			const tokenParam = token ? `&continuation-token=${encodeURIComponent(token)}` : '';
			const res = await fetch(`${ep}/?list-type=2&prefix=${encoded}${tokenParam}`);
			const xml = await res.text();
			for (const match of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
				const block = match[1];
				const key = block.match(/<Key>([^<]+)<\/Key>/)?.[1];
				const sizeStr = block.match(/<Size>([^<]+)<\/Size>/)?.[1];
				const lastModified = block.match(/<LastModified>([^<]+)<\/LastModified>/)?.[1];
				if (key)
					objects.push({
						key,
						meta: { size: sizeStr ? parseInt(sizeStr, 10) : undefined, lastModified }
					});
			}
			token = xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)?.[1];
		} while (token);
		return objects;
	};

	const loadModels = async (ep: string): Promise<string[]> => {
		try {
			const modelPrefixes = await listPrefixes('data_run/', ep);
			return modelPrefixes.map((p) => p.slice('data_run/'.length, -1));
		} catch (error) {
			console.error('Error fetching models:', error);
			return [];
		}
	};

	const popularDomains: { id: string; label: string }[] = [
		{ id: 'ecmwf_ifs', label: 'ECMWF IFS HRES' },
		{ id: 'dwd_icon', label: 'DWD ICON Global' },
		{ id: 'ncep_gfs013', label: 'GFS Global' }
	];

	let modelsPromise = $derived(loadModels(endpoint));

	type RunEntry = { name: string };
	type DayEntry = { day: string; expanded: boolean; runs: RunEntry[] | null; loading: boolean };
	type MonthEntry = {
		name: string;
		expanded: boolean;
		days: DayEntry[] | null;
		loading: boolean;
	};
	type YearEntry = {
		name: string;
		expanded: boolean;
		months: MonthEntry[] | null;
		loading: boolean;
	};
	type DomainTree = {
		domain: string;
		endpoint: string;
		years: YearEntry[] | null;
		loading: boolean;
		error: string | null;
	};

	let modelTree = $state<DomainTree>({
		domain: '',
		endpoint: '',
		years: null,
		loading: false,
		error: null
	});

	let selectedRun = $derived.by<string>(() => {
		const run = $params.run as string | undefined;
		if (!run) return defaultRun;
		return run;
	});

	/** Safely coerce a URL hash param that may be a string or string[] into string[] */
	const toStringArray = (v: unknown): string[] =>
		Array.isArray(v) ? v.map(String) : v != null ? [String(v)] : [];

	let selectedVariables = $derived.by<string[]>(() => {
		const chosen = toStringArray($params.variables);
		const available = variablesState.variables;
		// If the variables for this run have loaded, filter to only valid ones
		if (available) return chosen.filter((v) => available.includes(v));
		return chosen;
	});

	type VariablesState = {
		run: string;
		variables: string[] | null;
		meta: Record<string, S3ObjectMeta>;
		loading: boolean;
		error: string | null;
	};

	let variablesState = $state<VariablesState>({
		run: '',
		variables: null,
		meta: {},
		loading: false,
		error: null
	});

	type VariableTooltip = { filename: string; size: string; modified: string };

	const variableTooltip = (variable: string): VariableTooltip | null => {
		const m = variablesState.meta[variable];
		if (!m || (m.size == null && !m.lastModified)) return null;
		return {
			filename: variable + '.om',
			size: m.size != null ? formatFileSize(m.size) : '',
			modified: m.lastModified ? formatLastModified(m.lastModified) : ''
		};
	};

	let hoveredTooltip = $state<VariableTooltip | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	let _varKey = '';
	let _treeKey = '';

	async function loadMonthsForYear(year: YearEntry, domain: string, ep: string) {
		year.loading = true;
		const prefix = `data_run/${domain}/${year.name}/`;
		try {
			const monthPrefixes = await listPrefixes(prefix, ep);
			year.months = monthPrefixes
				.map((p) => ({
					name: p.slice(prefix.length, -1),
					expanded: false,
					days: null,
					loading: false
				}))
				.sort((a, b) => b.name.localeCompare(a.name));
		} catch (e) {
			console.error('Error fetching months:', e);
			year.months = [];
		} finally {
			year.loading = false;
		}
	}

	$effect(() => {
		const domain = $params.domain;
		const ep = endpoint;
		if (!domain) return;
		const key = `${ep}::${domain}`;
		if (key === _treeKey) return;
		_treeKey = key;

		// Read $params.run without subscribing — we write to it inside the async callback
		// and don't want the write to re-trigger this effect.
		const restoreRun = untrack(() => $params.run as string | undefined);

		// Reset tree state only — do NOT touch $params.run / $params.variables here.
		// Writing undefined to params before we know whether the run exists in the new
		// domain would encode "&run=undefined" into the URL.
		modelTree = { domain, endpoint: ep, years: null, loading: true, error: null };

		listPrefixes(`data_run/${domain}/`, ep)
			.then(async (yearPrefixes) => {
				if (_treeKey !== key) return;
				const years: YearEntry[] = yearPrefixes
					.map((p) => ({
						name: p.slice(`data_run/${domain}/`.length, -1),
						expanded: false,
						months: null,
						loading: false
					}))
					.sort((a, b) => b.name.localeCompare(a.name));
				modelTree = { domain, endpoint: ep, years, loading: false, error: null };

				const target = restoreRun ?? defaultRun;
				const [ry, rm, rd, rrun] = runToS3Path(target).split('/');

				// IMPORTANT: access entries through modelTree.years! (the reactive proxy),
				// not the local `years` variable (plain object). Svelte 5 only fires signals
				// when mutations go through the proxy; mutating the original object silently
				// changes the data but the template never re-renders.
				const yearEntry = modelTree.years!.find((y) => y.name === ry);
				if (!yearEntry) return;
				yearEntry.expanded = true;
				await loadMonthsForYear(yearEntry, domain, ep);
				if (_treeKey !== key) return;

				const monthEntry = yearEntry.months?.find((m) => m.name === rm);
				if (!monthEntry) return;
				monthEntry.expanded = true;
				await loadDaysForMonth(yearEntry, monthEntry, domain, ep);
				if (_treeKey !== key) return;

				const dayEntry = monthEntry.days?.find((d) => d.day === rd);
				if (!dayEntry) return;
				dayEntry.expanded = true;
				await loadRunsForDay(yearEntry, monthEntry, dayEntry, domain, ep);
				if (_treeKey !== key) return;

				// Only update params if the target run doesn't exist in this domain
				// (e.g. switching from a domain that has 00Z to one that only has 06Z).
				const runFound = dayEntry.runs?.some((r) => r.name === rrun);
				if (!runFound) {
					const firstRun = dayEntry.runs?.[0];
					if (firstRun) {
						$params.run = s3PathToRun(`${ry}/${rm}/${rd}/${firstRun.name}`);
					}
				}
			})
			.catch((e) => {
				if (_treeKey !== key) return;
				modelTree = { domain, endpoint: ep, years: null, loading: false, error: String(e) };
			});
	});

	async function toggleYear(year: YearEntry) {
		if (year.expanded) {
			year.expanded = false;
			return;
		}
		year.expanded = true;
		if (year.months !== null) return;
		await loadMonthsForYear(year, modelTree.domain, modelTree.endpoint);
	}

	async function loadDaysForMonth(year: YearEntry, month: MonthEntry, domain: string, ep: string) {
		if (month.days !== null) return;
		month.loading = true;
		const monthPrefix = `data_run/${domain}/${year.name}/${month.name}/`;
		try {
			const dayPrefixes = await listPrefixes(monthPrefix, ep);
			month.days = dayPrefixes
				.map((p) => ({
					day: p.slice(monthPrefix.length, -1),
					expanded: false,
					runs: null,
					loading: false
				}))
				.sort((a, b) => b.day.localeCompare(a.day));
		} catch (e) {
			console.error('Error fetching days:', e);
			month.days = [];
		} finally {
			month.loading = false;
		}
	}

	async function loadRunsForDay(
		year: YearEntry,
		month: MonthEntry,
		day: DayEntry,
		domain: string,
		ep: string
	) {
		if (day.runs !== null) return;
		day.loading = true;
		const dayPrefix = `data_run/${domain}/${year.name}/${month.name}/${day.day}/`;
		try {
			const runPrefixes = await listPrefixes(dayPrefix, ep);
			day.runs = runPrefixes.map((p) => ({ name: p.slice(dayPrefix.length, -1) }));
		} catch (e) {
			console.error('Error fetching runs:', e);
			day.runs = [];
		} finally {
			day.loading = false;
		}
	}

	async function toggleMonth(year: YearEntry, month: MonthEntry) {
		if (month.expanded) {
			month.expanded = false;
			return;
		}
		month.expanded = true;
		await loadDaysForMonth(year, month, modelTree.domain, modelTree.endpoint);
	}

	async function toggleDay(year: YearEntry, month: MonthEntry, day: DayEntry) {
		if (day.expanded) {
			day.expanded = false;
			return;
		}
		day.expanded = true;
		await loadRunsForDay(year, month, day, modelTree.domain, modelTree.endpoint);
	}

	$effect(() => {
		const run = selectedRun;
		const domain = $params.domain;
		const ep = endpoint;
		if (!run || !domain) return;
		const key = `${ep}::${domain}::${run}`;
		if (key === _varKey) return;
		_varKey = key;
		variablesState = { run, variables: null, meta: {}, loading: true, error: null };
		const runPrefix = `data_run/${domain}/${runToS3Path(run)}/`;
		listAllKeysWithMeta(runPrefix, ep)
			.then((objects) => {
				if (_varKey !== key) return;
				const entries = objects
					.map(({ key: k, meta }) => {
						const filename = k.slice(runPrefix.length);
						if (!filename || filename === 'meta.json' || filename.includes('/')) return null;
						const name = filename.endsWith('.om') ? filename.slice(0, -3) : filename;
						return { name, meta };
					})
					.filter((x): x is { name: string; meta: S3ObjectMeta } => x !== null)
					.sort((a, b) => a.name.localeCompare(b.name));
				const variables = entries.map((x) => x.name);
				const meta: Record<string, S3ObjectMeta> = {};
				for (const { name, meta: m } of entries) meta[name] = m;
				variablesState = { run, variables, meta, loading: false, error: null };
				// Remove selected variables that are not available in this run
				const currentVars = toStringArray($params.variables);
				const filtered = currentVars.filter((v) => variables.includes(v));
				if (filtered.length !== currentVars.length) {
					$params.variables = filtered;
				}
			})
			.catch((e) => {
				if (_varKey !== key) return;
				variablesState = { run, variables: null, meta: {}, loading: false, error: String(e) };
			});
	});

	let codeInstallCopied = $state(false);
	let codeExampleCopied = $state(false);
	let variablesScrollEl = $state<HTMLElement | null>(null);

	$effect(() => {
		const vars = variablesState.variables;
		const el = variablesScrollEl;
		if (!vars || !el) return;
		const target = selectedVariables[0] ?? vars[0];
		if (!target) return;
		if (selectedVariables && selectedVariables.length > 1) return;
		requestAnimationFrame(() => {
			const btn = el.querySelector(`[data-variable='${target}']`);
			btn?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
		});
	});
</script>

<div>
	<LocationSelection bind:params={$params} />

	<div class="mt-3 md:mt-6 flex gap-3 flex-col">
		<a href="#endpoint">
			<h2 id="endpoint" class="text-2xl md:text-3xl">Endpoint</h2>
		</a>
		<div class="gap-3 md:gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
			<div
				class="flex flex-col gap-0.5 rounded-lg border px-3 py-2 transition-all duration-300 cursor-pointer select-none
					{$params.use_aws_endpoint
					? 'border-primary bg-primary/5 scale-103 shadow-sm'
					: 'border-border text-muted-foreground scale-100'}"
				role="button"
				tabindex="0"
				onclick={() => {
					$params.use_aws_endpoint = true;
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') $params.use_aws_endpoint = true;
				}}
			>
				<span class="font-medium text-sm">Open-Meteo AWS Open Data</span>
				<span class="text-xs">Last 3 months of forecast data only</span>
				<code class="text-xs mt-1 opacity-70">https://openmeteo.s3.amazonaws.com</code>
			</div>
			<div
				class=" flex flex-col gap-0.5 rounded-lg border px-3 py-2 transition-all duration-300 cursor-pointer select-none
					{!$params.use_aws_endpoint
					? 'border-primary bg-primary/5 scale-103 shadow-sm'
					: 'border-border text-muted-foreground scale-100'}"
				role="button"
				tabindex="0"
				onclick={() => {
					$params.use_aws_endpoint = false;
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') $params.use_aws_endpoint = false;
				}}
			>
				<span class="font-medium text-sm">Open-Meteo S3</span>
				<span class="text-xs">Full history available</span>
				<code class="text-xs mt-1 opacity-70">https://s3.open-meteo.com/openmeteo/</code>
			</div>
		</div>
	</div>

	<div class="mt-3 md:mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3 2xl:grid-cols-4 md:gap-6">
		<div class="flex flex-col gap-3">
			<a href="#models">
				<h2 id="models" class="text-2xl md:text-3xl">Domains</h2>
			</a>
			<div class="relative">
				{#await modelsPromise}
					<div class="border border-border rounded-lg overflow-hidden w-full">
						<div
							class="bg-muted px-3 py-2.25 text-xs border-b border-border text-muted-foreground font-medium"
						>
							Popular
						</div>
						<div class="font-mono text-xs border-b border-border py-2">
							{#each [{ w: 52, lw: 36 }, { w: 40, lw: 44 }, { w: 44, lw: 32 }] as row (row.w)}
								<div class="flex items-center justify-between px-3 py-0.5">
									<div
										class="h-4 rounded animate-pulse bg-muted-foreground/20"
										style="width: {row.w}%"
									></div>
									<div
										class="h-4 rounded animate-pulse bg-muted-foreground/20 ml-3 shrink-0"
										style="width: {row.lw}%"
									></div>
								</div>
							{/each}
						</div>
						<div
							class="bg-muted px-3 py-2.25 text-xs border-b border-border text-muted-foreground font-medium"
						>
							All domains
						</div>
						<div class="overflow-y-auto min-h-68 font-mono text-xs py-2">
							{#each [60, 48, 72, 56, 64, 52, 68] as w (w)}
								<div class="px-3 py-0.5">
									<div
										class="h-4 rounded animate-pulse bg-muted-foreground/20"
										style="width: {w}%"
									></div>
								</div>
							{/each}
						</div>
					</div>
				{:then models}
					<div class="border border-border rounded-lg overflow-hidden w-full">
						<div
							class="bg-muted px-3 py-2.25 text-xs border-b border-border text-muted-foreground font-medium"
						>
							Popular
						</div>
						<div class="font-mono text-xs border-b border-border py-2">
							{#each popularDomains as { id, label } (id)}
								<button
									class="cursor-pointer w-full px-3 py-0.5 text-left flex items-center justify-between {$params.domain ===
									id
										? 'text-primary bg-primary/10 font-bold'
										: 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
									onclick={() => {
										$params.domain = id;
									}}
								>
									<span>{id}</span>
									<span
										class="text-xs {$params.domain !== id
											? 'opacity-60'
											: 'opacity-80'} ml-3 shrink-0">{label}</span
									>
								</button>
							{/each}
						</div>
						<div
							class="bg-muted px-3 py-2.25 text-xs border-b border-border text-muted-foreground font-medium"
						>
							All domains
						</div>
						<div class="overflow-y-auto max-h-68 font-mono text-xs py-2">
							{#each models as domain (domain)}
								<button
									class="cursor-pointer w-full px-3 py-0.5 text-left {$params.domain === domain
										? 'text-primary bg-primary/10 font-bold'
										: 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
									onclick={() => {
										$params.domain = domain;
									}}
								>
									{domain}
								</button>
							{/each}
						</div>
					</div>
				{/await}
			</div>
		</div>
		<div class="flex flex-col gap-3">
			<a href="#model-runs">
				<h2 id="model-runs" class="text-2xl md:text-3xl">Model Runs</h2>
			</a>
			<div class="relative">
				{#await modelsPromise}
					<div class="border border-border rounded-lg overflow-hidden w-full">
						<div class="bg-muted px-3 pb-2 pt-2.5 border-b border-border">
							<div class="h-3 w-48 rounded animate-pulse bg-muted-foreground/20"></div>
						</div>
						<div class="p-3 flex flex-col gap-2">
							{#each [72, 56, 64, 48] as w (w)}
								<div
									class="h-4 rounded animate-pulse bg-muted-foreground/20"
									style="width: {w}%"
								></div>
							{/each}
						</div>
					</div>
				{:then}
					{#if $params.domain}
						<div class="border border-border rounded-lg overflow-hidden w-full">
							<a
								href={`${endpoint}/index.html#data_run/${$params.domain}/`}
								target="_blank"
								class="bg-muted px-3 pb-2 pt-2.5 text-xs font-mono border-b border-border flex items-center gap-1 text-muted-foreground sticky top-0"
							>
								<span>openmeteo</span>
								<span class="opacity-50">/</span>
								<span>data_run</span>
								<span class="opacity-50">/</span>
								<span class="text-foreground font-semibold">{$params.domain}</span>
								<span class="opacity-50">/</span>
							</a>
							<div class="overflow-y-auto max-h-96 font-mono text-xs py-2">
								{#if modelTree.loading}
									<div class="px-3 py-4 text-muted-foreground">Loading...</div>
								{:else if modelTree.error}
									<div class="px-3 py-4 text-destructive">{modelTree.error}</div>
								{:else if modelTree.years}
									{#if modelTree.years.length === 0}
										<div class="px-3 py-4 text-muted-foreground italic">No data found</div>
									{/if}
									{#each modelTree.years as year (year.name)}
										<button
											class="w-full cursor-pointer flex items-center gap-1.5 px-3 py-1 text-left hover:bg-muted"
											onclick={() => toggleYear(year)}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="shrink-0 transition-transform {year.expanded ? 'rotate-90' : ''}"
												><path d="m9 18 6-6-6-6" /></svg
											>
											{#if year.expanded}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="shrink-0 text-foreground mb-0.5"
													><path
														d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"
													/></svg
												>
											{:else}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="shrink-0 text-foreground mb-0.5"
													><path
														d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
													/></svg
												>
											{/if}
											<span class="text-foreground">{year.name}/</span>
											{#if year.loading}
												<span class="text-muted-foreground ml-1">...</span>
											{/if}
										</button>
										{#if year.expanded}
											<div transition:slide={{ duration: 150 }}>
												{#if year.loading || year.months === null}
													<div class="pl-8 pr-3 py-1 text-muted-foreground">...</div>
												{:else}
													{#each year.months as month (month.name)}
														<button
															class="w-full cursor-pointer flex items-center gap-1.5 pl-8 pr-3 py-1 text-left hover:bg-muted"
															onclick={() => toggleMonth(year, month)}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="12"
																height="12"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																stroke-width="2"
																stroke-linecap="round"
																stroke-linejoin="round"
																class="shrink-0 transition-transform {month.expanded
																	? 'rotate-90'
																	: ''}"><path d="m9 18 6-6-6-6" /></svg
															>
															{#if month.expanded}
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="12"
																	height="12"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	class="shrink-0 text-foreground mb-0.5"
																	><path
																		d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"
																	/></svg
																>
															{:else}
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="12"
																	height="12"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	class="shrink-0 text-foreground mb-0.5"
																	><path
																		d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
																	/></svg
																>
															{/if}
															<span class="text-foreground">{month.name}/</span>
															{#if month.loading}
																<span class="text-muted-foreground ml-1">...</span>
															{/if}
														</button>
														{#if month.expanded}
															<div transition:slide={{ duration: 150 }}>
																{#if month.loading || month.days === null}
																	<div class="pl-14 pr-3 py-1 text-muted-foreground">...</div>
																{:else if month.days.length === 0}
																	<div class="pl-14 pr-3 py-1 text-muted-foreground italic">
																		empty
																	</div>
																{:else}
																	{#each month.days as day (day.day)}
																		<button
																			class="w-full cursor-pointer flex items-center gap-1.5 pl-14 pr-3 py-1 text-left hover:bg-muted"
																			onclick={() => toggleDay(year, month, day)}
																		>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				width="12"
																				height="12"
																				viewBox="0 0 24 24"
																				fill="none"
																				stroke="currentColor"
																				stroke-width="2"
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				class="shrink-0 transition-transform {day.expanded
																					? 'rotate-90'
																					: ''}"><path d="m9 18 6-6-6-6" /></svg
																			>
																			{#if day.expanded}
																				<svg
																					xmlns="http://www.w3.org/2000/svg"
																					width="12"
																					height="12"
																					viewBox="0 0 24 24"
																					fill="none"
																					stroke="currentColor"
																					stroke-width="2"
																					stroke-linecap="round"
																					stroke-linejoin="round"
																					class="shrink-0 text-foreground mb-0.5"
																					><path
																						d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"
																					/></svg
																				>
																			{:else}
																				<svg
																					xmlns="http://www.w3.org/2000/svg"
																					width="12"
																					height="12"
																					viewBox="0 0 24 24"
																					fill="none"
																					stroke="currentColor"
																					stroke-width="2"
																					stroke-linecap="round"
																					stroke-linejoin="round"
																					class="shrink-0 text-foreground mb-0.5"
																					><path
																						d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
																					/></svg
																				>
																			{/if}
																			<span class="text-foreground">{day.day}/</span>
																			{#if day.loading}
																				<span class="text-muted-foreground ml-1">...</span>
																			{/if}
																		</button>
																		{#if day.expanded}
																			<div transition:slide={{ duration: 150 }}>
																				{#if day.loading || day.runs === null}
																					<div class="pl-20 pr-3 py-1 text-muted-foreground">
																						...
																					</div>
																				{:else if day.runs.length === 0}
																					<div class="pl-20 pr-3 py-1 text-muted-foreground italic">
																						empty
																					</div>
																				{:else}
																					{#each day.runs as run (run.name)}
																						{@const runString = `${year.name}/${month.name}/${day.day}/${run.name}`}
																						{@const runIso = s3PathToRun(runString)}
																						<button
																							class="cursor-pointer w-full pl-20 pr-3 py-0.5 text-left font-mono text-xs {selectedRun ===
																							runIso
																								? 'text-primary bg-primary/10 font-bold'
																								: 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
																							onclick={() => {
																								$params.run = runIso;
																							}}
																						>
																							{runString}
																						</button>
																					{/each}
																				{/if}
																			</div>
																		{/if}
																	{/each}
																{/if}
															</div>
														{/if}
													{/each}
												{/if}
											</div>
										{/if}
									{/each}
								{/if}
							</div>
						</div>
					{/if}
				{/await}
			</div>
		</div>
		<div class="flex flex-col gap-3">
			<a href="#variables">
				<h2 id="variables" class="text-2xl md:text-3xl">Variables</h2>
			</a>
			<div class="relative">
				{#await modelsPromise}
					<div class="border border-border rounded-lg overflow-hidden w-full">
						<div class="bg-muted px-3 pb-2 pt-2.5 border-b border-border">
							<div class="h-3 w-48 rounded animate-pulse bg-muted-foreground/20"></div>
						</div>
						<div class="p-3 flex flex-col gap-2">
							{#each [80, 60, 70, 50, 65] as w (w)}
								<div
									class="h-4 rounded animate-pulse bg-muted-foreground/20"
									style="width: {w}%"
								></div>
							{/each}
						</div>
					</div>
				{:then}
					{#if !selectedRun || !$params.domain}
						<div class="text-muted-foreground text-sm italic">
							Select a model run to view variables
						</div>
					{:else}
						<div
							transition:slide={{ duration: 200 }}
							class="border border-border rounded-lg overflow-hidden w-full"
						>
							<a
								href={`${endpoint}/index.html#data_run/${$params.domain}/${selectedRun}/`}
								target="_blank"
								class="bg-muted px-3 pb-2 pt-2.5 text-xs font-mono border-b border-border flex items-center gap-1 text-muted-foreground sticky top-0"
							>
								<span class="text-foreground font-semibold">{selectedRun}</span>
							</a>
							<div
								class="overflow-y-auto max-h-96 font-mono text-xs py-2"
								bind:this={variablesScrollEl}
							>
								{#if variablesState.loading}
									<div class="px-3 py-4 text-muted-foreground">Loading...</div>
								{:else if variablesState.error}
									<div class="px-3 py-4 text-destructive">{variablesState.error}</div>
								{:else if variablesState.variables && variablesState.variables.length === 0}
									<div class="px-3 py-4 text-muted-foreground italic">No variables found</div>
								{:else if variablesState.variables}
									<div transition:slide={{ duration: 200 }}>
										{#each variablesState.variables ?? [] as variable (variable)}
											<button
												data-variable={variable}
												class="cursor-pointer flex w-full px-3 py-0.5 {selectedVariables.includes(
													variable
												)
													? 'text-primary bg-primary/10 font-bold'
													: 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
												onmouseenter={(e) => {
													hoveredTooltip = variableTooltip(variable);
													tooltipX = e.clientX;
													tooltipY = e.clientY;
												}}
												onmousemove={(e) => {
													tooltipX = e.clientX;
													tooltipY = e.clientY;
												}}
												onmouseleave={() => {
													hoveredTooltip = null;
												}}
												onclick={() => {
													const cur = toStringArray($params.variables);
													$params.variables = cur.includes(variable)
														? cur.filter((v) => v !== variable)
														: [...cur, variable];
												}}
											>
												{variable}
											</button>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/if}
				{/await}
			</div>
		</div>
	</div>

	<div class="mt-3 md:mt-6 flex gap-3 flex-col">
		<a href="#python-preview">
			<h2 id="python-preview" class="text-2xl md:text-3xl">Python preview</h2>
		</a>
		<div>
			<p>
				The sample code automatically applies all the parameters selected above. You can find
				further details and examples in the <a href="https://pypi.org/project/omfiles/"
					>Python OMFiles</a
				> documentation.
			</p>
			<h4 class="text-xl md:text-2xl">Install</h4>
			<div
				class="code-install group relative -mx-6 my-2 overflow-auto rounded-lg bg-[#FAFAFA] md:my-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
			>
				{@html pythonInstallCode}
				<div
					class="absolute duration-300 right-2 top-2 lg:right-4 lg:top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
				>
					<Button
						onclick={() => {
							const query = document.querySelector('.code-install pre');
							if (query) {
								navigator.clipboard.writeText(query.textContent ?? '').catch(() => {});
								codeInstallCopied = true;
								setTimeout(() => {
									codeInstallCopied = false;
								}, 1250);
							}
						}}
						>{#if codeInstallCopied}<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
							>{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
								><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
									d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
								/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
									d="m15 10-4 4 4 4"
								/></svg
							>{/if}</Button
					>
				</div>
			</div>
		</div>
		<div>
			<h4 class="text-xl md:text-2xl">Usage</h4>
			<div
				class="code-example relative group -mx-6 my-2 overflow-auto rounded-lg bg-[#FAFAFA] md:my-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
			>
				{@html pythonPreviewCodeExample($params)}
				<div
					class="absolute duration-300 right-2 top-2 lg:right-4 lg:top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
				>
					<Button
						onclick={() => {
							const query = document.querySelector('.code-example pre');
							if (query) {
								navigator.clipboard.writeText(query.textContent ?? '').catch(() => {});
								codeExampleCopied = true;
								setTimeout(() => {
									codeExampleCopied = false;
								}, 1250);
							}
						}}
						>{#if codeExampleCopied}<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
							>{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
								><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
									d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
								/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
									d="m15 10-4 4 4 4"
								/></svg
							>{/if}</Button
					>
				</div>
			</div>
		</div>
	</div>

	{#if hoveredTooltip}
		<div
			class="pointer-events-none fixed z-50 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md"
			style="left: {tooltipX + 14}px; top: {tooltipY + 14}px;"
		>
			<div class="font-bold font-mono">{hoveredTooltip.filename}</div>
			{#if hoveredTooltip.size}
				<div class="text-muted-foreground mt-0.5">Size: {hoveredTooltip.size}</div>
			{/if}
			{#if hoveredTooltip.modified}
				<div class="text-muted-foreground">Modified: {hoveredTooltip.modified}</div>
			{/if}
		</div>
	{/if}
</div>
