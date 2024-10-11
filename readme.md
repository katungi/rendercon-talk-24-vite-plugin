# Building a Vite Plugin: README Live Reloader

This guide demonstrates how to create a Vite plugin that watches and live-reloads README content from an external directory into your Vite application. We'll explore various Vite plugin hooks and how they can be used to enhance your development workflow.

## The Concept

Our plugin does the following:

1. Reads a README file from a parent directory
2. Copies it to the public folder
3. Watches for changes and updates the UI in real-time

## Plugin Implementation

Let's break down the implementation and understand the key Vite plugin hooks:

```typescript
function readMePlugin(): Plugin {
  let readmeFile: string;
  let outputFile: string;
  
  return {
    name: 'vite-plugin-readme',
    
    // 1. Configuration Hook
    configResolved(config) {
      readmeFile = path.resolve(config.root, "../readme.md")
      outputFile = path.resolve(config.publicDir, "README.md")
    },
    
    // 2. Development Server Hook
    configureServer(server) {
      server.watcher.add(readmeFile)
      server.watcher.on("change", async (file) => {
        if (file === readmeFile) await fs.copyFile(readmeFile, outputFile)
      })
    },
    
    // 3. Build Hook
    async buildStart() {
      await fs.copyFile(readmeFile, outputFile)
    },
    
    // 4. Hot Module Replacement Hook
    handleHotUpdate({file, server}) {
      if (file === outputFile) {
        server.hot.send({type: "custom", event: "readme-update"})
      }
    }
  }
}
```

### Understanding the Hooks

1. **`configResolved`**: This hook runs after Vite's config is resolved. We use it to set up file paths based on the final configuration.

2. **`configureServer`**: Called when setting up the development server. We:
   - Add the README file to the server's file watcher
   - Set up a listener to copy the file when changes occur

3. **`buildStart`**: Runs when the build starts. We ensure the README is copied before building.

4. **`handleHotUpdate`**: Manages hot module replacement. When our output file changes, we send a custom event to the client.

## Frontend Implementation

The frontend code listens for updates and displays the README content:

```jsx
function App() {
  const [readme, setReadme] = useState("loading...")

  useEffect(() => {
    function fetchReadme() {
      fetch("public/README.md")
        .then((response) => response.text())
        .then((text) => setReadme(text))
    }
    fetchReadme()

    if(import.meta.hot) import.meta.hot.on("readme-update", fetchReadme)
  }, [])

  return (
    // ... render content ...
    <pre>{readme}</pre>
  )
}
```

This code:

1. Fetches and displays the README on initial load
2. Listens for our custom `readme-update` event to refresh content

## Using the Plugin

To use the plugin in your Vite config:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    readMePlugin()
  ],
})
```

## Key Concepts

1. **Plugin Hooks**: Vite plugins use hooks to tap into different parts of the build process:
   - Configuration hooks (`configResolved`)
   - Server hooks (`configureServer`)
   - Build hooks (`buildStart`)
   - HMR hooks (`handleHotUpdate`)

2. **File Watching**: Vite provides a powerful file watching system through `server.watcher`.

3. **Custom HMR Events**: You can send custom events from the server to the client using `server.hot.send()`.

4. Configure the source and destination paths

## Conclusion

Building Vite plugins is a powerful way to enhance your development workflow. By understanding the various hooks available, you can create plugins that seamlessly integrate with Vite's build process and development server to automate tasks and improve your productivity.