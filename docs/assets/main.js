const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.getElementById('y').textContent = new Date().getFullYear();

// A restrained HS-AFM-inspired raster used as an illustrative research figure.
(() => {
  const canvas = document.getElementById('afm');
  const context = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width;
  let height;
  let time = 0;

  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const surface = (x, y, t) => {
    let value = Math.sin(x * .01 + t * .32) * Math.cos(y * .013 - t * .21) * 7;
    for (let i = 0; i < 6; i += 1) {
      const cx = (.47 + .105 * i) * width + Math.sin(t * .22 + i * 1.7) * 24;
      const cy = (.24 + .13 * ((i * 2) % 5)) * height + Math.cos(t * .18 + i) * 22;
      const radius = Math.hypot(x - cx, y - cy);
      value += 30 * Math.exp(-Math.pow((radius - 58 - i * 3) / 14, 2));
      value -= 8 * Math.exp(-Math.pow(radius / 34, 2));
    }
    return value;
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    const rows = 54;
    const gap = height / rows * 1.12;
    const scanRow = (time * 20) % (rows + 12);

    for (let row = 0; row < rows; row += 1) {
      const baseline = height * .09 + row * gap;
      context.beginPath();
      for (let x = 0; x <= width; x += 5) {
        const y = baseline - surface(x, baseline, time);
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      const isScan = Math.abs(row - scanRow) < 1.1;
      const lateRow = row / rows;
      context.strokeStyle = isScan
        ? 'rgba(123,62,77,.72)'
        : `rgba(49,95,125,${.08 + .29 * lateRow})`;
      context.lineWidth = isScan ? 1.6 : 1;
      context.stroke();
    }

    context.beginPath();
    context.moveTo(width * .44, height * .78);
    context.lineTo(width * .96, height * .78);
    context.strokeStyle = 'rgba(23,54,80,.5)';
    context.lineWidth = 1;
    context.stroke();
  };

  const loop = () => {
    time += .02;
    draw();
    if (!reduceMotion) requestAnimationFrame(loop);
  };

  addEventListener('resize', resize);
  resize();
  loop();
})();
