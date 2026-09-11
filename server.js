import { env } from "./src/config/env.js";
import app from "./src/app.js";

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});