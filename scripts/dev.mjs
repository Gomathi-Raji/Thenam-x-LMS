import { spawn } from "node:child_process";
import net from "node:net";

const isWindows = process.platform === "win32";
const nodeCommand = process.execPath;
const serverArgs = ["server/index.js"];
const apiPort = Number(process.env.PORT || 4000);

const children = [];

function startProcess(command, args, label) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: isWindows,
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (signal || (typeof code === "number" && code !== 0)) {
      stopAll(child);
      const exitCode = typeof code === "number" ? code : 1;
      process.exit(exitCode);
    }
  });

  child.on("error", (error) => {
    console.error(`[${label}]`, error);
    stopAll(child);
    process.exit(1);
  });

  children.push(child);
  return child;
}

function stopAll(origin) {
  for (const child of children) {
    if (child === origin || child.killed) continue;
    child.kill();
  }
}

function isPortOpen(port) {
  return new Promise((resolve) => {
    const hosts = ["127.0.0.1", "::1"];
    let pending = hosts.length;

    const finish = (result) => {
      pending -= 1;
      if (result || pending === 0) resolve(result);
    };

    for (const host of hosts) {
      const socket = net.connect({ port, host });

      const done = (result) => {
        socket.removeAllListeners();
        socket.destroy();
        finish(result);
      };

      socket.setTimeout(500);
      socket.on("connect", () => done(true));
      socket.on("timeout", () => done(false));
      socket.on("error", () => done(false));
    }
  });
}

async function main() {
  process.on("SIGINT", () => {
    stopAll();
    process.exit(130);
  });

  process.on("SIGTERM", () => {
    stopAll();
    process.exit(143);
  });

  const apiAlreadyRunning = await isPortOpen(apiPort);

  if (apiAlreadyRunning) {
    console.log(`[dev] API server already listening on ${apiPort}, reusing it.`);
  } else {
    startProcess(nodeCommand, serverArgs, "api");
  }

  startProcess("vite", ["dev"], "vite");
}

main().catch((error) => {
  console.error("[dev] Failed to start development processes.", error);
  process.exit(1);
});
