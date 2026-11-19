import { createApp } from "./src/app.js";
import { loadConfig } from "./src/config.js";

const config = loadConfig();
const app = createApp(config);

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Portfolio server listening on http://0.0.0.0:${config.port}`);
});
