export interface Board {
	id: string;
	/**
	 * @description The name of the board.
	 * @example Trello Platform Changes
	 */
	name?: string;
	/** @example Track changes to Trello's Platform on this board. */
	desc?: string;
	descData?: string;
	/** @example false */
	closed?: boolean;
	idMemberCreator?: string;
	idOrganization?: string;
	/** @example false */
	pinned?: boolean;
	/**
	 * Format: url
	 * @example https://trello.com/b/dQHqCohZ/trello-platform-changelog
	 */
	url?: string;
	/**
	 * Format: url
	 * @example https://trello.com/b/dQHqCohZ
	 */
	shortUrl?: string;
	prefs?: any;
	labelNames?: {
		/** @example Addition */
		green?: string;
		/** @example Update */
		yellow?: string;
		/** @example Deprecation */
		orange?: string;
		/** @example Deletion */
		red?: string;
		/** @example Power-Ups */
		purple?: string;
		/** @example News */
		blue?: string;
		/** @example Announcement */
		sky?: string;
		/** @example Delight */
		lime?: string;
		/** @example REST API */
		pink?: string;
		/** @example Capabilties */
		black?: string;
	};
	limits?: any;
	starred?: boolean;
	memberships?: string;
	shortLink?: string;
	subscribed?: boolean;
	powerUps?: string;
	/** Format: date */
	dateLastActivity?: string;
	/** Format: date */
	dateLastView?: string;
	idTags?: string;
	/** Format: date */
	datePluginDisable?: string | null;
	creationMethod?: string | null;
	ixUpdate?: number;
	templateGallery?: string | null;
	enterpriseOwned?: boolean;
}
