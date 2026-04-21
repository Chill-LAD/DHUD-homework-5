const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

video.addEventListener("play", function () {
    processFrame();
});

function processFrame() {
    if (video.paused || video.ended) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = frame.data;

    let width = canvas.width;
    let height = canvas.height;

    // chuyển sang grayscale trước
    let gray = new Array(width * height);

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        gray[i / 4] = 0.3 * r + 0.59 * g + 0.11 * b;
    }

    // output
    let output = ctx.createImageData(width, height);

    const Gx = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];
    const Gy = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];

    // Sobel
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {

            let i = y * width + x;
            let sumX = 0;
            let sumY = 0;

            for (let j = -1; j <= 1; j++)
            {
                if(y + j < 0 || y + j >= height)
                    continue;

                for (let i = -1; i <= 1; i++)
                {
                    if(x + i < 0 || x + i >= width)
                        continue;
                    
                    sumX += gray[(y + j) * width + (x + i)] * Gx[j + 1][i + 1];
                    sumY += gray[(y + j) * width + (x + i)] * Gy[j + 1][i + 1];
                }
            }


            // độ lớn gradient
            let magnitude = Math.sqrt(sumX * sumX + sumY * sumY);

            // threshold nhẹ cho đẹp
            let edge = magnitude > 100 ? 255 : magnitude;

            let idx = i * 4;
            output.data[idx] = edge;
            output.data[idx + 1] = edge;
            output.data[idx + 2] = edge;
            output.data[idx + 3] = 255;
        }
    }

    ctx.putImageData(output, 0, 0);

    requestAnimationFrame(processFrame);
}