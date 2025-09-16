import { server } from "./api/server.js";
import { port } from "./config.js";
import packageJson from "../package.json" with { type: "json" };

console.log(`Starting ${packageJson.name} v${packageJson.version}...`);

server.listen(port, () => {
  console.log("Server listening", server.address());
});
