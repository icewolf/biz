import type { Client } from '$lib/types/invoiceninja/client';
import type { GenericManyResponse } from '$lib/types/invoiceninja/generic-many-response.js';
import type { Task } from '$lib/types/invoiceninja/task.js';
import type { Card } from '$lib/types/trello/card.js';

export const load = async ({
	params: { clientId, boardId },
	locals: { trello, invoiceNinja },
	depends
}) => {
	depends('tasks');

	const { data: tasks } = await invoiceNinja
		.url('/tasks')
		.query({ per_page: 500, client_id: clientId, include: 'status,client,invoice' })
		.get()
		.json<GenericManyResponse<Task>>();

	const trelloCards = await trello.url(`/boards/${boardId}/cards/all`).get().json<Card[]>();

	const activeTasks = tasks.filter((task) => !task.invoice_id);
	const trelloTasks = trelloCards
		.map((trelloCard) => ({
			...trelloCard,
			invoiceNinjaTasks: activeTasks.filter((inTask) =>
				inTask.custom_value1.includes(trelloCard.shortUrl)
			)
		}))
		.sort(
			(a, b) => new Date(b.dateLastActivity).valueOf() - new Date(a.dateLastActivity).valueOf()
		);

	return { invoiceNinjaTasks: activeTasks, trelloTasks };
};
