import { BASE_URL } from "../config/constants"
import { ModelType } from "../type/model"

const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchDummyModels():Promise<string[]> {
  const dummy_models = ["Qwen3", "Qwen2.5", "Gemma3"]

  await delay(20)
  return dummy_models
}

export interface ModelsResponseSchema {
  models: string[]
}

export function fetchModels():Promise<ModelType[]> {
  const url = BASE_URL+'api/models'
  return fetch(url, {method:"GET"})
                .then((res) => {
                  if (!res.ok) {
                    throw new Error(`Failed to fetch models ${res.status}`)
                  }
                  return res.json()
                })
                // .then((data) => data.models || [])
                .then((data: ModelsResponseSchema) => {
                  return (data.models || []).map(m => ({name:m}))
                })
                .catch(error => {
                  // console.error(`Error fetching models: ${error}`)
                  throw error
                })
}