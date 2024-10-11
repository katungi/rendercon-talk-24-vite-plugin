import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from "node:fs/promises"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    readMePlugin()
  ],
})

function readMePlugin(): Plugin {
  let readmeFile: string;
  let outputFile: string;
  return {
    name: 'vite-plugin-readme',
    configResolved(config) {
      readmeFile = path.resolve(config.root, "../readme.md")
      outputFile = path.resolve(config.publicDir, "README.md")
    },

    configureServer(server) {
      server.watcher.add(readmeFile)
      server.watcher.on("change", async (file) => {
        if (file === readmeFile) await fs.copyFile(readmeFile, outputFile)
      })
    },

    async buildStart() {
      await fs.copyFile(readmeFile, outputFile)
    }, 
    handleHotUpdate({file, server}) {
      if (file === outputFile) {
        server.hot.send({type: "custom", event: "readme-update"})
      }
    }
  }
}