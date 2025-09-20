async function drawFromJson(jsonFile) {
  const response = await fetch(jsonFile);
  const regions = await response.json();

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Calcular límites
  const allPoints = regions.flatMap(r => r.contour);
  const xs = allPoints.map(p => p[0]);
  const ys = allPoints.map(p => p[1]);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;
  const scale = Math.min(600 / width, 600 / height);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Dibujar cada región
  regions.forEach(region => {
    const [r, g, b] = region.color;
    const color = `rgb(${r}, ${g}, ${b})`;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.beginPath();

    region.contour.forEach(([px, py], i) => {
      const x = (px - centerX) * scale + canvas.width / 2;
      const y = (centerY - py) * scale + canvas.height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
}

drawFromJson("sunflowers.json");
