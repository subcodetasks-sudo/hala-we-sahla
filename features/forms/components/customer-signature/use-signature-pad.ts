"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type SignatureCanvas from "react-signature-canvas"

type PointGroup = NonNullable<
  ReturnType<SignatureCanvas["toData"]>
>[number]

export function useSignaturePad() {
  const canvasRef = useRef<SignatureCanvas | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [canUndo, setCanUndo] = useState(false)
  const historyRef = useRef<PointGroup[][]>([])

  const syncState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      setIsEmpty(true)
      setCanUndo(false)
      return
    }

    setIsEmpty(canvas.isEmpty())
    setCanUndo(historyRef.current.length > 0)
  }, [])

  const clear = useCallback(() => {
    canvasRef.current?.clear()
    historyRef.current = []
    syncState()
  }, [syncState])

  const undo = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || historyRef.current.length === 0) return

    historyRef.current.pop()
    const previous = historyRef.current[historyRef.current.length - 1] ?? []
    canvas.fromData(previous)
    syncState()
  }, [syncState])

  const handleBegin = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    historyRef.current.push(canvas.toData())
  }, [])

  const handleEnd = useCallback(() => {
    syncState()
  }, [syncState])

  const exportTrimmedPng = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current
    if (!canvas || canvas.isEmpty()) return null

    const trimmed = canvas.getTrimmedCanvas()
    return await new Promise((resolve) => {
      trimmed.toBlob((blob) => resolve(blob), "image/png")
    })
  }, [])

  const loadFromImage = useCallback(
    (imageUrl: string) => {
      const tryLoad = (attempts = 0) => {
        const canvas = canvasRef.current
        if (!canvas) {
          if (attempts < 12) {
            window.setTimeout(() => tryLoad(attempts + 1), 40)
          }
          return
        }

        const image = new Image()
        image.crossOrigin = "anonymous"
        image.onload = () => {
          canvas.clear()
          const context = canvas.getCanvas().getContext("2d")
          if (!context) return

          const target = canvas.getCanvas()
          const scale = Math.min(
            target.width / image.width,
            target.height / image.height,
            1,
          )
          const width = image.width * scale
          const height = image.height * scale
          const x = (target.width - width) / 2
          const y = (target.height - height) / 2
          context.drawImage(image, x, y, width, height)
          historyRef.current = [canvas.toData()]
          syncState()
        }
        image.src = imageUrl
      }

      tryLoad()
    },
    [syncState],
  )

  useEffect(() => {
    function handleResize() {
      const canvas = canvasRef.current
      if (!canvas) return
      const data = canvas.toData()
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const element = canvas.getCanvas()
      const parent = element.parentElement
      if (!parent) return

      const width = parent.clientWidth
      const height = parent.clientHeight
      element.width = width * ratio
      element.height = height * ratio
      element.style.width = `${width}px`
      element.style.height = `${height}px`
      const context = element.getContext("2d")
      context?.scale(ratio, ratio)
      canvas.clear()
      if (data.length) canvas.fromData(data)
      syncState()
    }

    window.addEventListener("resize", handleResize)
    const frame = window.requestAnimationFrame(handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.cancelAnimationFrame(frame)
    }
  }, [syncState])

  return {
    canvasRef,
    isEmpty,
    canUndo,
    clear,
    undo,
    handleBegin,
    handleEnd,
    exportTrimmedPng,
    loadFromImage,
    syncState,
  }
}
