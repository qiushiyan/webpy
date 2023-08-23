"use client";

import { PythonProvider } from "@webpy/react";

export default function Provider({ children }: { children: React.ReactNode }) {
	return <PythonProvider>{children}</PythonProvider>;
}
