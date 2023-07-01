<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppBar, AppShell } from '@skeletonlabs/skeleton';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { resolvePath } from '$lib/utils';
	import { page } from '$app/stores';

	export let data;

	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	const navSections: { title?: string; routes: { label: string; href: string }[] }[] = [
		{
			title: 'Billing',
			routes: [{ label: 'Task Recon.', href: '/task-recon' }]
		}
	];

	$: title = ['Icewolf Biz', $page.data.title].filter(Boolean).join(' | ');
</script>

<svelte:head><title>{title}</title></svelte:head>

<AppShell>
	<svelte:fragment slot="header">
		{#if data.session}
			<AppBar>
				<svelte:fragment slot="lead"><a href="/">Icewolf Biz</a></svelte:fragment>
				<svelte:fragment slot="trail">
					<p>Logged in as <span class="badge badge-glass">{data.session?.user.email}</span></p>
					<form method="POST" action={resolvePath('/logout')}>
						<button class="btn variant-soft-surface">Logout</button>
					</form>
				</svelte:fragment>
			</AppBar>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		{#if data.session}
			<div
				class="grid grid-rows-[1fr_auto] h-full bg-surface-50-900-token border-r border-surface-500/30 w-[280px]"
			>
				<section class="p-4 pb-20 space-y-4 overflow-y-auto">
					{#each navSections as { title, routes }}
						{#if title}
							<p class="font-bold pl-4 text-2xl">{title}</p>
						{/if}
						<nav class="list-nav space-y-2">
							<ul>
								{#each routes as { label, href }}
									<li>
										<a {href} class:bg-primary-active-token={data.pathname.startsWith(href)}
											>{label}</a
										>
									</li>
								{/each}
							</ul>
						</nav>
					{/each}
				</section>
			</div>
		{/if}
	</svelte:fragment>

	<div class="container mx-auto h-full max-w-screen-md p-4 space-y-4 pb-24">
		<slot />
	</div>
</AppShell>
