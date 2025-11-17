from openai import OpenAI, omit
from typing import Optional, get_args, get_origin, Annotated
import inspect
import json

from ._internals import ChatClient, EmbeddingClient


class OAIChatClient(ChatClient):
    """OpenAI Chat client. This class is responsible for creating a new chat to the OAI client.

    usage:
    ```
    >>> client = OAIChatClient(base_url='127.0.0.1', model='Gemma3')
    >>> response = client.create_chat(query='Hi, who are you?')
    ```
    """
    def __init__(
        self,
        base_url: str,
        model: str,
        api_key: str = "localdummy",
        system_prompt: Optional[str] = None,
        tools: Optional[list[callable]] = None,
    ):
        self.client = OpenAI(base_url=base_url, api_key=api_key)
        self.model = model
        self.tools = self._register_tool(tools=tools) if tools else None
        self.tools_metadata = self._get_tool_metadata(self.tools) if self.tools else None
        self.system_prompt = system_prompt
        self.message_history = []
        if system_prompt:
            self.message_history.append({'role':'system', 'content': system_prompt})

    def create_chat(
        self,
        query: str,
        temperature: Optional[float] = 0.1,
        top_p: Optional[float] = 0.9,
    ) -> str:
        """Create a new chat for the client. Message history is maintained within the client instance.

        Args:
            query (str): User query/prompt. Must be a single string
            temperature (Optional[float], optional): Controll the temperature of the model. Defaults to 0.1.
            top_p (Optional[float], optional): Controll the top_p of the model. Defaults to 0.9.

        Returns:
            str: LLM response based on the given user query/prompt
        """
        self.message_history.append({"role": "user", "content": query})
        resp = self.client.chat.completions.create(
            model=self.model,
            tools=self.tools_metadata if self.tools_metadata else omit,
            temperature=temperature,
            top_p=top_p,
            messages=self.message_history,
        )
        if resp.choices[0].finish_reason == 'tool':
            tool_call = resp.choices[0].message.tool_calls[0].custom
            tool_name = tool_call.name
            tool_input = json.loads(tool_call.input)
            tool_result = self.tools[tool_name](**tool_input)
            self.message_history.extend([
                {**resp.choices[0].message},
                {'role':'tool', 'content':tool_result}
            ])
            resp = self.client.chat.completions.create(
                model=self.model,
                tools=self.tools_metadata if self.tools_metadata else omit,
                temperature=temperature,
                top_p=top_p,
                messages=self.message_history,
            )
        resp_message = resp.choices[0].message
        
        self.message_history.append(
            {"role": "assistant", "content": resp_message.content}
        )
        return resp_message.content
    
    def _register_tool(self, tools:list[callable]) -> dict[str, callable]:
        """
        Register all tools when the client is initialized. This function will analyze the tools args and docstring. Ensure each args are annotated with `pydantic.Field`.

        Args:
            tools (list[callable]): All tools reference in a list.

        Returns:
            dict (str, callable): a tool map in which each function attached with OAI compatible tool metadata.

        Usage:
            ```
            def dummy_tools(
                value: Annotated[int, Field(description="This is just a dummy args that receive an integer value")]
            ):
                "This is the dummy_tools description where this should be extracted.
                "
                print(f"Printing value times 2: {value*2}")

            chat_client = OAIChatClient(......, tools=[dummy_tools])
            ```
        """
        tool_map ={}
        for func in tools:
            sig = inspect.signature(func)

            properties = {}
            required = []

            for param_name, param in sig.parameters.items():
                param_annot = param.annotation
                if get_origin(param_annot) is Annotated:
                    args = get_args(param_annot)
                    base_type = args[0]
                    metadata = args[1:]

                    field_info = None
                    for item in metadata:
                        if hasattr(item, 'description'):
                            field_info = item
                            break
                    
                    type_maps = {
                        int:"integer",
                        str:"string",
                        bool:"boolean",
                        list:"array",
                        dict:"object",
                        float:"number"
                    }

                    properties[param_name] = {
                        "type": type_maps.get(base_type, "string")
                    }
                    if field_info and field_info.description:
                        properties[param_name]['description'] = field_info.description
                    if param.default == inspect.Parameter.empty:
                        required.append(param_name)

            dummy_desc = """The developer doesnt provide any additional description but here are the args that might help you\n{properties}\nThe required args are {required}"""
            docs_meta = {
                'type': 'function',
                'name': func.__name__,
                'description': inspect.getdoc(func) or dummy_desc.format(properties=properties, required=required),
                'parameters':{
                    "type": "object",
                    "properties": properties,
                    "required": required
                }
            }
            func.tool_metadata = docs_meta
            tool_map[str(func.__name__)] = func
        return tool_map
    
    def _get_tool_metadata(self, tool_map:dict[str, callable]) -> list[dict]:
        """Extract registered tools metadata. This method should not be called outside the class as this is internal method in which will be used when the class is initialized.

        Args:
            tool_map (dict[str, callable]): a dictionary mapping containing the registered tools

        Returns:
            list[dict]: OAI compatible tool metadata in which will be passed to the OAI client/LLM
        """
        tool_meta = []
        for tool in tool_map.values():
            tool_meta.append(tool.tool_metadata)
        return tool_meta

        

    


class OAIEmbeddingClient(EmbeddingClient):
    """OpenAI embedding client. This class is responsible for creating an embedding vector

    usage:
    ```
    >>> client = OAIEmbeddingClient(base_url='127.0.0.1')
    >>> vector = client.embed('Hello world')
    ```
    """
    def __init__(self, base_url: str, model: str, api_key: str = "localdummy"):
        self.client = OpenAI(base_url=base_url, api_key=api_key)
        self.model = model

    def embed(self, query:str, dimensions:Optional[int] = 1024) -> list[float]:
        """Embed a query

        Args:
            query (str): Input query to be embed
            dimensions (Optional[int], optional): Control the dimension of the embeddings. Defaults to 1024.

        Returns:
            list[float]: Generated embeddings
        """
        embedding = self.client.embeddings.create(
            model=self.model,
            input=query,
            dimensions=dimensions
        ).data[-1].embedding

        return embedding