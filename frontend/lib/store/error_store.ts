import { create } from "zustand";

interface errorStoreType {
  errors: string[]
  appendError: (errMsg:string) => void;
  removeError: (idx:number) => void
  removeAllErrors: () => void
}

export const errorStore = create<errorStoreType>((set) => ({
  errors: [],
  appendError: (errMsg:string) => {
    set((state) => ({errors: [...state.errors, errMsg]}))
  },
  removeError: (idx:number) => {
    set((state) => ({errors: state.errors.filter((_, i) => i !== idx)}))
  },
  removeAllErrors: () => set({errors:[]})
}))