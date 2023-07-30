import type { loadPyodide, PyodideInterface } from "pyodide";

export interface Micropip {
	install: (packages: string[]) => Promise<void>;
}

type loadPyodideOptions = Parameters<typeof loadPyodide>[0];

export type RunPythonOptions = Parameters<PyodideInterface["runPythonAsync"]>[1] & {
	serializer: (val: any) => any
	shortenError: boolean;
}

type ExtraInitArgs = {
	packages?: string[];
	patchHttp?: boolean;
}

export type InitializePythonOptions = ExtraInitArgs & loadPyodideOptions;
