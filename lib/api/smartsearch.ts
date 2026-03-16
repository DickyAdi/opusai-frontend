import type {
	FetchSmartSearchSchemaResponse,
	SmartSearchFieldInputNoId,
	SmartSearchGroupInput,
	SmartSearchGroupInputNoId,
	SmartSearchResponse,
	SmartSearchFieldSchema,
} from "../type/smartsearch";

export function fetchSmartSearchSchema(): Promise<FetchSmartSearchSchemaResponse> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/extraction/schema`;
	return fetch(url, { method: "GET" })
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch search schema ${res.status}`);
			}
			return res.json();
		})
		.then((data: FetchSmartSearchSchemaResponse) => {
			return data;
		})
		.catch((error) => {
			console.error("Error when fetching search schema", error);
			throw error;
		});
}

export function smartSearch(
	search_query: string,
): Promise<SmartSearchResponse> {
	const params = new URLSearchParams({
		query: search_query,
	});
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/search?${params}`;

	return fetch(url, {
		method: "GET",
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to search ${res.status}`);
			}
			return res.json();
		})
		.then((data: SmartSearchResponse) => {
			return data;
		})
		.catch((err) => {
			console.error("Failed to search", err);
			throw err;
		});
}

export function smartSearchCreateSchema(
	group: SmartSearchGroupInput,
): Promise<string> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/extraction/schema/create/new`;
	const { fields, ...groups } = stripId(group);
	const formattedGroup = {
		group: groups,
		fields,
	};
	const body = JSON.stringify(formattedGroup);
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error("Failed to create");
			}
			return res.json();
		})
		.then((data: { message: string }) => {
			return data?.message || "Schema created";
		});
}

// util function to strip id
function stripId(group: SmartSearchGroupInput): SmartSearchGroupInputNoId {
	const { id, ...noId } = group;

	return {
		...noId,
		fields: group.fields.map(({ id, ...field }) => field),
	};
}

// Add fields to existing group schema
export function addFieldToGroupSchema(
	groupId: string,
	fields: SmartSearchFieldInputNoId[],
): Promise<{ message: string }> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/extraction/schema/${groupId}/add`;
	const body = JSON.stringify({ fields });
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to add fields: ${res.status}`);
			}
			return res.json();
		})
		.then((data: { message: string }) => {
			return data;
		})
		.catch((error) => {
			console.error("Error when adding fields to group", error);
			throw error;
		});
}

// Delete group schema
export function deleteGroupSchema(
	groupId: string,
): Promise<{ message: string; deleted_group: { id: string; name: string; description: string } }> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/extraction/schema/group/${groupId}/delete`;
	return fetch(url, {
		method: "DELETE",
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to delete group: ${res.status}`);
			}
			return res.json();
		})
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error("Error when deleting group", error);
			throw error;
		});
}

// Edit field schema
export function editFieldSchema(
	fieldId: string,
	updates: Partial<Pick<SmartSearchFieldSchema, "name" | "description" | "type">>,
): Promise<SmartSearchFieldSchema> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/extraction/schema/field/${fieldId}/edit`;
	const body = JSON.stringify(updates);
	return fetch(url, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to edit field: ${res.status}`);
			}
			return res.json();
		})
		.then((data: SmartSearchFieldSchema) => {
			return data;
		})
		.catch((error) => {
			console.error("Error when editing field", error);
			throw error;
		});
}

// Delete field schema
export function deleteFieldSchema(
	fieldId: string,
): Promise<{ message: string; field_id: string }> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/extraction/schema/field/${fieldId}/delete`;
	return fetch(url, {
		method: "DELETE",
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to delete field: ${res.status}`);
			}
			return res.json();
		})
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error("Error when deleting field", error);
			throw error;
		});
}
