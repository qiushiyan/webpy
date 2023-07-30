import { initializePython } from "../src";
import {it, expect} from "vitest"


it("runs python code", async () => {
    const python = await initializePython({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
    });

    const result = await python.runPython("1 + 1")
    expect(result).toBe(2)

})