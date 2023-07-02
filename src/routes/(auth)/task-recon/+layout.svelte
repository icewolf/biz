<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolvePath } from '$lib/utils.js';

	import AwesomeDebouncePromise from 'awesome-debounce-promise';

	export let data;

	let clientId: string | undefined = data.clientId;
	let boardId: string | undefined = data.boardId;

	const handleNav = AwesomeDebouncePromise(async () => {
		await goto(
			resolvePath('/(auth)/task-recon/[clientId]/[boardId]', {
				clientId,
				boardId
			})
		);
	}, 300);

	$: if (
		clientId?.length &&
		boardId?.length &&
		(clientId !== data.clientId || boardId !== data.boardId)
	) {
		handleNav();
	}
	$: ({ boardsByOrg } = data);
</script>

<h2 class="h2">Task Recon.</h2>

<div class="card p-4 variant-glass-surface space-y-4">
	<div>
		<label
			><span>Client</span>
			<select class="select" bind:value={clientId}>
				<option value>Select a client...</option>
				{#each data.clients.data as client}
					<option value={client.id}>{client.display_name}</option>
				{/each}
			</select>
		</label>
	</div>

	<div>
		{#if !boardsByOrg.length}
			No boards found
		{:else}
			<label
				><span>Board</span>
				<select class="select" bind:value={boardId}>
					<option value>Select a board...</option>
					{#each boardsByOrg.find(({ org }) => !org)?.boards ?? [] as board (board.id)}
						<option value={board.id}>{board.name}</option>
					{/each}
					{#each boardsByOrg.filter(({ org }) => !!org) as { org, boards } (org)}
						<optgroup label={org?.displayName}>
							{#each boards as board (board.id)}
								<option value={board.id}>{board.name}</option>
							{/each}
						</optgroup>
					{/each}
				</select>
			</label>
		{/if}
	</div>

	<slot />
</div>
