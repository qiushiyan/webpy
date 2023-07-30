"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { initializePython, PythonWorker, InitializePythonOptions, RunPythonOptions } from "webpy";

export const usePython = (options?: InitializePythonOptions) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isInstalling, setIsInstalling] = useState(false)
    const pythonRef = useRef<PythonWorker>()

    const createPython = async () => {
        setIsLoading(true)
        const worker = await initializePython(options)
        pythonRef.current = worker
        setIsLoading(false)
    }

    useEffect(() => {
        createPython()
    }, [])

    const runPython = useCallback(async (code: string, options?: RunPythonOptions) => {
        if (pythonRef.current) {
            return await pythonRef.current.runPython(code, options)
        }
    }, [])

    const installPackages = useCallback(async (packages: string | string[]) => {
        if (pythonRef.current) {
            setIsInstalling(true)
            await pythonRef.current.installPackage(packages)
            setIsInstalling(false)
        }
    }, [])

    const getBanner = useCallback(async () => {
        if (pythonRef.current) {
            return await pythonRef.current.getBanner()
        }
    }, [])


    return {
        isLoading,
        isInstalling,
        runPython,
        installPackages,
        getBanner
    }
}