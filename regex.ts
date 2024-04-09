const escapeColors = "(?:\\x1b\\[[\\d;]+m)*";
const file = `${escapeColors}([^\\s][^\x1B]*)${escapeColors}`;
const line = `${escapeColors}(\\d+)${escapeColors}`;
const column = `${escapeColors}(\\d+)${escapeColors}`;
const severity = `${escapeColors}(error|warning)${escapeColors}`;
const code = `${escapeColors}([a-z0-9\\-]+)${escapeColors}`;
const message = `${escapeColors}([^\x1B]*)${escapeColors}`;

export const TypeSpecProblemMatchRegex = `^${file}:${line}:${column}\\s+-\\s+${severity}\\s+${code}\\s*:\\s*${message}$`;
console.log("A", JSON.stringify(TypeSpecProblemMatchRegex));