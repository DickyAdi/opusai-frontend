from openai import OpenAI, omit
from typing import Optional, get_args, get_origin, Annotated, Literal
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
        n_debug: Optional[int] = 3
    ):
        """This class is responsible for creating a new chat and managing the message history. Tool call supports depends on the called model.

        Args:
            base_url (str): Base url of the model server or inference server
            model (str): Model name that will be used
            api_key (str, optional): API Key for the model server or inference server, for llama.cpp this key will be ignored. Defaults to "localdummy".
            system_prompt (Optional[str], optional): System prompt to be injected to the message history. Defaults to None.
            tools (Optional[list[callable]], optional): Tools that might be used by this mode, ensure the tools follow the convention below. Defaults to None.
            n_debug (Optional[int], optional): Number of self debugging iteration for the model if it encounters a try-able exception/error. Defaults to 3.

        Tools convention:
            When registering tools to the models, ensure the tools structure look like this below
            rules:
            - Args of the function/tool must be annotated with `pydantic.Field.description`
            - Docstring must be specified
            ```
            def dummy_tools(
                value: Annotated[int, Field(description="This is just a dummy args that receive an integer value")]
            ):
                \"""
                This is the dummy_tools description where this should be extracted.
                \"""
                print(f"Printing value times 2: {value*2}")

            chat_client = OAIChatClient(......, tools=[dummy_tools])
            ```
        """
        self.client = OpenAI(base_url=base_url, api_key=api_key)
        self.model = model
        self.tools = self._register_tool(tools=tools) if tools else None
        self.tools_metadata = self._get_tool_metadata(self.tools) if self.tools else None
        self.system_prompt = system_prompt
        self.message_history = []
        self.n_debug = n_debug if self.tools else None
        if system_prompt:
            self.message_history.append({'role':'system', 'content': system_prompt})

    def _create_msg_dict(self, role:Literal['user', 'assistant', 'system'], content:str, **kwargs) -> dict[str, str]:
        """Internal method for creating a chat message in a format of `{"role": ....., "content": .....}`

        Args:
            role (Literal["user", "assistant", "system"]): _description_
            content (str): Content of the chat message
            **kwargs (Any): Any additional kwargs that will be included to the chat message

        Returns:
            dict[str, str]: Dictionary with a format of `{"role": ....., "content": .....}`
        """
        return dict(role=role, content=content, **kwargs)
    
    def _isolate_tool_calls(self, tool_name:str, tool_input:dict) -> dict[str, str]:
        """Sandboxing tool calls to avoid throwing an exception/error to the user. Any retry-able exception like input formatting and type missmatch will explicitly tell LLM to try again, while any unexpected or internal function/tool error will be surpressed and LLM will be explicitly told to stop trying and tell the user if the tool/function service is unavailable

        Args:
            tool_name (str): Tool name registered in the tool mapper when initializing the client.
            tool_input (dict): Input args needed for the function/tool to be executed

        Raises:
            Exception: If encounter any unexpected exception within the function/tools

        Returns:
            dict[str, str]: Chat message dictionary with a format of `{"role": ....., "content": "<tool_response>......</tool_response>"}`
        """
        if tool_name not in self.tools:
            return (False, self._create_msg_dict(role='user', content=f'<tool_response>\nTool named {tool_name} does not exists\n</tool_response>'))
        try:
            tool_result = self.tools[tool_name](**tool_input)
            return (True, self._create_msg_dict(role='user', content=f"<tool_response>\n{tool_result}\n</tool_response>"))
        except (KeyError, ValueError, TimeoutError, RuntimeError, IndexError, ConnectionError, FileNotFoundError) as e:
            err_type = type(e).__name__
            err_msg = f"Tool execution error: {err_type}: {str(e)}"

            return (False, self._create_msg_dict(role='user', content="<tool_response>\nError: The tool encountered internal error and could not complete the operation. Please try different approach or inform the user that this operation is currently unavailable\n</tool_response>"))
        except json.JSONDecodeError as e:
            err_msg = f"Error: Invalid JSON in tool arguments: {str(e)}"
            return (False, self._create_msg_dict(role='user', content=f'<tool_response>\n{err_msg}\nPlease provide valid JSON arguments</tool_response>'))
        except TypeError as e:
            err_msg = f"Error: Type missmatch in arguments: {str(e)}"
            return (False, self._create_msg_dict(role='user', content=f"<tool_response>\n{err_msg}\nPlease check arguments type and try again</tool_response>"))
        except Exception as e:
            raise e

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
        self.message_history.append(self._create_msg_dict('user', query))
        resp = self.client.chat.completions.create(
            model=self.model,
            tools=self.tools_metadata if self.tools_metadata else omit,
            temperature=temperature,
            top_p=top_p,
            messages=self.message_history,
        )
        if resp.choices[0].finish_reason == 'tool':
            self.message_history.append(self._create_msg_dict(role='assistant', content=resp.choices[0].message.content, tool_calls=resp.choices[0].message.tool_calls))
            tool_call = resp.choices[0].message.tool_calls[0].function
            tool_name = tool_call.name
            tool_input = json.loads(tool_call.arguments)
            self_debug = 0
            while self_debug < self.n_debug:
                try:
                    _succ, tool_result = self._isolate_tool_calls(tool_name=tool_name, tool_input=tool_input)
                    self.message_history.append(tool_result)
                    if _succ:
                        break
                    debug_resp = self.client.chat.completions.create(
                        model=self.model,
                        tools=self.tools_metadata if self.tools_metadata else omit,
                        temperature=temperature,
                        top_p=top_p,
                        messages=self.message_history
                    )
                    if debug_resp.choices[0].finish_reason == 'tool_calls':
                        tool_call = debug_resp.choices[0].message.tool_calls[0].function
                        tool_name = tool_call.name
                        tool_input = json.loads(tool_call.arguments)
                    else:
                        break
                    self_debug+=1
                except Exception as e:
                    print(f"[DEBUG] Tool calling caught an exception: {str(e)}")
                    break

            resp = self.client.chat.completions.create(
                model=self.model,
                tools=self.tools_metadata if self.tools_metadata else omit,
                temperature=temperature,
                top_p=top_p,
                messages=self.message_history,
            )
        resp_message = resp.choices[0].message
        
        self.message_history.append(
            self._create_msg_dict('assistant', resp_message.content)
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