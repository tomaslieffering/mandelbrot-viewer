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
	
	const canvasXSize = 1280;
	const canvasYSize = 720;

	const realXSize = 3.55;
	const realYSize = 2;
	
	const [scale, setScale] = useState(1);

	const [center, setCenter] = useState({
		x: 0,
		y: 0,
	})
	
	useEffect(() => {
		const mandelbrotMemory = new Uint8Array(wasm.memory.buffer);
		const canvas = canvasRef.current;
		const context = canvas!.getContext('2d');
		
		const imageData = context!.createImageData(
			canvas!.width,
			canvas!.height
		);

		mandelbrot.generate_mandelbrot(center.x, center.y, scale);

    const outputPointer = mandelbrot.get_output_buffer_pointer();
    const imageDataArray = mandelbrotMemory.slice(
      outputPointer,
      outputPointer + (canvasYSize * canvasXSize * 4)
    );

    // Set the values to the canvas image data
    imageData.data.set(imageDataArray);

    // Clear the canvas
    context!.clearRect(0, 0, canvas!.width, canvas!.height);

    // Place the new generated checkerboard onto the canvas
    context!.putImageData(imageData, 0, 0);
	}, [scale, center]);

	const handleCanvasClick = (e) => {
		if (e.detail === 2) {
			const xPixel = e.clientX - canvasRef.current!.getBoundingClientRect().left;
			const yPixel = e.clientY - canvasRef.current!.getBoundingClientRect().top;
	
			const xCoord = ((xPixel / canvasXSize)  * (realXSize / scale) - ((3.55 / 2.0) / scale) - center.x) * -1
			const yCoord = ((yPixel / canvasYSize) * (realYSize / scale) - (1.0 / scale) - center.y) * -1

			setCenter({
				x: xCoord,
				y: yCoord
			})
			setScale(scale * 10)
		}
		
	}

	return <canvas onClick={handleCanvasClick} ref={canvasRef} width={width} height={height} />;
}