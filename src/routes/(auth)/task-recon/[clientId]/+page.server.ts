import type { Client } from '$lib/types/invoiceninja/client';
import type { GenericManyResponse } from '$lib/types/invoiceninja/generic-many-response.js';
import type { Task } from '$lib/types/invoiceninja/task.js';
import type { Card } from '$lib/types/trello/card.js';

export const load = async ({ params: { clientId }, locals: { trello, invoiceNinja }, depends }) => {
	depends('tasks');

	const { data: client } = await invoiceNinja
		.url(`/clients/${clientId}`)
		.get()
		.json<{ data: Client }>();

	const tasks = await invoiceNinja
		.url('/tasks')
		.query({ per_page: 500, client_id: clientId, include: 'status,client,invoice' })
		.get()
		.json<GenericManyResponse<Task>>();

	const trelloCards = await trello
		.url('/boards/61ebe247b0bedf675913747e/cards')
		.get()
		.json<Card[]>();

	const activeTasks = tasks.data.filter((task) => !task.invoice_id);

	const untrackedTasks = trelloCards
		.map((trelloCard) => ({
			...trelloCard,
			invoiceNinjaTasks: activeTasks.filter((inTask) =>
				inTask.custom_value1.includes(trelloCard.shortUrl)
			)
		}))
		.sort(
			(a, b) => new Date(b.dateLastActivity).valueOf() - new Date(a.dateLastActivity).valueOf()
		);

	return { client, invoiceNinjaTasks: activeTasks, trelloTasks: untrackedTasks,  };
};
