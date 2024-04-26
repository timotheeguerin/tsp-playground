import crossSpawn from "cross-spawn";
import { _parse } from "cross-spawn";
import { spawn } from "child_process";

console.log("PArsd", _parse("npm", ["ls"]));
export function execAsync(
  spawnFn: any,
  cmd: string,
  args: string[],
  opts = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    const child = spawnFn(cmd, args, opts);
    let stdall = Buffer.from("");
    let stdout = Buffer.from("");
    let stderr = Buffer.from("");

    if (child.stdout) {
      child.stdout.on("data", (data) => {
        stdout = Buffer.concat([stdout, data]);
        stdall = Buffer.concat([stdall, data]);
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (data) => {
        stderr = Buffer.concat([stderr, data]);
        stdall = Buffer.concat([stdall, data]);
      });
    }

    child.on("error", (err) => {
      reject(err);
    });

    child.on("close", (code) => {
      resolve({ code, stdout, stderr, stdall });
    });
  });
}

try {
  await execAsync(crossSpawn, "npm", ["ls"]);
} catch (error) {
  console.error("-----FAILED WITH CROSS SPAWN-----");
  console.error(error);
  console.error("-".repeat(50));
}

if (process.platform === "win32") {
  try {
    await execAsync(crossSpawn, "npm.cmd", ["ls"]);
  } catch (error) {
    console.error("-----FAILED WITH CROSS SPAWN .cmd-----");
    console.error(error);
    console.error("-".repeat(50));
  }
}

try {
  await execAsync(spawn, "npm", ["ls"], {
    shell: process.platform === "win32",
  });
} catch (error) {
  console.error("-----FAILED WITH REGULAR SPAWN-----");
  console.error(error);
  console.error("-".repeat(50));
}
