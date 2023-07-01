<script lang="ts">
	import TaskList from './TaskList.svelte';
	import { invalidate } from '$app/navigation';
	import { filterOptions } from './shared.js';
	import { fly } from 'svelte/transition';

	export let data;

	$: ({ activeFilter, trelloTasks, totalTasks } = data);
</script>

<div class="space-y-4">
	<h3 class="h3">Tasks</h3>

	<div class="space-y-2 flex flex-col">
		<div
			class="rounded-md bg-surface-700 px-4 py-2 flex justify-between items-center sticky top-1 z-50 shadow-lg"
		>
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
				{#if trelloTasks.length}Found {trelloTasks.length} of {totalTasks}
					cards
				{:else}
					No cards matching filter
				{/if}
			</div>
			<button class="btn variant-ringed-surface" type="button" on:click={() => invalidate('tasks')}
				>♻ Refresh</button
			>
		</div>
		{#key activeFilter}
			<div in:fly={{ y: -50, duration: 300, delay: 300 }} out:fly={{ y: 50, duration: 300 }}>
				<TaskList tasks={trelloTasks} />
			</div>
		{/key}
	</div>
</div>
