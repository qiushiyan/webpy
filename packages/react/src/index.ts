"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	initializePython,
	PythonWorker,
	InitializePythonOptions,
	RunPythonOptions,
} from "webpy";

export const usePython = (options?: InitializePythonOptions) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [isInstalling, setIsInstalling] = useState(false);
	const pythonRef = useRef<PythonWorker>();

	const createPython = async () => {
		setIsLoading(true);
		const worker = await initializePython(options);
		pythonRef.current = worker;
		setIsLoading(false);
	};

	const getPython = () => {
		if (!pythonRef.current) {
			throw new Error("Python is not initialized");
		}

		return pythonRef.current;
	};

	useEffect(() => {
		createPython();
	}, []);

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
		const python = getPython();
		setIsRunning(true);
		const result = await python.getBanner();
		setIsRunning(false);
		return result;
	}, []);

	return {
		isLoading,
		isInstalling,
		isRunning,
		runPython,
		installPackages,
		getBanner,
	};
};
