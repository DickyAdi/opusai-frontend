import { createNewPrompt, deletePrompt, fetchPrompts, updatePrompt } from "@/lib/api/prompt";
import { create } from "zustand";
import { PromptType } from "../type/prompt_type";

interface promptStore {
  availablePrompts: PromptType[]
  isLoadingPrompts: boolean
  loadPrompts: () => Promise<void>
  setAvailablePrompts: (prompts:PromptType[]) => void
  updateAvailablePrompts: (prompt:PromptType) => void
  removeAvailablePrompts: (id:string) => void
  addPrompt: (prompt:PromptType) => void
  setIsLoadingPrompt: (e:boolean) => void;
  createPrompt: ({user_id, title, prompt} : {user_id?:string, title:string, prompt:string}) => Promise<string>;
  editPrompt: (prompt_id:string, type:"user" | "default", updated_title:string , updated_content:string) => Promise<void>
  removePrompt: (prompt_id:string) => Promise<void>
}


export const promptStore = create<promptStore>((set, get) => ({
  availablePrompts:[],
  isLoadingPrompts: false,
  loadPrompts: async () => {
    try {
      get().setIsLoadingPrompt(true)
      const prompts = await fetchPrompts()
      get().setAvailablePrompts(prompts)
    } catch(error) {
      console.error('ERROR fetching prompts: ', error)
    } finally {
      get().setIsLoadingPrompt(false)
    }
  },
  setAvailablePrompts: (prompts:PromptType[]) => set({availablePrompts: prompts}),
  updateAvailablePrompts: (prompt:PromptType) => {
    set((state) => ({
      availablePrompts: state.availablePrompts.map((p) => p.id === prompt.id ? prompt : p)
    }))
  },
  removeAvailablePrompts: (id:string) => {
    set((state) => ({
      availablePrompts: state.availablePrompts.filter((p) => p.id !== id)
    }))
  },
  addPrompt: (prompt:PromptType) => set(state => ({availablePrompts: [...state.availablePrompts, prompt]})),
  setIsLoadingPrompt: (e:boolean) => set({isLoadingPrompts:e}),
  createPrompt: async ({user_id, title, prompt}: {user_id?:string, title:string, prompt:string}) => {
    try {
      get().setIsLoadingPrompt(true)
      const response = await createNewPrompt({user_id:user_id, prompt:prompt, title:title})
      get().addPrompt({...response as PromptType})
      return response.id
    } catch(error) {
      throw error
    } finally {
      get().setIsLoadingPrompt(false)
    }
  },
  editPrompt: async (prompt_id:string, type:"user" | "default", updated_title:string, updated_content:string) => {
    const data = await updatePrompt(prompt_id, updated_title, updated_content)
    const updatedPrompt = {
      id:data.id,
      title:data.title,
      content:data.content,
      type:type,
      created_at:data.created_at,
      updated_at:data.updated_at
    }
    get().updateAvailablePrompts(updatedPrompt)
  },
  removePrompt: async (prompt_id:string) => {
    await deletePrompt(prompt_id)
    get().removeAvailablePrompts(prompt_id)
  }
}))