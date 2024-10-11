import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
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
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <h2>README.md</h2>
        <pre style={{ fontSize: "24px" }}>{readme}</pre>
      </div>
    </>
  )
}

export default App
