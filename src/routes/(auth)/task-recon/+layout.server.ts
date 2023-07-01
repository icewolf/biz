import type { Client } from '$lib/types/invoiceninja/client.js';
import type { GenericManyResponse } from '$lib/types/invoiceninja/generic-many-response.js';
import type { Board } from '$lib/types/trello/board.js';
import memoizee from 'memoizee';

export const load = async ({ params: { clientId, boardId }, locals: { trello, invoiceNinja } }) => {
	const boards = await trello.url('/members/me/boards').get().json<Board[]>();

	const clients = await invoiceNinja
		.url('/clients')
		.query({ per_page: 100 })
		.get()
		.json<GenericManyResponse<Client>>();

	const resolveOrg = memoizee(
		async (orgId: string) => {
			const org = await trello
				.url(`/organizations/${orgId}`)
				.query({
					fields: 'id,name,displayName'
				})
				.get()
				.json<{ id: string; name: string; displayName: string }>();
			return org;
		},
		{ promise: true }
	);

	const boardsByOrg = await Promise.all(
		Object.entries(
			boards?.reduce((acc, board) => {
				const orgId = board.idOrganization ?? '*';
				return {
					...acc,
					[orgId]: [...(acc[orgId] ?? []), board]
				};
			}, {} as { [orgId: string]: typeof boards }) ?? {}
		)
			.reduce((acc, [orgId, boards]) => {
				return [...acc, { orgId: orgId, boards: boards ?? [] }];
			}, [] as { orgId: string; boards: NonNullable<typeof boards> }[])
			.map(async ({ orgId, boards }) => ({
				boards,
				org: orgId === '*' ? null : await resolveOrg(orgId)
			}))
	);

	return { clients, clientId, boardId, boards, boardsByOrg };
};
