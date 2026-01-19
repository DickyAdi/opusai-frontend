import { useAppendError } from "@/hooks/useError"
import { BASE_URL } from "../config/constants"
import { PromptType } from "../type/prompt_type"

const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms))


// export async function fetchPrompts() {
//   const template_prompts:PromptType[] = [
//     {id:crypto.randomUUID(), title:"Normal prompt", prompt:"You are a helpful assistant, please help me answer my questions!"},
//     {id:crypto.randomUUID(), title:"Notary prompt", prompt:"Act and think like you are a notary!"},
//   ]
//   return template_prompts
// }

export interface SystemPromptResponseSchema {
  count:number
  items: PromptType[]
}

export function fetchPrompts(user_id?:string) {
  const url = `${BASE_URL}api/systemprompt?user_id=${user_id ? user_id : ""}`
  return fetch(url, {
    method:"GET"
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch prompt: ${res.status}`)
    }
    const data = res.json()
    return data
  })
  .then((data:SystemPromptResponseSchema) => data.items || [])
  .catch(error => {
    console.error(`Error fetching system prompt`)
    throw error
  })
}

export interface SystemPromptCreateResponseSchema {
  id:string
  title:string
  content:string
  created_at:string
  updated_at:string
}

export function createNewPrompt({user_id, title, prompt}: {user_id?:string, title:string, prompt:string}) {
  const url = `${BASE_URL}api/systemprompt/user?user_id=${user_id ? user_id : ""}`
  const body = JSON.stringify({
    title,
    content:prompt
  })
  return fetch(url, {
    method:"POST",
    headers: {
      "Content-Type" : 'application/json'
    },
    body:body
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to create new prompt: ${res.status}`)
    }
    return res.json()
  })
  .then((data) => data as SystemPromptCreateResponseSchema || {})
  .catch(error => {
    console.error(`Error creating new system prompt`)
    throw error
  })
}

export interface UpdatePromptResponseSchema {
  id:string
  title:string
  content:string
  updated_at:string
  created_at:string
}
export async function updatePrompt(prompt_id:string, updated_title:string, updated_content:string):Promise<UpdatePromptResponseSchema> {
  const url = `${BASE_URL}api/systemprompt/user/${prompt_id}`
  const body = JSON.stringify({
    title:updated_title,
    content:updated_content
  })
  const resp = await fetch(url, {
    method:"PATCH",
    headers: {
      "Content-Type" : "application/json"
    },
    body:body
  })
  const data = await resp.json()
  if (!resp.ok) {
    const errMsg = data.detail?.[0]?.msg || data.message || 'Unknown'
    throw new Error(`Failed to update prompt: ${resp.status} - ${errMsg}`)
  }
  return data
}

export async function deletePrompt(prompt_id:string) {
  const url = `${BASE_URL}api/systemprompt/user/${prompt_id}`
  const resp = await fetch(url, {
    method: "DELETE",
  })
  if (!resp.ok) {
    const data = await resp.json()
    const errMsg = data.detail?.[0]?.msg || 'Unknown'
    throw new Error(`Failed to delete prompt: ${data.status} - ${errMsg}`)
  }
}