import { error } from "console";
// import { BASE_URL } from "../config/constants";
import { ChatConversationType } from "../type/conversation";
import type { ChatMessageType } from "../type/chat_message";

interface ConversationSchema {
	id: string;
	title: string;
	system_prompt: string;
	file_count: number;
	created_at: string;
	updated_at: string;
}

export interface ConversationsResponseSchema {
	count: number;
	page: number;
	limit: number;
	total_pages: number;
	items: ChatConversationType[];
}

export function fetchConversations(
	page: number = 1,
	limit: number = 20,
	user_id?: string,
): Promise<ConversationsResponseSchema> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations?user_id=${user_id ? user_id : ""}&page=${page}&limit=${limit}`;
	return fetch(url, {
		method: "GET",
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch conversations ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(`Error fetching conversations: ${error}`);
			throw error;
		});
}

export interface ConversationMessages {
	id: string;
	title: string;
	system_prompt: string;
	created_at: string;
	updated_at: string;
	messages: ChatMessageType[];
	files: {
		id: string;
		filename: string;
		file_type: string;
		file_size: number;
		created_at: string;
	}[];
}

export function fetchConversationMessages(
	conversation_id?: string,
): Promise<ChatMessageType[]> {
	// const url = BASE_URL + 'api/conversations/' + conversation_id
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/${conversation_id}`;
	return fetch(url, {
		method: "GET",
	})
		.then((resp) => {
			if (!resp.ok) {
				throw new Error(`Failed to fetch message history ${resp.status}`);
			}
			return resp.json();
		})
		.then((data: ConversationMessages) => {
			return data.messages;
		})
		.catch((error) => {
			console.error(
				`Error fetching message history for ${conversation_id}: ${error}`,
			);
			throw error;
		});
}

export interface ConversationTitleResponseSchema {
	id: "string";
	title: "string";
	created_at: "string";
	updated_at: "string";
}

export function fetchConversationTitle(
	conversation_id: string,
): Promise<string> {
	// const url = BASE_URL + 'api/conversations/' + conversation_id + '/title'
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/${conversation_id}/title`;
	return fetch(url, {
		method: "GET",
	})
		.then((resp) => {
			if (!resp.ok) {
				throw new Error(`Failed to fetch conversation title ${resp.status}`);
			}
			return resp.json();
		})
		.then((data: ConversationTitleResponseSchema) => data.title)
		.catch((error) => {
			console.error(
				`Error fetching conversation title for ${conversation_id}: ${error}`,
			);
			throw error;
		});
}

interface ConversationUpdateTitleResponseSchema {
	id: string;
	title: string;
	updated_at: string;
}

export function renameConversationTitle(
	conversation_id: string,
	new_name: string,
): Promise<ConversationUpdateTitleResponseSchema> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/${conversation_id}`;
	const body = JSON.stringify({ title: new_name });
	return fetch(url, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	})
		.then((resp) => {
			if (!resp.ok) {
				throw new Error(`Failed to update conversation id ${resp.status}`);
			}
			return resp.json();
		})
		.then((data) => data)
		.catch((err) => {
			console.error("Encountered an error while renaming conversation");
			throw err;
		});
}

export function deleteConversation(conversation_id: string): Promise<void> {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/${conversation_id}`;
	return fetch(url, {
		method: "DELETE",
	}).then((resp) => {
		if (!resp.ok) {
			throw new Error(`Failed to delete conversation: ${resp.status}`);
		}
	});
}
