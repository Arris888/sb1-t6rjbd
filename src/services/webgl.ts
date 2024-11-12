export class WebGLService {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;

  constructor() {
    this.canvas = document.createElement('canvas');
    const gl = this.canvas.getContext('webgl');
    if (!gl) throw new Error('WebGL not supported');
    this.gl = gl;
  }

  public async generateDisplacementMap(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      
      image.onload = () => {
        // Set canvas size to match image
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        
        // Get 2D context for simpler image processing
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get 2D context'));
          return;
        }

        // Set up temporary canvas
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        
        // Draw image
        ctx.drawImage(image, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        
        // Process pixels
        for (let i = 0; i < data.length; i += 4) {
          // Calculate grayscale value
          const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
          
          // Set RGB channels to grayscale value
          data[i] = gray;     // R
          data[i + 1] = gray; // G
          data[i + 2] = gray; // B
          // Keep alpha channel as is
        }
        
        // Put processed data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to data URL
        resolve(ctx.canvas.toDataURL('image/png'));
      };

      image.onerror = () => reject(new Error('Failed to load image'));
      image.src = imageUrl;
    });
  }
}