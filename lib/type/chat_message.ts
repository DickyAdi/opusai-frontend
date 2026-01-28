export default interface ChatMessageType {
	id: string;
	conversationId: string;
	role: "assistant" | "user";
	content: string;
	references?: RefType[];
}

export type ChatChunkData = {
	message_id: string;
	type: "text_delta";
	content: string;
	index: number;
};

export type KnowledgeBaseLocationType = {
	parent_id: string;
	file_path: string;
};

export type TabularLocationType = {
	sql_query: string;
	row_count: number;
};

export type UploadedFileLocationType = {
	page_number: null;
	chunk_index: number;
};

type ChildChunk = {
	id: string;
	preview: string;
};

// export type RefType = {
// 	source_type: "tabular" | "uploaded_file" | "knowledge_base";
// 	source_name: string;
// 	source_id: string;
// 	location:
// 		| KnowledgeBaseLocationType
// 		| TabularLocationType
// 		| UploadedFileLocationType;
// 	preview: string;
// 	matched_chunks: ChildChunk[];
// };

export type RefType = {
	source_type: "tabular" | "uploaded_file" | "knowledge_base";
	source_name: string;
	source_id: string;
	preview: string;
	matched_chunks: ChildChunk[];
} & (
	| {
			source_type: "knowledge_base";
			location: KnowledgeBaseLocationType;
	  }
	| {
			source_type: "tabular";
			location: TabularLocationType;
	  }
	| {
			source_type: "uploaded_file";
			location: UploadedFileLocationType;
	  }
);

export type ChatCompletionData = {
	message_id: string;
	conversation_id: string;
	input_id: string;
	tokens_used: object;
	references: RefType[];
};

export type ChatErrorData = {
	message_id: string;
	code: string;
	message: string;
};

export type ChatStartData = {
	message_id: string;
	conversation_id: string;
	title: string;
	input_id: string;
	response_id: string;
};

export type ChatStatusData = {
	message_id: string;
	step: string;
	status: string;
};

const toolChoiceType = {
	AUTO: "auto",
	TOOL_SEARCH_DOCUMENTS: "TOOL_SEARCH_DOCUMENTS",
	TOOL_SEARCH_KNOWLEDGE_BASE: "TOOL_SEARCH_KNOWLEDGE_BASE",
	TOOL_QUERY_DATA: "TOOL_QUERY_DATA",
} as const;

export type ToolChoiceType =
	(typeof toolChoiceType)[keyof typeof toolChoiceType];
