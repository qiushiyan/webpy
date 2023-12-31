"use client";

import { PythonContext, usePython } from "@webpy/react";
import { FormEvent, useContext, useEffect, useState } from "react";

export default function Home() {
	const {
		isLoading,
		runPython,
		installPackages,
		interruptExecution,
		isRunning,
	} = useContext(PythonContext);
	const [result, setResult] = useState<string | null>("");
	const [input, setInput] = useState("");
	const handleRun = async () => {
		const res = await runPython(input);
		setResult(res.error ? res.error : res.output);
	};

	return (
		<main>
			<pre>
				<form>
					<textarea
						cols={30}
						rows={10}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						style={{
							color: "black",
						}}
					/>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							handleRun();
						}}
					>
						run
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							interruptExecution();
						}}
					>
						cancel
					</button>
					<p>{isRunning ? "running" : "not running"}</p>
				</form>
			</pre>
			<pre>{result}</pre>
		</main>
	);
}
