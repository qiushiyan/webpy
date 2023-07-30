# About

webpy is a JavaScript library for running Python in web apps. It's a wrapper of [pyodide](https://pyodide.org) with couple of abstractions and runs in a web worker.

# Usage

```
npm install webpy
```

```js
import { initializePython } from "webpy"

const start = async () => {
    const python = await initializePython()
    return await python.runPython("list(map(abs, [1, -2, 3]))")
}

start()
// returns "[1, 2, 3]"

```

## React

```
npm install @webpy/react
```

```js
export function() {
    const {
        runPython,
        installPackage,
        isLoading,
        isInstalling
    } = usePython()

    useEffect(() => {
        if (!isLoading) {
            runPython("abs(-1)").then(console.log)
        }
    }, [isLoading])

    if (isLoading) {
        return "python is loading"
    }

    ...
}

```


# Credits

webpy is inspired by [react-py](https://github.com/elilambnz/react-py).
