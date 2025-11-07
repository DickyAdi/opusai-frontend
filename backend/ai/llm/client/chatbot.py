from openai import OpenAI, omit
from typing import Optional


from ._internals import ChatClient, EmbeddingClient


class OAIChatClient(ChatClient):
    def __init__(
        self,
        base_url: str,
        model: str,
        api_key: str = "localdummy",
        system_prompt: Optional[str] = None,
        tools: Optional[list[dict]] = None,
    ):
        self.client = OpenAI(base_url=base_url, api_key=api_key)
        self.model = model
        self.tools = tools
        self.system_prompt = system_prompt
        self.message_history = [
            {"role": "system", "content": self.system_prompt}
            if self.system_prompt
            else None
        ]

    async def create_chat(
        self,
        query: str,
        temperature: Optional[float] = 0.1,
        top_p: Optional[float] = 0.9,
    ) -> str:
        msg = self.message_history.append({"role": "user", "content": query})
        resp = self.client.chat.completions.create(
            model=self.model,
            tools=self.tools if self.tools else omit,
            temperature=temperature,
            top_p=top_p,
            messages=msg,
        )
        resp_message = resp.choices[0].message
        # For now we ignore the function_call or tool_calls due to limited knowledge
        self.message_history.append(
            {"role": "assistant", "content": resp_message.content}
        )
        return resp_message.content


class OAIEmbeddingClient(EmbeddingClient):
    def __init__(self, base_url: str, model: str, api_key: str = "localdummy"):
        self.client = OpenAI(base_url=base_url, api_key=api_key)
        self.model = model

    async def embed(self, query:str, dimensions:Optional[int] = 1024) -> list[float]:
        embedding = self.client.embeddings.create(
            model=self.model,
            input=query,
            dimensions=dimensions
        ).data[-1].embedding

        return embedding