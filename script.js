async function drawFromJson(jsonFile) {
  const response = await fetch(jsonFile);
  const regions = await response.json();

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Calcular límites sin usar spread
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  regions.forEach(r => {
    r.contour.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const scale = Math.min(600 / width, 600 / height);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  let index = 0;
  const chunkSize = 5; // dibuja 5 regiones por frame, puedes ajustar para más lento o más rápido
  const delay = 500; // retraso en ms entre frames, también ajustable

  function drawNextChunk() {
    for (let i = 0; i < chunkSize && index < regions.length; i++, index++) {
      const region = regions[index];
      const [r, g, b] = region.color;
      const color = `rgb(${r}, ${g}, ${b})`;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      ctx.beginPath();
      region.contour.forEach(([px, py], i) => {
        const x = (px - centerX) * scale + canvas.width / 2;
        const y = (centerY - py) * scale + canvas.height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    if (index < regions.length) {
      setTimeout(() => requestAnimationFrame(drawNextChunk), delay);
    }
  }

  drawNextChunk();
}

// Llamada a la función
drawFromJson("sunflowers.json");

