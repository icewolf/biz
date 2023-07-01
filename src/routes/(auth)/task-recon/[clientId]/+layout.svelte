<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolvePath } from '$lib/utils.js';

	export let data;

	const changeBoard = (boardId: string) => {
		if (!boardId.length)
			goto(resolvePath('/(auth)/task-recon/[clientId]', { clientId: data.clientId }));
		goto(
			resolvePath('/(auth)/task-recon/[clientId]/[boardId]', {
				clientId: data.clientId,
				boardId
			})
		);
	};

	$: ({ boardsByOrg } = data);
</script>

<div class="card p-4">
	{#if !boardsByOrg.length}
		No boards found
	{:else}
		<label
			><span>Board</span>
			<select
				class="select"
				on:change={(e) => changeBoard(e.currentTarget.value)}
				value={data.boardId}
			>
				<option value />
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
