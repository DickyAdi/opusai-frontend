export default interface ChatInputType {
  id: string;
  query: string;
}


export default interface ChatRequestSchema {
  conversation_id?:string
  query:string
  model:string
  file:boolean
  file_paths:string[]
  VDB:boolean
  system_prompt:string
  temperature:number
}