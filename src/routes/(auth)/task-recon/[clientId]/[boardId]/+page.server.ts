import type { Client } from '$lib/types/invoiceninja/client';
import type { GenericManyResponse } from '$lib/types/invoiceninja/generic-many-response.js';
import type { Task } from '$lib/types/invoiceninja/task.js';
import type { Card } from '$lib/types/trello/card.js';
import type { List } from '$lib/types/trello/list.js';
import { filterOptions, type FilterOptions } from './shared.js';

export const load = async ({
	params: { clientId, boardId },
	locals: { trello, invoiceNinja },
	url,
	depends
}) => {
	depends('tasks');

	let activeFilter: FilterOptions = 'untracked';
	try {
		activeFilter = filterOptions.parse(url.searchParams.get('filter'));
	} catch (e) {
		// ignore
	}

	const [{ data: tasks }, trelloLists, trelloCards] = await Promise.all([
		invoiceNinja
			.url('/tasks')
			.query({ per_page: 500, client_id: clientId, include: 'status,client' })
			.get()
			.json<GenericManyResponse<Task>>(),
		trello.url(`/boards/${boardId}/lists`).get().json<List[]>(),
		trello.url(`/boards/${boardId}/cards/all`).get().json<Card[]>()
	]);

	const activeTasks = tasks.filter((task) => !task.is_deleted);
	const trelloTasks = trelloCards
		.map((trelloCard) => ({
			...trelloCard,
			list: trelloCard.idList
				? trelloLists.find((list) => list.id === trelloCard.idList)
				: undefined,
			invoiceNinjaTasks: activeTasks.filter((inTask) =>
				inTask.custom_value1.includes(trelloCard.shortUrl)
			)
		}))
		.sort((a, b) => new Date(b.dateLastActivity).valueOf() - new Date(a.dateLastActivity).valueOf())
		.filter((task) => {
			if (activeFilter === 'untracked') return !task.invoiceNinjaTasks.length;
			if (activeFilter === 'all') return true;
			if (activeFilter === 'invoiced')
				return task.invoiceNinjaTasks.some((inTask) => inTask.invoice_id?.length);
		});

	return {
		invoiceNinjaTasks: activeTasks,
		trelloTasks,
		totalTasks: trelloCards.length,
		activeFilter
	};
};
