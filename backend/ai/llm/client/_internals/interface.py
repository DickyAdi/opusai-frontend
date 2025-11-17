from abc import ABC, abstractmethod
from typing import Optional


class ChatClient(ABC):

    @abstractmethod
    def create_chat(self, query:str, temperature:Optional[float]=.1, top_p:Optional[float]=.9) -> str:
        ...


class EmbeddingClient(ABC):

    @abstractmethod
    def embed(self, query, dimensions:Optional[int]=1024) -> list[float]:
        ...