import type { Client } from '$lib/types/invoiceninja/client.js';
import type { GenericManyResponse } from '$lib/types/invoiceninja/generic-many-response.js';
import { resolvePath } from '$lib/utils.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { trello, invoiceNinja } }) => {
	// const boards = await trello.url('/me').get().json();

	const clients = await invoiceNinja
		.url('/clients')
		.query({ per_page: 100 })
		.get()
		.json<GenericManyResponse<Client>>();

	return { clients };
};