use wasm_bindgen::prelude::*;

const OUTPUT_X_SIZE: usize = 1280;
const OUTPUT_Y_SIZE: usize = 720;
const MAX_ITERATIONS: u32 = 255;

const OUTPUT_BUFFER_SIZE: usize = OUTPUT_X_SIZE * OUTPUT_Y_SIZE * 4;
static mut OUTPUT_BUFFER: [u8; OUTPUT_BUFFER_SIZE] = [0; OUTPUT_BUFFER_SIZE];

#[wasm_bindgen]
pub fn get_output_buffer_pointer() -> *const u8 {
  let pointer: *const u8;
  unsafe {
    pointer = OUTPUT_BUFFER.as_ptr();
  }

  return pointer;
}

fn get_color(i: u32) -> u8 {
    if i > MAX_ITERATIONS {
        return 255;
    }
    let color = (((i as f64) / (MAX_ITERATIONS as f64)) * 255.0).round() as u8;
    return color;
}

#[wasm_bindgen]
pub fn generate_mandelbrot(
        x_center: f64,
        y_center: f64,
        scale: f64
    ) {

    for x in 0..OUTPUT_X_SIZE {
        let x_scale_pos = ((x as f64) / (OUTPUT_X_SIZE as f64)) * (3.5 / scale) - (2.5 / scale) - x_center;
        for y in 0..OUTPUT_Y_SIZE {
            let y_scale_pos = ((y as f64) / (OUTPUT_Y_SIZE as f64)) * (2.0 / scale) - (1.0 / scale) - y_center;
            
            let mut x_calc = 0.0;
            let mut y_calc = 0.0;

            let mut iteration: u32 = 0;

            while x_calc * x_calc + y_calc * y_calc <= 4.0 && iteration < MAX_ITERATIONS {
                let x_temp = x_calc * x_calc - y_calc * y_calc + x_scale_pos;
                y_calc = 2.0 * x_calc * y_calc + y_scale_pos;
                x_calc = x_temp;
                iteration = iteration + 1;
            }

            let color: u8 = get_color(iteration);
            let pixel_number: usize = y * OUTPUT_X_SIZE + x;
            let pixel_rgba_index: usize = pixel_number * 4;
            
            unsafe {
                OUTPUT_BUFFER[pixel_rgba_index + 0] = color; // Red
                OUTPUT_BUFFER[pixel_rgba_index + 1] = color; // Green
                OUTPUT_BUFFER[pixel_rgba_index + 2] = color; // Blue
                OUTPUT_BUFFER[pixel_rgba_index + 3] = 255; // Alpha (Always Opaque)
            }
        }
    }
}