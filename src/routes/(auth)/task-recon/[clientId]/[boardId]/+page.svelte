<script lang="ts">
	import TaskList from './TaskList.svelte';
	import { invalidate } from '$app/navigation';

	export let data;

	const filterOptions = ['untracked', 'all', 'invoiced'] as const;

	let activeFilter: (typeof filterOptions)[number] = filterOptions[0];

	const toggleFilter = (filter: typeof activeFilter) => {
		activeFilter = filter;
	};

	$: ({ trelloTasks } = data);
	$: filteredTrelloTasks = trelloTasks.filter((task) => {
		if (activeFilter === 'untracked') return task.invoiceNinjaTasks.length;
		if (activeFilter === 'all') return true;
		if (activeFilter === 'invoiced')
			return task.invoiceNinjaTasks.some((inTask) => inTask.invoice_id?.length);
	});
</script>

<div class="space-y-4">
	<h3 class="h3">Tasks</h3>

	<div class="card p-8 space-y-2 flex flex-col">
		<div class="flex justify-between items-center">
			<div class="space-x-2">
				{#each filterOptions as filter}
					<span
						class="chip {activeFilter === filter ? 'variant-filled' : 'variant-soft'}"
						on:click={() => toggleFilter(filter)}
						on:keypress={() => toggleFilter(filter)}
						role="checkbox"
						aria-checked={activeFilter === filter}
						tabindex="0"
					>
						<span class="capitalize">
							{filter}
						</span>
					</span>
				{/each}
			</div>
			<div>
				{#if filteredTrelloTasks.length}Found {filteredTrelloTasks.length} of {trelloTasks.length}
					cards
				{:else}
					No cards matching filter
				{/if}
			</div>
			<button class="btn variant-ghost-surface" type="button" on:click={() => invalidate('tasks')}
				>Refresh</button
			>
		</div>
		<TaskList tasks={filteredTrelloTasks} />
	</div>
</div>
