// Retro 8-bit sound engine — Web Audio API, no files needed
const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, duration, type = 'square', gainVal = 0.15, startTime = 0) {
    const c = getCtx();
    const t = c.currentTime + startTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration);
  }

  function sweep(freqStart, freqEnd, duration, type = 'square', gainVal = 0.15) {
    const c = getCtx();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t);
    osc.frequency.linearRampToValueAtTime(freqEnd, t + duration);
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration);
  }

  function noise(duration, gainVal = 0.1) {
    const c = getCtx();
    const t = c.currentTime;
    const bufSize = c.sampleRate * duration;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const gain = c.createGain();
    src.connect(gain);
    gain.connect(c.destination);
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    src.start(t);
  }

  // ── TETRIS ────────────────────────────────────────────
  const tetris = {
    move()   { tone(220, 0.04, 'square', 0.06); },
    rotate() { tone(330, 0.07, 'square', 0.08); },
    lock()   { tone(180, 0.1, 'square', 0.1); tone(140, 0.08, 'square', 0.08, 0.06); },
    clear(lines) {
      const freqs = [523, 659, 784, 1047];
      for (let i = 0; i < lines; i++) tone(freqs[i], 0.15, 'square', 0.12, i * 0.1);
    },
    tetrisClear() {
      [523,659,784,1047,1319].forEach((f,i) => tone(f, 0.18, 'square', 0.14, i*0.08));
    },
    gameOver() {
      [400,350,300,250,200,150].forEach((f,i) => tone(f, 0.15, 'sawtooth', 0.1, i*0.1));
    },
    // Korobeiniki-inspired arpeggio
    bgNote(freq) { tone(freq, 0.12, 'square', 0.07); },
  };

  // ── 2048 ──────────────────────────────────────────────
  const g2048 = {
    slide()  { tone(200, 0.06, 'sine', 0.08); },
    merge(val) {
      const f = Math.min(100 + Math.log2(val || 2) * 60, 1200);
      tone(f, 0.12, 'sine', 0.12);
      tone(f * 1.5, 0.1, 'sine', 0.08, 0.06);
    },
    win()  { [523,659,784,1047,1319].forEach((f,i) => tone(f,0.2,'sine',0.13,i*0.09)); },
    lose() { [300,250,200].forEach((f,i) => tone(f,0.2,'sawtooth',0.1,i*0.12)); },
  };

  // ── SNAKE ─────────────────────────────────────────────
  const snake = {
    eat()  { sweep(300, 600, 0.08, 'square', 0.12); },
    die()  { sweep(400, 100, 0.4, 'sawtooth', 0.15); noise(0.3, 0.08); },
    turn() { tone(160, 0.03, 'square', 0.04); },
  };

  // ── BREAKOUT ──────────────────────────────────────────
  const breakout = {
    paddle() { tone(300, 0.06, 'square', 0.1); },
    brick()  { tone(500, 0.05, 'square', 0.1); noise(0.05, 0.04); },
    wall()   { tone(200, 0.04, 'square', 0.07); },
    loseLife() { sweep(400, 100, 0.5, 'sawtooth', 0.15); },
    levelUp() { [523,659,784,1047].forEach((f,i) => tone(f,0.15,'square',0.12,i*0.08)); },
    gameOver() { [300,250,200,150].forEach((f,i) => tone(f,0.2,'sawtooth',0.1,i*0.12)); },
  };

  // ── SPACE INVADERS ────────────────────────────────────
  const invaders = {
    shoot()     { sweep(600, 200, 0.15, 'square', 0.1); },
    alienHit()  { noise(0.12, 0.15); tone(150, 0.1, 'sawtooth', 0.1); },
    playerDie() { sweep(500, 50, 0.6, 'sawtooth', 0.18); noise(0.5, 0.1); },
    waveClr()   { [523,659,784,1047,1319].forEach((f,i) => tone(f,0.15,'square',0.12,i*0.08)); },
    march(step) {
      const freqs = [80, 60, 70, 55];
      tone(freqs[step % 4], 0.06, 'square', 0.12);
    },
  };

  // ── BACKGROUND MUSIC ─────────────────────────────────
  // Simple looping arpeggio player, returns a stop fn
  function startBgMusic(pattern, bpm = 200) {
    const c = getCtx();
    let stopped = false;
    let i = 0;
    const interval = (60 / bpm) * 1000;

    function play() {
      if (stopped) return;
      if (pattern[i]) tone(pattern[i], (interval / 1000) * 0.8, 'square', 0.06);
      i = (i + 1) % pattern.length;
      setTimeout(play, interval);
    }
    play();
    return () => { stopped = true; };
  }

  const BG_PATTERNS = {
    // Korobeiniki (Tetris theme) simplified
    tetris: [
      659,494,523,587,523,494,440,440,523,659,587,523,494,523,587,659,
      523,440,440,0,587,698,880,784,698,659,523,659,587,523,494,494,587,659,
      523,440,440,0,0,0
    ],
    // Simple pentatonic loop for snake
    snake: [330,392,494,587,494,392,330,0,330,392,440,494,440,392,330,0],
    // Upbeat arpeggio for breakout
    breakout: [523,659,784,659,523,440,523,659,784,1047,784,659,523,0,0,0],
    // Eerie minor for space invaders
    invaders: [220,0,185,0,196,0,165,0,220,0,185,0,175,0,165,0],
    // Chill for 2048
    g2048: [262,330,392,330,262,0,294,370,440,370,294,0,330,415,494,415],
  };

  return { tetris, g2048, snake, breakout, invaders, startBgMusic, BG_PATTERNS, getCtx };
})();
