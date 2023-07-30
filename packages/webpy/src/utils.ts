export const shortenPythonErrorStack = (text: string) => {
    return text.replace(/^\s*at.+$/gm, "").trim();
};
