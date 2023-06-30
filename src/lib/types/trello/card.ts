import type { Label } from './label';

export interface Card {
	id: string;
	badges: object;
	checkItemStates: any[];
	closed: boolean;
	dateLastActivity: string;
	desc: string;
	descData: object | null;
	due: string | null;
	email: string | null;
	idAttachmentCover: string | null;
	idBoard: string;
	idChecklists: string[];
	idLabels: string[];
	idList: string;
	idMembers: string[];
	idMembersVoted: string[];
	idShort: number;
	labels: Label[];
	manualCoverAttachment: boolean;
	name: string;
	pos: number;
	shortLink: string;
	shortUrl: string;
	subscribed: boolean;
	url: string;
}
