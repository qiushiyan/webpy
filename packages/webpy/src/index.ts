import { Remote, proxy, wrap } from "comlink";
import { InitializePythonOptions } from "./types";
import { PythonWorker } from "./worker";

export type { PythonWorker } from "./worker";
export type {
	InitializePythonOptions,
	PyodideResult,
	RunPythonOptions,
} from "./types";

export const initializePython = async (options?: InitializePythonOptions) => {
	const worker = new Worker(new URL("./worker", import.meta.url));
	const workerWrapped: Remote<PythonWorker> = wrap(worker);
	await workerWrapped.init(options || {});

	return workerWrapped;
};
