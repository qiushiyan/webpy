import type { loadPyodide, PyodideInterface, PyProxy } from "pyodide";

export interface Micropip {
	install: (packages: string[]) => Promise<void>;
}

type loadPyodideOptions = Parameters<typeof loadPyodide>[0];

export type PyodideResult = number | string | undefined | PyProxy;

type PyodideRunPythonOptions = Parameters<
	PyodideInterface["runPythonAsync"]
>[1];

export type RunPythonOptions = PyodideRunPythonOptions & {
	shortenError?: boolean;
};

type ExtraInitArgs = {
	packages?: string[];
	patchHttp?: boolean;
	setUpCode?: string;
};

export type InitializePythonOptions = ExtraInitArgs & loadPyodideOptions;
