## Mandelbrot Viewer

A mandelbrot build with React JS, Rust and WebAssembly

### To build

1. Compile Rust into WebAssembly by running `wasm-pack build --target web` inside the `mandelbrot-renderer` directory
2. Install npm packages with `npm install`. This will also include the now locally available `mandelbrot-renderer` package
3. Run development server with `npm run dev`