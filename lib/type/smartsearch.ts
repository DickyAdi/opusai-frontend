export const FieldTypeValue = ["text", "number", "datetime"] as const;
export type FieldType = (typeof FieldTypeValue)[number];

export interface SmartSearchFieldSchema {
	name: string;
	description: string;
	type: FieldType;
	id: string;
	group_id: string;
	group_name: string;
	created_at: string;
	updated_at: string;
}

export interface SmartSearchGroupSchema {
	name: string;
	description: string;
	id: string;
	created_at: string;
	updated_at: string;
	field_schemas: SmartSearchFieldSchema[];
}

export interface FetchSmartSearchSchemaResponse {
	schemas: SmartSearchGroupSchema[];
}

export interface SearchEngineHit {
	id_primaryKey: string;
	grup: string;
	filename: string;
	[key: string]: unknown;
}

export interface SearchEngineHits {
	_formatted: SearchEngineHit;
}

export interface SmartSearchResponse {
	hits: SearchEngineHits[];
	limit: number;
	offset: number;
}

export interface SmartSearchGroupInput
	extends Pick<SmartSearchGroupSchema, "name" | "description" | "id"> {
	fields: SmartSearchFieldInput[];
}

export interface SmartSearchFieldInput
	extends Pick<
		SmartSearchFieldSchema,
		"name" | "description" | "type" | "id"
	> {}

export interface SmartSearchCreateSchemaRequest
	extends Pick<SmartSearchGroupSchema, "name" | "description">,
		Pick<SmartSearchFieldSchema, "name" | "description" | "type"> {}
