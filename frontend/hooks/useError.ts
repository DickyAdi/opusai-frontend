import { errorStore } from "@/lib/store/error_store";

export function useGetError() {
  return errorStore(state => state.errors)
}

export function useAppendError() {
  return errorStore(state => state.appendError)
}

export function useRemoveError() {
  return errorStore(state => state.removeError)
}

export function useRemoveAllErrors() {
  return errorStore(state => state.removeAllErrors)
}