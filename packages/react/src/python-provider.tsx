"use client";

import { proxy } from "comlink";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
	InitializePythonOptions,
	PythonWorker,
	RunPythonOptions,
	initializePython,
} from "webpy";

type PythonProviderProps = {
	children: React.ReactNode;
	options?: InitializePythonOptions;
};

type PythonContextValue = {
	isLoading: boolean;
	isInstalling: boolean;
	isRunning: boolean;
	runPython: (
		code: string,
		options?: RunPythonOptions,
	) => Promise<
		| {
				output: string;
				type: string | null;
				error: null;
		  }
		| {
				output: null;
				type: null;
				error: string;
		  }
	>;
	installPackages: (packages: string | string[]) => Promise<void>;
	getBanner: () => Promise<string | undefined>;
	interruptExecution: () => Promise<void>;
};

export const PythonContext = createContext({} as PythonContextValue);

export const PythonProvider = ({ children, options }: PythonProviderProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [isInstalling, setIsInstalling] = useState(false);

	const pythonRef = useRef<PythonWorker>();

	const createPython = async () => {
		if (!isLoading && !pythonRef.current) {
			setIsLoading(true);
			const worker = await initializePython({
				...options,
				stdout: options?.stdout ? proxy(options.stdout) : undefined,
			});
			pythonRef.current = worker;
			setIsLoading(false);
		}
	};

	const getPython = () => {
		if (!pythonRef.current) {
			throw new Error("Python is not initialized");
		}

		return pythonRef.current as PythonWorker;
	};

	const runPython = useCallback(
		async (code: string, options?: RunPythonOptions) => {
			const python = getPython();
			setIsRunning(true);
			const result = await python.runPython(code, options);
			setIsRunning(false);

			return result;
		},
		[],
	);

	const installPackages = useCallback(async (packages: string | string[]) => {
		const python = getPython();
		setIsRunning(true);
		setIsInstalling(true);
		const result = await python.installPackage(packages);
		setIsInstalling(false);
		setIsRunning(false);
		return result;
	}, []);

	const getBanner = useCallback(async () => {
		if (pythonRef.current) {
			setIsRunning(true);
			const result = await pythonRef.current.getBanner();
			setIsRunning(false);
			return result;
		}
	}, []);

	const interruptExecution = useCallback(async () => {
		if (pythonRef.current) {
			await pythonRef.current.interruptExecution();
			setIsRunning(false);
		}
	}, []);

	useEffect(() => {
		createPython();
	}, []);

	return (
		<PythonContext.Provider
			value={{
				isLoading,
				isInstalling,
				isRunning,
				runPython,
				installPackages,
				getBanner,
				interruptExecution,
			}}
		>
			{children}
		</PythonContext.Provider>
	);
};
