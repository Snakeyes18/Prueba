async function drawFromJson(jsonFile, nombre = "PARA: VANELLY") { 
  const response = await fetch(jsonFile);
  const regions = await response.json();

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Calcular límites
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
  const chunkSize = 5;
  const delay = 1500;

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
    } else {
      // Cuando termina el dibujo, iniciar animación de letras
      drawNombreAnimado(nombre);
    }
  }

  drawNextChunk();

  // Animación de nombre letra por letra
  function drawNombreAnimado(nombre) {
    let letraIndex = 0;
    const letraDelay = 300;
    const nombreArr = nombre.split("");

    function dibujarLetra() {
      if (letraIndex <= nombreArr.length) {
        ctx.fillStyle = "white";
        ctx.font = "italic 30px Lucida Handwriting";
        ctx.textAlign = "center";

        // Limpiar la zona del texto antes de dibujar
        const textY = canvas.height - 100;
        const textHeight = 40;
        ctx.clearRect(0, textY - textHeight + 5, canvas.width, textHeight);

        // Dibujar el nombre hasta la letra actual
        ctx.fillText(nombreArr.slice(0, letraIndex).join(""), canvas.width / 2, textY);

        letraIndex++;
        setTimeout(dibujarLetra, letraDelay);
      }
    }

    dibujarLetra();
  }
}

// Llamada a la función
drawFromJson("sunflowers.json", "PARA: VANELLY");




