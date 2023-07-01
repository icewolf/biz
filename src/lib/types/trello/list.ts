export interface List {
	id: string;
	name: string;
	closed: boolean;
	idBoard: string;
	pos: number;
	status: null;
	subscribed: boolean;
	limits: Record<string, boolean>;
	creationMethod: null;
	softLimit: null;
}
