<script lang="ts">
	import TaskList from './TaskList.svelte';
	import { invalidate } from '$app/navigation';
	import { filterOptions } from './shared.js';
	import { fly } from 'svelte/transition';

	export let data;

	$: ({ activeFilter } = data);
	$: ({ trelloTasks } = data);
</script>

<div class="space-y-4">
	<h3 class="h3">Tasks</h3>

	<div class="card p-8 variant-outline-surface space-y-2 flex flex-col">
		<div class="flex justify-between items-center">
			<div class="space-x-2">
				{#each Object.values(filterOptions.Values) as filter}
					<a
						class="chip {activeFilter === filter ? 'variant-filled' : 'variant-soft'}"
						href="?filter={filter}"
					>
						<span class="capitalize">
							{filter}
						</span>
					</a>
				{/each}
			</div>
			<div>
				{#if trelloTasks.length}Found {trelloTasks.length} of {trelloTasks.length}
					cards
				{:else}
					No cards matching filter
				{/if}
			</div>
			<button class="btn variant-ghost-surface" type="button" on:click={() => invalidate('tasks')}
				>Refresh</button
			>
		</div>
		{#key activeFilter}
			<div in:fly={{ y: -50, duration: 300, delay: 300 }} out:fly={{ y: 50, duration: 300 }}>
				<TaskList tasks={trelloTasks} />
			</div>
		{/key}
	</div>
</div>
