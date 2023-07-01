<script lang="ts">
	import { PUBLIC_INVOICENINJA_URL } from '$env/static/public';
	import type { Task } from '$lib/types/invoiceninja/task';
	import type { Card } from '$lib/types/trello/card';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let tasks: (Card & { invoiceNinjaTasks: Task[] })[];

	const createInvoiceNinjaPopupConfig = (id: string): PopupSettings => ({
		event: 'focus-click',
		target: `invoiceninjaTaskLink-${id}`,
		placement: 'top'
	});
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
			<footer class="card-footer flex flex-1 justify-evenly gap-4 items-center">
				<a
					class="btn w-full variant-ringed-surface"
					target="_blank"
					rel="noopener noreferrer"
					href={shortUrl}>Open in Trello</a
				>

				{#if invoiceNinjaTasks.length === 1}
					<a
						class="btn w-full variant-ringed-surface"
						href="{PUBLIC_INVOICENINJA_URL}/#/tasks/{invoiceNinjaTasks[0].id}/edit"
						rel="noopener noreferrer"
						target="_blank">Open in InvoiceNinja</a
					>
				{:else if invoiceNinjaTasks.length}
					{@const popupConfig = createInvoiceNinjaPopupConfig(id)}
					<button class="btn w-full variant-ringed-surface" use:popup={popupConfig}
						>Open in InvoiceNinja</button
					>
					<div class="card w-48 shadow-xl py-2" data-popup={popupConfig.target}>
						<div class="list-nav">
							<ul>
								{#each invoiceNinjaTasks as { id, number, project } (id)}
									<li>
										<a
											class="btn w-full variant-glass-surface"
											href="{PUBLIC_INVOICENINJA_URL}/#/tasks/{id}/edit"
											rel="noopener noreferrer"
											target="_blank">{[project?.name, number].filter(Boolean).join(' - ')}</a
										>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/if}
			</footer>
		</div>
	{/each}
</div>
