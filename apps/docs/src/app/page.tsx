"use client"

import { usePython } from '@webpy/react'
import { FormEvent, useEffect, useState } from 'react'

export default function Home() {
  const {isLoading, runPython, getBanner, installPackages} = usePython()
  const [input, setInput] = useState("")
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await installPackages("pandas")
    console.log(await runPython(input))
  }

  useEffect(() => {
    if (!isLoading) {
      installPackages("pandas")
    }
  }, [isLoading])

  if (isLoading) {
    return "is loading"
  }

  return (
    <main>
      <pre>
        <form onSubmit={handleSubmit}>
          <textarea cols={30} rows={10} value={input} onChange={(e) => setInput(e.target.value)} style={{
            color: "black"
          }} />
          <button type='submit'>run</button>
        </form>
      </pre>
    </main>
  )
}
