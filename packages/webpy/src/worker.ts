import { expose, Remote } from "comlink";
import type { loadPyodide, PyodideInterface, PyProxy } from "pyodide";
import { Micropip, RunPythonOptions, InitializePythonOptions } from "./types";
import { shortenPythonErrorStack } from "./utils";
importScripts('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js')
declare global {
    interface Window {
        loadPyodide: typeof loadPyodide;
        pyodide: PyodideInterface;
    }
}

const initConsoleCode = `
from pyodide.console import PyodideConsole, repr_shorten, BANNER
`;

// const setUpCode = `
// import js
// class Placeholder:
//     def __init__(self, *args, **kwargs) -> None:
//         return
//     def __getattr__(self, __name: str):
//         return Placeholder
// js.document = Placeholder()
// def show_matplotlib(plt):
//     import base64
//     import io

//     buf = io.BytesIO()
//     plt.savefig(buf, format="png")
//     buf.seek(0)
//     img_str = "data:image/png;base64," + base64.b64encode(buf.read()).decode("UTF-8")
//     buf.close()
//     return img_str
// `;

type PyodideResult = PyProxy | number | string | undefined;

const python = {
    init: async (
        { packages, patchHttp = true, ...pyodideOptions }: InitializePythonOptions,
    ) => {
        self.pyodide = await self.loadPyodide({
            ...pyodideOptions,
        });

        // pre-load packages
        await self.pyodide.loadPackage("micropip");
        const micropip = self.pyodide.pyimport("micropip") as unknown as Micropip;
        if (packages) {
            micropip.install(packages);
        }

        if (patchHttp) {
            // patch network requests
            await self.pyodide.loadPackage(["pyodide-http"]);
            const pyodide_http = self.pyodide.pyimport("pyodide_http");
            pyodide_http.patch_all();
        }

    },
    getBanner: async () => {
        const namespace = self.pyodide.globals.get("dict")();
        await self.pyodide.runPythonAsync(initConsoleCode, { globals: namespace });
        const banner = namespace.get("BANNER") as string;
        namespace.destroy();
        return banner;
    },


    runPython: async (code: string, options?: RunPythonOptions) => {
        const serializer = options?.serializer ? options.serializer : String
        const shortenError = options?.shortenError || true
        try {
            const result: PyodideResult = await self.pyodide.runPythonAsync(code, options);

            return {
                output: serializer(result),
                error: null,
            }
        } catch (err) {
            return {
                output: null,
                error: shortenError ? shortenPythonErrorStack(String(err)) : String(err)
            }
        }

    },

    installPackage: async (packages: string | string[]) => {
        const micropip = self.pyodide.pyimport("micropip") as unknown as Micropip;
        micropip.install(typeof packages === "string" ? [packages] : packages);
    }
};

export type PythonWorker = Remote<typeof python>;

expose(python);