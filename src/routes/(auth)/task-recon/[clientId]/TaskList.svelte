<script lang="ts">
	import type { Task } from '$lib/types/invoiceninja/task';
	import type { Card } from '$lib/types/trello/card';

	export let tasks: (Card & { invoiceNinjaTasks: Task[] })[];
</script>

<div class="flex flex-col gap-4">
	{#each tasks as { id, name, shortUrl, dateLastActivity, invoiceNinjaTasks } (id)}
		<div class="card space-y-2 variant-glass-surface">
			<header class="card-header whitespace-break-spaces flex justify-between">
				<div>
					<span class="text-xl">{name}</span>
				</div>
				<div>
					<span class="badge variant-glass-surface">{dateLastActivity}</span>
					{#each invoiceNinjaTasks ?? [] as inTask (inTask.id)}
						{#if inTask.invoice_id}
							<span class="badge variant-glass-secondary">Invoiced {dateLastActivity}</span>
						{/if}
					{/each}
				</div>
			</header>
			<footer class="card-footer flex flex-col justify-between items-center">
				<div class="w-full">
					<a
						class="btn btn-sm w-full variant-ringed-surface"
						target="_blank"
						rel="noopener noreferrer"
						href={shortUrl}>Open in Trello</a
					>
				</div>
			</footer>
		</div>
	{/each}
</div>
