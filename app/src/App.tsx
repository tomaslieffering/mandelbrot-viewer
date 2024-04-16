import { useState } from 'react'
import { Canvas } from './components/Canvas';

function App() {
  const [count, setCount] = useState(-5)

  return (
    <>
      <h1>Vite + React</h1>
      <div>
        <button onClick={() => setCount((count) => count + 0.2)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Canvas width={1280}height={720} count={count}/>
    </>
  )
}

export default App
