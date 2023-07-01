<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolvePath } from '$lib/utils.js';

	export let data;

	const changeClient = (clientId: string) => {
		if (!clientId.length) goto(resolvePath('/(auth)/task-recon'));
		goto(resolvePath('/(auth)/task-recon/[clientId]', { clientId }));
	};
</script>

<h2 class="h2">Task Recon.</h2>

<div class="space-y-4">
	<div class="card p-4">
		<label
			><span>Client</span>
			<select
				class="select"
				on:change={(e) => changeClient(e.currentTarget.value)}
				value={data.clientId}
			>
				<option value></option>
				{#each data.clients.data as client}
					<option value={client.id}>{client.display_name}</option>
				{/each}
			</select>
		</label>
	</div>

	<slot />
</div>
