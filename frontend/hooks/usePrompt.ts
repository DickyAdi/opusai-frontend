import { promptStore } from "@/lib/store/prompt_store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppendError } from "./useError";
import { createNewPrompt } from "@/lib/api/prompt";


export function useAvailablePrompts() {
  return promptStore(state => state.availablePrompts)
}

export function useIsLoadingPrompt() {
  return promptStore(state => state.isLoadingPrompts)
}

export function useFetchPrompts() {
  const availablePrompts = useAvailablePrompts()
  const loadPrompts = promptStore(state => state.loadPrompts)
  // const hasLoaded = useRef(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const appendError = useAppendError()

  useEffect(() => {

    const getPrompt = async () => {
      try {
        if (availablePrompts.length === 0 && !hasLoaded) {
          await loadPrompts()
        }
      } catch(error) {
        const errMsg = error instanceof Error ? error.message : "Cannot load prompts from server, please contact us."
        appendError(errMsg)
        setHasLoaded(false)
      } finally {
        setHasLoaded(true)
      }
    }
    getPrompt()
  }, [loadPrompts, availablePrompts.length, appendError, hasLoaded])
}

export function useCreatePrompt() {
  const appendError = useAppendError()
  const createPrompt = promptStore(state => state.createPrompt)
  
  const createNewPrompt = useCallback((title:string, prompt:string, user_id?:string) => {
    try {
      const newPromptId = createPrompt({user_id:user_id, title:title, prompt:prompt})
      return newPromptId
    } catch(error) {
      const errMsg = error instanceof Error ? error.message : "Failed to create prompt"
      appendError(errMsg)
    }

  }, [appendError, createPrompt])

  return createNewPrompt
}

export function useEditPrompt() {
  return promptStore(state => state.editPrompt)
}

export function useRemovePrompt() {
  return promptStore(state => state.removePrompt)
}

// export function useAppendPrompt() {
//   return promptStore(state => state.appendPrompt)
// }