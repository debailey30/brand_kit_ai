import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Location of your Vite build output (usually 'dist')
const frontendDir = path.join(__dirname, '..', 'dist');

const app = express();

// Serve all static files from the Vite build
app.use(express.static(frontendDir));

// Fallback: Serve index.html for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

// Place your existing API routes above the wildcard route if needed.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
