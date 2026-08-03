"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react"

/** Return `true` when the back action was handled (e.g. previous wizard step). */
type BackHandler = () => boolean

type FormsBackContextValue = {
  register: (handler: BackHandler) => () => void
  runBack: (fallback: () => void) => void
}

const FormsBackContext = createContext<FormsBackContextValue | null>(null)

export function FormsBackProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<BackHandler | null>(null)

  const register = useCallback((handler: BackHandler) => {
    handlerRef.current = handler
    return () => {
      if (handlerRef.current === handler) {
        handlerRef.current = null
      }
    }
  }, [])

  const runBack = useCallback((fallback: () => void) => {
    if (handlerRef.current?.()) return
    fallback()
  }, [])

  return (
    <FormsBackContext.Provider value={{ register, runBack }}>
      {children}
    </FormsBackContext.Provider>
  )
}

export function useFormsBack() {
  const ctx = useContext(FormsBackContext)
  if (!ctx) {
    throw new Error("useFormsBack must be used within FormsBackProvider")
  }
  return ctx
}

export function useRegisterFormsBackHandler(handler: BackHandler | null) {
  const ctx = useContext(FormsBackContext)
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    if (!ctx || !handler) return

    const wrapped: BackHandler = () => handlerRef.current?.() ?? false
    return ctx.register(wrapped)
  }, [ctx, handler != null])
}
