<script lang="ts">
	import { PUBLIC_INVOICENINJA_URL } from '$env/static/public';
	import type { Task } from '$lib/types/invoiceninja/task';
	import type { Card } from '$lib/types/trello/card';
	import { clipboard, popup, type PopupSettings } from '@skeletonlabs/skeleton';

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
			<header class="card-header whitespace-break-spaces flex justify-between gap-4 items-center">
				<div class="flex items-center justify-between gap-2 w-full">
					<span class="text-xl">{name}</span>
					<div>
						<button
							type="button"
							class="btn-icon btn-icon-sm variant-glass-surface"
							use:clipboard={name}>📋</button
						>
					</div>
				</div>
				<span class="badge variant-glass-surface">{dateLastActivity}</span>
			</header>
			<footer class="card-footer flex flex-1 justify-evenly gap-4 items-center">
				<div class="btn-group variant-ringed-surface w-full">
					<a class="w-full" target="_blank" rel="noopener noreferrer" href={shortUrl}
						>Open in Trello</a
					>
					<button type="button" class="w-full" use:clipboard={shortUrl}>Copy Link</button>
				</div>

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
