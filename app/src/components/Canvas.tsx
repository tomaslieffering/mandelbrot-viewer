import { useRef, useEffect, useState } from 'react';
import init, * as mandelbrot from "mandelbrot-renderer/mandelbrot_renderer";

type CanvasProps = {
	width: number,
	height: number,
	count: number
}

const wasm = await init();

export function Canvas(props: CanvasProps) {
	const { width, height, count } = props;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mandelbrotMemory = new Uint8Array(wasm.memory.buffer);

	const canvasXSize = 1280;
	const canvasYSize = 720;

	const [scale, setScale] = useState(1);

  const drawMandelbrot = (imageData, context, canvas) => {
		
    mandelbrot.generate_mandelbrot(count, 0, 1);

    const outputPointer = mandelbrot.get_output_buffer_pointer();
    const imageDataArray = mandelbrotMemory.slice(
      outputPointer,
      outputPointer + (canvasYSize * canvasXSize * 4)
    );

    // Set the values to the canvas image data
    imageData.data.set(imageDataArray);

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Place the new generated checkerboard onto the canvas
    context.putImageData(imageData, 0, 0);
  };

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas!.getContext('2d');
		
		const imageData = context!.createImageData(
			canvas!.width,
			canvas!.height
		);

		drawMandelbrot(imageData, context, canvas);
	}, [count]);

	const handleCanvasClick = (e) => {
		
		console.log(e.clientX - canvasRef.current!.getBoundingClientRect().left)
		console.log(e.clientY - canvasRef.current!.getBoundingClientRect().top);
	}

	return <canvas onClick={handleCanvasClick} ref={canvasRef} width={width} height={height} />;
}