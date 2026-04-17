/* ============================================================
   MODE SYSTEM
   ============================================================ */
let currentMode = localStorage.getItem('btu_mode') || null;

function setMode(mode) {
  currentMode = mode;
  localStorage.setItem('btu_mode', mode);
  document.body.className = `mode-${mode}`;
  document.getElementById('modeGate').style.display = 'none';
  document.getElementById('modeSwitcher').style.display = 'none';
  // Update toggle label
  document.getElementById('modeLabel').textContent = mode === 'explorer' ? '🌱 Explorador' : '🔬 Científico';
  // Update active state in switcher
  document.getElementById('ms-explorer').style.fontWeight = mode === 'explorer' ? '800' : '400';
  document.getElementById('ms-scientist').style.fontWeight = mode === 'scientist' ? '800' : '400';
  // Show/hide bio panel mode content
  if (document.getElementById('bioPanelContent').style.display !== 'none') {
    updateBioPanelMode();
  }
}

function toggleModeModal() {
  const sw = document.getElementById('modeSwitcher');
  sw.style.display = sw.style.display === 'none' ? 'block' : 'none';
}

// Close switcher on outside click
document.addEventListener('click', e => {
  const sw = document.getElementById('modeSwitcher');
  const toggle = document.getElementById('modeToggle');
  if (sw.style.display !== 'none' && !sw.contains(e.target) && !toggle.contains(e.target)) {
    sw.style.display = 'none';
  }
});

// Init: show gate or apply saved mode
if (currentMode) {
  setMode(currentMode);
} else {
  document.getElementById('modeGate').style.display = 'flex';
}

/* ============================================================
   HERO CANVAS
   ============================================================ */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COLORS = ['#00c896','#7c6af7','#ff6b9d','#ffd23f','#2cb5e8'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.r = Math.random() * 2 + .8;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * .45 + .15;
    };
    this.reset();
  }

  function init() {
    particles = [];
    const n = Math.min(70, Math.floor(W * H / 13000));
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,200,150,${.06 * (1 - d/120)})`;
          ctx.lineWidth = .7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill(); ctx.globalAlpha = 1;
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = W+5; if (p.x > W+5) p.x = -5;
      if (p.y < -5) p.y = H+5; if (p.y > H+5) p.y = -5;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

/* ============================================================
   HERO STAT COUNTER ANIMATION
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ============================================================
   ARCOÍRIS INTERACTIVO
   ============================================================ */
const BIO_DATA = [
  {
    color: '#FF3B5C',
    title: '🔴 Biotecnología Roja',
    subtitle: 'Medicina y Salud Humana',
    descExplorer: 'La más conocida y cercana a nosotros. Se enfoca en crear medicamentos, vacunas y terapias a partir de organismos vivos. Si alguna vez te aplicaste una vacuna o tomás insulina, ya tocaste la biotech roja.',
    descScientist: 'Desarrollo de biofármacos mediante expresión heteróloga en células CHO, HEK293 y E. coli. Incluye anticuerpos monoclonales (mAbs), terapias génicas con vectores virales (AAV, lentivirus) y edición somática con CRISPR para patologías monogénicas.',
    ref: 'Walsh, G. (2018). <em>Biopharmaceuticals: Biochemistry and Biotechnology</em>. Wiley. — Referencia estándar en biofármacos.',
    apps: ['Vacunas ARNm','Terapia génica','CRISPR terapéutico','Anticuerpos monoclonales','Diagnóstico molecular','CAR-T cells'],
    careers: ['Investigador farmacéutico','Científico de datos clínicos','Especialista regulatorio','Desarrollador de vacunas','Biotecnólogo clínico'],
    impact: 'La insulina producida por E. coli recombinante (Humulin) desde 1982 cambió la vida de millones. Las vacunas ARNm demostraron en 2020 que podemos responder a una pandemia en tiempo récord.'
  },
  {
    color: '#FF7B37',
    title: '🟠 Biotecnología Naranja',
    subtitle: 'Bienestar, Cosmética y Nutrición',
    descExplorer: 'La biotecnología que encontrás en tu rutina diaria. Cremas con ingredientes producidos por fermentación, probióticos diseñados para tu microbioma, suplementos de precisión.',
    descScientist: 'Producción de ingredientes activos (hialurónato, retinol, coenzima Q10) mediante fermentación microbiana controlada. Diseño de probióticos con cepas modificadas para modulación del microbioma intestinal. Biomimética aplicada a formulaciones dermatológicas.',
    ref: 'Surber, C. et al. (2017). Active Ingredients in Cosmetics. <em>Skin Pharmacology and Physiology</em>, 30(4).',
    apps: ['Cosmética molecular','Colágeno biotech','Probióticos de precisión','Biomimética dérmica','Biofortificación','Fermentación de precisión'],
    careers: ['Formulador científico','Investigador cosmético','Tecnólogo de alimentos','Científico de fermentación','Consultor en bioingredientes'],
    impact: 'El mercado global de cosmética biotecnológica supera los 800 mil millones USD. Los ingredientes por fermentación de precisión son más puros, sostenibles y efectivos que los de síntesis química convencional.'
  },
  {
    color: '#FFD23F',
    title: '🟡 Biotecnología Amarilla',
    subtitle: 'Alimentos y Fermentación',
    descExplorer: 'La biotech que alimenta al mundo de forma diferente. Carne hecha de células en lugar de animales, proteínas alternativas, bebidas fermentadas con microorganismos diseñados. La revolución alimentaria ya empezó.',
    descScientist: 'Fermentación de precisión para producción de proteínas animales sin crianza (clara de huevo, caseína, colágeno). Cultivo celular de tejido muscular en biorreactores (cultured meat). Diseño metabólico de cepas para optimización de rendimiento en productos fermentados.',
    ref: 'Good Food Institute (2023). <em>State of the Industry Report: Fermentation</em>. — Informe anual de referencia en proteínas alternativas.',
    apps: ['Carne cultivada','Fermentación de precisión','Proteínas alternativas','Alimentos funcionales','Hongos funcionales','Cultivos celulares alimentarios'],
    careers: ['Ingeniero de alimentos','Científico de fermentación','Fundador de startup foodtech','Nutriólogo molecular','Investigador en proteínas alt.'],
    impact: 'La carne cultivada usa 95% menos tierra, 78% menos agua y emite 92% menos GEI que la ganadería convencional. Para 2050 necesitamos alimentar 10 mil millones de personas — la biotech amarilla es parte crítica de la solución.'
  },
  {
    color: '#2ECC71',
    title: '🟢 Biotecnología Verde',
    subtitle: 'Agricultura y Plantas',
    descExplorer: 'La biotecnología que cuida lo que comemos y el planeta donde vivimos. Cultivos que resisten sequías, plantas que producen sus propias defensas contra plagas, semillas diseñadas para suelos difíciles.',
    descScientist: 'Mejoramiento genético asistido por marcadores moleculares (MAS) y transformación estable mediada por Agrobacterium o biobalística. Edición con CRISPR-Cas9/12 para resistencia a enfermedades, tolerancia abiótica y mejora nutricional. Cultivos de segunda generación con expresión de vacunas comestibles.',
    ref: 'Ladics, G.S. et al. (2016). Genetic basis and detection of unintended effects in genetically modified crop plants. <em>Transgenic Research</em>, 25(5).',
    apps: ['CRISPR vegetal','Biopesticidas','Biofertilizantes','Cultivos resistentes','Vacunas comestibles','Nutrabiotecnología'],
    careers: ['Mejorador genético','Agrónomo biotech','Especialista en OGMs','Investigador CIMMYT/IRRI','Consultor en sostenibilidad agro'],
    impact: 'Los cultivos biotecnológicos han evitado la deforestación de millones de hectáreas al aumentar la productividad. El arroz dorado (Golden Rice) con beta-caroteno puede prevenir deficiencia de vitamina A en millones de niños.'
  },
  {
    color: '#2CB5E8',
    title: '🔵 Biotecnología Azul',
    subtitle: 'Marina y Acuática',
    descExplorer: 'El océano como laboratorio natural. Organismos marinos que producen medicamentos únicos, algas que se convierten en combustible, microorganismos que limpian derrames de petróleo. La frontera menos explorada de la biotech.',
    descScientist: 'Bioprospección de productos naturales marinos (PNM): péptidos antimicrobiales, compuestos citotóxicos de esponjas y corales. Cultivo de microalgas para producción de ácidos grasos omega-3, astaxantina y biocombustibles de tercera generación. Bioremediación marina con Alcanivorax y Marinobacter.',
    ref: 'Blunt, J.W. et al. (2018). Marine natural products. <em>Natural Product Reports</em>, 35(1). — Revisión anual de PNM.',
    apps: ['Fármacos marinos','Bioremediación marina','Algas biocombustible','Acuicultura biotech','Biopolímeros marinos','Omega-3 de microalgas'],
    careers: ['Biólogo marino molecular','Ingeniero de bioprocesos acuáticos','Investigador en PNM','Especialista en acuicultura biotech','Científico en biotecnología algal'],
    impact: 'Más del 80% de los organismos marinos no han sido estudiados para aplicaciones biotecnológicas. La citarabina (Ara-C), un anticancerígeno derivado de una esponja marina, ha salvado millones de vidas desde los años 70.'
  },
  {
    color: '#9B59B6',
    title: '🟣 Biotecnología Morada',
    subtitle: 'Bioinformática y Computación',
    descExplorer: '¡Esta es perfecta si te gusta la programación! Es el puente entre las computadoras y la biología. Analizar el ADN de miles de personas para encontrar patrones de enfermedad, usar IA para diseñar medicamentos nuevos, predecir cómo se dobla una proteína.',
    descScientist: 'Pipeline bioinformático: secuenciación NGS → alineamiento (BWA/STAR) → llamada de variantes (GATK) → anotación funcional (ANNOVAR). ML aplicado a drug discovery: GNNs para predicción de interacción fármaco-diana. AlphaFold2/3 para predicción de estruturas proteicas de novo.',
    ref: 'Goodfellow, I. et al. (2016). <em>Deep Learning</em>. MIT Press. — Fundamentos de ML aplicables a bioinformática.',
    apps: ['Genómica computacional','Drug discovery con IA','AlphaFold / estructuras','Análisis de microbioma','Secuenciación NGS','Metagenómica'],
    careers: ['Bioinformático/a','Data Scientist biológico','Desarrollador de herramientas genómicas','Investigador computacional','Ingeniero/a de IA en biopharma'],
    impact: 'AlphaFold predijo 200 millones de estructuras proteicas en 2022 — lo que habría tardado siglos de trabajo experimental. La bioinformática es la especialización con mayor crecimiento salarial en todo el campo biotecnológico.'
  },
  {
    color: '#FF79A8',
    title: '🩷 Biotecnología Rosa',
    subtitle: 'Bioética, Regulación y Comunicación',
    descExplorer: 'La parte más humana de la biotecnología. Alguien tiene que hacerse las preguntas difíciles: ¿hasta dónde podemos editar el genoma humano? ¿Quién tiene acceso a estas tecnologías? ¿Cómo comunicamos la ciencia sin generar miedo?',
    descScientist: 'Marco regulatorio internacional: FDA (EE.UU.), EMA (Europa), INVIMA (Colombia). Evaluación ética en ensayos clínicos (Declaración de Helsinki). Gestión de propiedad intelectual en biotech: patentes, licencias, freedom-to-operate. Comunicación de riesgo biotecnológico en políticas públicas.',
    ref: 'Emanuel, E.J. et al. (2008). <em>The Oxford Textbook of Clinical Research Ethics</em>. Oxford University Press.',
    apps: ['Bioética clínica','Regulación FDA/EMA/INVIMA','Políticas de salud pública','Comunicación científica','Gestión de IP','Evaluación de riesgos'],
    careers: ['Bioeticista','Gestor/a de asuntos regulatorios','Periodista científico/a','Especialista en políticas de salud','Divulgador/a científico/a'],
    impact: 'El caso CRISPR babies (2018) mostró que sin marcos éticos sólidos el progreso puede causar daño irreversible. Los especialistas en bioética y regulación son quienes garantizan que el avance sea también justo y seguro.'
  }
];

const segs = document.querySelectorAll('.arc-seg');
const rlItems = document.querySelectorAll('.rl-item');
let activeBioIdx = null;

segs.forEach(seg => {
  seg.addEventListener('click', () => {
    const idx = parseInt(seg.dataset.idx);
    activeBioIdx = idx;
    showBioPanel(idx);
    segs.forEach(s => s.classList.remove('active'));
    seg.classList.add('active');
    rlItems.forEach(r => r.classList.toggle('active-legend', parseInt(r.dataset.idx) === idx));
  });
});

rlItems.forEach(item => {
  item.addEventListener('click', () => {
    const idx = parseInt(item.dataset.idx);
    activeBioIdx = idx;
    showBioPanel(idx);
    segs.forEach(s => s.classList.remove('active'));
    segs[idx]?.classList.add('active');
    rlItems.forEach(r => r.classList.toggle('active-legend', parseInt(r.dataset.idx) === idx));
  });
});

function showBioPanel(idx) {
  const d = BIO_DATA[idx];
  if (!d) return;
  document.getElementById('bioPanelEmpty').style.display = 'none';
  const content = document.getElementById('bioPanelContent');
  content.style.display = 'block';
  document.getElementById('bpcDot').style.background = d.color;
  document.getElementById('bpcTitle').textContent = d.title;
  document.getElementById('bpcSubtitle').textContent = d.subtitle;
  document.getElementById('bpcDescExp').textContent = d.descExplorer;
  document.getElementById('bpcDescSci').innerHTML = d.descScientist;
  document.getElementById('bpcRef').innerHTML = `<p class="sci-ref-label">📚 Referencia</p><p>${d.ref}</p>`;
  document.getElementById('bpcApps').innerHTML = d.apps.map(a => `<span class="bpc-tag">${a}</span>`).join('');
  document.getElementById('bpcCareers').innerHTML = d.careers.map(c => `<span class="bpc-career">${c}</span>`).join('');
  document.getElementById('bpcImpact').textContent = d.impact;
  updateBioPanelMode();
}

function updateBioPanelMode() {
  const isSci = currentMode === 'scientist';
  const expEl = document.getElementById('bpcExplorer');
  const sciEl = document.getElementById('bpcScientist');
  if (expEl) expEl.style.display = isSci ? 'none' : 'block';
  if (sciEl) sciEl.style.display = isSci ? 'block' : 'none';
}

function closeBioPanel() {
  document.getElementById('bioPanelEmpty').style.display = 'flex';
  document.getElementById('bioPanelContent').style.display = 'none';
  segs.forEach(s => s.classList.remove('active'));
  rlItems.forEach(r => r.classList.remove('active-legend'));
  activeBioIdx = null;
}

/* ============================================================
   KNOWLEDGE LEVELS
   ============================================================ */
function showKnowledgeLevel(n, btn) {
  document.querySelectorAll('.level-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.lvl-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`level-${n}`).style.display = 'block';
  btn.classList.add('active');
}

function showLevel(btn, targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.style.display = target.style.display === 'none' ? 'block' : 'none';
    btn.textContent = target.style.display === 'none' ? 'Ver explicación científica →' : 'Ocultar explicación científica ↑';
  }
}

/* ============================================================
   SIMULACIÓN INTERACTIVA
   ============================================================ */
const SIM_SCENARIOS = [
  {
    patient: { icon: '👦', name: 'Mateo, 8 años', condition: 'Anemia falciforme severa. Sus glóbulos rojos tienen forma de hoz y bloquean la circulación, causando crisis de dolor intenso cada semana.' },
    question: '¿Qué estrategia biotecnológica tiene mayor potencial curativo?',
    options: [
      { icon: '✂️', title: 'Edición con CRISPR', desc: 'Corregir la mutación en el gen HBB de sus propias células madre. Una corrección permanente en el ADN.', correct: true },
      { icon: '💉', title: 'Transfusiones periódicas', desc: 'Administrar sangre sana cada 3-4 semanas para compensar los glóbulos defectuosos.', correct: false },
      { icon: '💊', title: 'Hidroxiurea oral', desc: 'Medicamento que estimula la producción de hemoglobina fetal, reduciendo síntomas.', correct: false },
      { icon: '🧬', title: 'Terapia génica con AAV', desc: 'Insertar una copia funcional del gen usando un virus adenoasociado como vector.', correct: false }
    ],
    feedbackCorrect: '✅ ¡Excelente decisión! CTX001 (exa-cel) usa CRISPR para reactivar la hemoglobina fetal en células madre del paciente. Ensayos fase III muestran remisión completa en +90% de pacientes. Fue aprobado por FDA en 2023.',
    feedbackWrong: '🔄 No es la opción más curativa. Esa alternativa trata síntomas pero no corrige la causa. La edición con CRISPR (CTX001/exa-cel) es actualmente la intervención con mayor potencial curativo — aprobada por FDA en 2023 con +90% de remisión completa.'
  },
  {
    patient: { icon: '🌍', name: 'Escenario: Crisis alimentaria', condition: 'Una región de África subsahariana enfrenta sequía extrema. Los cultivos tradicionales de maíz fracasan. 2 millones de personas en riesgo de inseguridad alimentaria.' },
    question: '¿Qué solución biotecnológica puede tener impacto más rápido y sostenible?',
    options: [
      { icon: '🌱', title: 'Cultivos editados con CRISPR', desc: 'Editar variedades locales de maíz para tolerar sequía sin necesidad de semillas externas.', correct: true },
      { icon: '🚚', title: 'Importar alimentos', desc: 'Traer alimentos de regiones con excedente agrícola para cubrir la demanda inmediata.', correct: false },
      { icon: '💧', title: 'Más irrigación', desc: 'Construir infraestructura de riego para mantener los cultivos actuales con agua adicional.', correct: false },
      { icon: '🧪', title: 'Fertilizantes sintéticos', desc: 'Aumentar el uso de fertilizantes nitrogenados para maximizar el rendimiento en suelos secos.', correct: false }
    ],
    feedbackCorrect: '✅ ¡Correcto! La edición con CRISPR de variedades locales (como el proyecto TELA Maize de CIMMYT) preserva la adaptación cultural, genera autonomía tecnológica y ofrece solución permanente. Cultivos como el sorgo tolerante a sequía ya están en uso.',
    feedbackWrong: '🔄 Esa opción puede aliviar a corto plazo pero no es sostenible. La edición de cultivos con CRISPR, adaptando variedades locales para tolerar estrés hídrico, genera independencia alimentaria duradera sin dependencia externa.'
  },
  {
    patient: { icon: '👩‍🔬', name: 'Laboratorio de diagnóstico', condition: 'Un brote de enfermedad respiratoria desconocida. Se necesita identificar el patógeno en menos de 4 horas para iniciar medidas de contención.' },
    question: '¿Qué herramienta biotecnológica permite el diagnóstico más rápido y preciso?',
    options: [
      { icon: '🧬', title: 'RT-PCR en tiempo real', desc: 'Amplificación y detección simultánea de ARN viral. Resultado en 1-2 horas con alta especificidad.', correct: true },
      { icon: '🔬', title: 'Microscopía electrónica', desc: 'Visualización directa del patógeno. Proceso lento que requiere preparación de muestras de 6-8 horas.', correct: false },
      { icon: '🩸', title: 'Cultivo celular', desc: 'Aislar el patógeno en células huésped. Puede tomar días o semanas para obtener resultados.', correct: false },
      { icon: '💉', title: 'Test serológico ELISA', desc: 'Detecta anticuerpos contra el patógeno. Útil para confirmar infección pasada, no infección activa temprana.', correct: false }
    ],
    feedbackCorrect: '✅ ¡Exactamente! La RT-PCR en tiempo real fue el método de diagnóstico de COVID-19. Detecta material genético viral con sensibilidad del 95%+ en menos de 2 horas. Permitió identificar el SARS-CoV-2 y diseñar tests globales en semanas.',
    feedbackWrong: '🔄 Buena idea, pero no es la más eficiente para este caso. La RT-PCR en tiempo real detecta ácidos nucleicos virales con alta sensibilidad en 1-2 horas, siendo el estándar de oro para diagnóstico de brotes infecciosos.'
  }
];

let simState = { step: 0, score: 0, answered: false, active: false };

function initSim() {
  const container = document.getElementById('simContainer');
  container.innerHTML = `
    <div class="sim-intro">
      <h3>🔬 Laboratorio de decisiones</h3>
      <p>Enfrentá escenarios reales del mundo biotecnológico. Tomá decisiones como científico/a y aprendé de cada caso.</p>
      <button class="sim-start-btn" onclick="startSim()">Comenzar simulación →</button>
    </div>
  `;
}

function startSim() {
  simState = { step: 0, score: 0, answered: false, active: true };
  renderSimStep();
}

function renderSimStep() {
  if (simState.step >= SIM_SCENARIOS.length) { renderSimResult(); return; }
  const sc = SIM_SCENARIOS[simState.step];
  const container = document.getElementById('simContainer');
  const progressDots = SIM_SCENARIOS.map((_, i) => `<div class="sim-prog-dot ${i < simState.step ? 'done' : i === simState.step ? 'active' : ''}"></div>`).join('');
  container.innerHTML = `
    <div class="sim-game">
      <div class="sim-progress">${progressDots}</div>
      <div class="sim-patient">
        <div class="sim-patient-icon">${sc.patient.icon}</div>
        <div><h4>${sc.patient.name}</h4><p>${sc.patient.condition}</p></div>
      </div>
      <p class="sim-question">${sc.question}</p>
      <div class="sim-options">
        ${sc.options.map((opt, i) => `
          <button class="sim-option" onclick="answerSim(${i})" id="simopt-${i}">
            <div class="sim-opt-icon">${opt.icon}</div>
            <div class="sim-opt-title">${opt.title}</div>
            <div class="sim-opt-desc">${opt.desc}</div>
          </button>
        `).join('')}
      </div>
      <div id="simFeedback"></div>
    </div>
  `;
}

function answerSim(idx) {
  if (simState.answered) return;
  simState.answered = true;
  const sc = SIM_SCENARIOS[simState.step];
  const chosen = sc.options[idx];
  const isCorrect = chosen.correct;
  if (isCorrect) simState.score++;
  // Style options
  sc.options.forEach((opt, i) => {
    const btn = document.getElementById(`simopt-${i}`);
    if (btn) {
      btn.disabled = true;
      if (opt.correct) btn.classList.add('correct');
      else if (i === idx && !opt.correct) btn.classList.add('wrong');
    }
  });
  // Show feedback
  const fb = document.getElementById('simFeedback');
  fb.innerHTML = `
    <div class="sim-feedback ${isCorrect ? 'correct' : 'wrong'}">
      ${isCorrect ? sc.feedbackCorrect : sc.feedbackWrong}
    </div>
    <button class="sim-next-btn" onclick="nextSimStep()">
      ${simState.step < SIM_SCENARIOS.length - 1 ? 'Siguiente caso →' : 'Ver resultados →'}
    </button>
  `;
}

function nextSimStep() {
  simState.step++;
  simState.answered = false;
  renderSimStep();
}

function renderSimResult() {
  const pct = Math.round(simState.score / SIM_SCENARIOS.length * 100);
  const msgs = [
    { min: 100, text: '¡Brillante! Tomaste las mejores decisiones en todos los casos. Tenés intuición científica.', emoji: '🏆' },
    { min: 67, text: 'Muy bien. Entendés los principios clave. Con más práctica vas a dominar estos escenarios.', emoji: '🎯' },
    { min: 33, text: 'Buen intento. Cada error es una lección. Revisá las explicaciones y volvé a intentarlo.', emoji: '📚' },
    { min: 0, text: 'La biotecnología tiene una curva de aprendizaje. Explorá el contenido de la plataforma y volvé.', emoji: '🌱' }
  ];
  const msg = msgs.find(m => pct >= m.min);
  document.getElementById('simContainer').innerHTML = `
    <div class="sim-result">
      <div class="sim-score-ring" style="--pct:${pct * 3.6}deg">${pct}%</div>
      <h3>${msg.emoji} ${simState.score}/${SIM_SCENARIOS.length} correctas</h3>
      <p>${msg.text}</p>
      <button class="sim-start-btn" onclick="startSim()">Intentar de nuevo</button>
    </div>
  `;
}

/* ============================================================
   BLOG SYSTEM
   ============================================================ */
const ADMIN_PASS = 'biotech2025'; // ← Cambiá esto, Hilary!

const DEFAULT_POSTS = [
  { id:1, title:'¿Qué son las enzimas y por qué son tan importantes?', tag:'Divulgación', level:'1', date:'15 Abr 2025', author:'Hilary Suárez', content:'Las enzimas son proteínas que funcionan como pequeñas máquinas moleculares dentro de nuestras células. Aceleran reacciones químicas que de otra forma tardarían demasiado para sostener la vida. Sin enzimas, tu cuerpo no podría digerir los alimentos, copiar el ADN ni producir energía. Son tan específicas que cada una solo cataliza un tipo de reacción — como una llave que solo abre una cerradura.' },
  { id:2, title:'Aplicaciones de la cinética de Michaelis-Menten en diseño de fármacos', tag:'Técnico', level:'3', date:'12 Abr 2025', author:'Hilary Suárez', content:'La ecuación de Michaelis-Menten (v = Vmax[S]/(Km+[S])) describe la velocidad de reacción enzimática en función de la concentración de sustrato. En el diseño de fármacos inhibidores, los parámetros Km y Ki son fundamentales: un inhibidor competitivo aumenta el Km aparente sin alterar Vmax, mientras que uno no competitivo reduce Vmax. El índice de selectividad (Ki diana / Ki off-target) determina el margen terapéutico.' },
  { id:3, title:'¿Cómo funcionan las vacunas de ARNm?', tag:'Divulgación', level:'1', date:'8 Abr 2025', author:'Hilary Suárez', content:'Las vacunas ARNm funcionan como instrucciones temporales para tus células. En lugar de introducir el virus, le mandan a tus células el "manual" para producir solo una pequeña parte de él — la proteína espiga. Tu sistema inmune la ve, la reconoce como extraña, y crea anticuerpos. Cuando llegue el virus real, ya estás preparado/a. El ARNm se degrada en horas y nunca entra al núcleo celular, por lo que no puede alterar tu ADN.' },
  { id:4, title:'CRISPR en 2025: dónde estamos y a dónde vamos', tag:'CRISPR', level:'2', date:'3 Abr 2025', author:'Hilary Suárez', content:'A 13 años de su descripción como herramienta de edición, CRISPR ya tiene dos terapias aprobadas por FDA (exagamglogene autotemcel y lovotibeglogene autotemcel para anemia falciforme). En 2025, la edición in vivo con nanopartículas lipídicas y los sistemas CRISPR de base (base editing) están en múltiples ensayos fase II/III. La próxima frontera: edición epigenómica sin alterar la secuencia de ADN.' },
  { id:5, title:'Biomarcadores en enfermedades cardiovasculares', tag:'Técnico', level:'3', date:'28 Mar 2025', author:'Hilary Suárez', content:'Los biomarcadores cardíacos son moléculas cuya concentración plasmática correlaciona con daño miocárdico o riesgo cardiovascular. La troponina I y T cardíaca (cTnI, cTnT) son el estándar de oro para IAM: sensibilidad >95% a las 3h del evento. El BNP y NT-proBNP reflejan estrés hemodinámico en insuficiencia cardíaca. Biomarcadores emergentes: GDF-15, sST2 y microARNs circulantes ofrecen valor pronóstico adicional.' },
  { id:6, title:'¿Qué hace un biotecnólogo en el día a día?', tag:'Divulgación', level:'1', date:'20 Mar 2025', author:'Hilary Suárez', content:'Un biotecnólogo puede trabajar en laboratorios de investigación, industria farmacéutica, empresas de alimentos, startups de tecnología o entidades gubernamentales. Su día puede incluir: analizar muestras con técnicas moleculares, diseñar experimentos, interpretar resultados estadísticos, escribir informes científicos o desarrollar nuevos productos. La variedad es enorme — no existe un solo perfil de biotecnólogo.' }
];

function loadPosts() { try { return JSON.parse(localStorage.getItem('btu_posts_v2')) || DEFAULT_POSTS; } catch(e) { return DEFAULT_POSTS; } }
function savePosts(p) { try { localStorage.setItem('btu_posts_v2', JSON.stringify(p)); } catch(e) {} }
function loadSubs() { try { return JSON.parse(localStorage.getItem('btu_subs_v2')) || []; } catch(e) { return []; } }
function saveSubs(s) { try { localStorage.setItem('btu_subs_v2', JSON.stringify(s)); } catch(e) {} }

let allPosts = loadPosts();
let activeFilter = 'all';

const LEVEL_LABELS = { '1': 'Nivel 1 · Básico', '2': 'Nivel 2 · Intermedio', '3': 'Nivel 3 · Avanzado' };
const TECH_TAGS = ['Técnico', 'CRISPR', 'IA & Bio'];

function renderPosts() {
  const grid = document.getElementById('blogGrid');
  const filtered = activeFilter === 'all' ? allPosts : allPosts.filter(p => p.tag === activeFilter);
  if (!filtered.length) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)">No hay artículos en esta categoría todavía.</div>`; return; }
  grid.innerHTML = filtered.map((p, i) => `
    <article class="blog-post" style="animation-delay:${i * .07}s" onclick="openPost(${p.id})">
      <div class="post-header">
        <span class="post-tag ${TECH_TAGS.includes(p.tag) ? 'tech' : ''}">${p.tag}</span>
        <span class="post-level">${LEVEL_LABELS[p.level] || 'Nivel 1'}</span>
      </div>
      <div class="post-body">
        <h3 class="post-title">${p.title}</h3>
        <p class="post-excerpt">${p.content}</p>
      </div>
      <div class="post-footer">
        <span class="post-read">Leer →</span>
        <span class="post-author">por ${p.author || 'Hilary Suárez'}</span>
      </div>
    </article>
  `).join('');
}

function filterPosts(tag, btn) {
  activeFilter = tag;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPosts();
}

function openPost(id) {
  const p = allPosts.find(x => x.id === id);
  if (!p) return;
  const m = document.createElement('div');
  m.className = 'modal-overlay'; m.style.display = 'flex';
  m.innerHTML = `
    <div class="modal-box" style="padding:0">
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap">
          <span class="post-tag ${TECH_TAGS.includes(p.tag) ? 'tech' : ''}">${p.tag}</span>
          <span class="post-level">${LEVEL_LABELS[p.level] || ''}</span>
          <span style="font-size:.7rem;color:var(--text-dim)">${p.date}</span>
        </div>
        <button class="bpc-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div style="padding:1.5rem 1.625rem 2rem">
        <h2 style="font-family:'Fraunces',serif;font-size:1.35rem;font-weight:900;margin-bottom:.4rem;line-height:1.25">${p.title}</h2>
        <p style="font-size:.75rem;color:var(--text-dim);margin-bottom:1.5rem">por ${p.author || 'Hilary Suárez'}</p>
        <p style="color:var(--text-muted);line-height:1.85;font-size:.93rem">${p.content}</p>
      </div>
    </div>`;
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  document.body.appendChild(m);
}

function checkAdmin() {
  if (document.getElementById('adminPass').value === ADMIN_PASS) {
    document.getElementById('adminGate').style.display = 'none';
    document.getElementById('blogAdmin').style.display = 'block';
    document.getElementById('adminPass').value = '';
    updatePendingAlert();
    document.getElementById('blogAdmin').scrollIntoView({ behavior:'smooth', block:'nearest' });
  } else {
    showToast('❌ Contraseña incorrecta');
    document.getElementById('adminPass').value = '';
  }
}

function publishPost() {
  const title = document.getElementById('postTitle').value.trim();
  const tag = document.getElementById('postTag').value;
  const level = document.getElementById('postLevel').value;
  const content = document.getElementById('postContent').value.trim();
  if (!title || !content) { showToast('⚠️ Completá título y contenido'); return; }
  const newPost = { id: Date.now(), title, tag, level, content, author: 'Hilary Suárez', date: new Date().toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' }) };
  allPosts = [newPost, ...allPosts];
  savePosts(allPosts);
  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';
  activeFilter = 'all';
  document.querySelectorAll('.filter-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  renderPosts();
  showToast('✅ Artículo publicado!');
}

function updatePendingAlert() {
  const pending = loadSubs().filter(s => s.status === 'pending');
  const el = document.getElementById('pendingAlert');
  if (el) { el.style.display = pending.length ? 'flex' : 'none'; if (pending.length) document.getElementById('pendingCount').textContent = `📬 ${pending.length} envío${pending.length > 1 ? 's' : ''}`; }
}

function openPendingModal() {
  const subs = loadSubs().filter(s => s.status === 'pending');
  const list = document.getElementById('pendingList');
  list.innerHTML = subs.length ? subs.map(s => `
    <div class="pending-item">
      <div class="pending-meta">De: <strong>${s.name}</strong> · ${s.date} · ${s.tag}</div>
      <h4>${s.title}</h4>
      <p>${s.content.slice(0, 220)}${s.content.length > 220 ? '…' : ''}</p>
      <div class="pending-actions">
        <button class="btn-approve" onclick="approveSub(${s.id})">✓ Aprobar y publicar</button>
        <button class="btn-reject" onclick="rejectSub(${s.id})">✕ Rechazar</button>
      </div>
    </div>`).join('') : `<p style="padding:2rem;text-align:center;color:var(--text-muted)">No hay envíos pendientes.</p>`;
  document.getElementById('pendingModal').style.display = 'flex';
}

function approveSub(id) {
  let subs = loadSubs();
  const s = subs.find(x => x.id === id);
  if (!s) return;
  allPosts = [{ id: Date.now(), title: s.title, tag: s.tag, level: '1', content: s.content, author: s.name, date: new Date().toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' }) }, ...allPosts];
  savePosts(allPosts);
  saveSubs(subs.map(x => x.id === id ? {...x, status:'approved'} : x));
  openPendingModal(); renderPosts(); updatePendingAlert();
  showToast('✅ Publicado!');
}

function rejectSub(id) {
  saveSubs(loadSubs().map(x => x.id === id ? {...x, status:'rejected'} : x));
  openPendingModal(); updatePendingAlert();
  showToast('🗑️ Rechazado');
}

function submitArticle() {
  const name = document.getElementById('subName').value.trim();
  const title = document.getElementById('subTitle').value.trim();
  const tag = document.getElementById('subTag').value;
  const content = document.getElementById('subContent').value.trim();
  if (!name || !title || !content) { showToast('⚠️ Completá todos los campos'); return; }
  const subs = loadSubs();
  subs.push({ id: Date.now(), name, title, tag, content, status: 'pending', date: new Date().toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' }) });
  saveSubs(subs);
  ['subName','subTitle','subContent'].forEach(id => document.getElementById(id).value = '');
  showToast('🎉 ¡Enviado para revisión!');
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const d = e.target.dataset.delay;
      if (d) e.target.style.transitionDelay = d + 'ms';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.info-card, .timeline-item, .reason-card, .lc-card').forEach(el => observer.observe(el));

// Counter animation on hero
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) animateCounters();
}, { threshold: 0.5 }).observe(document.getElementById('hero'));

// Nav scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.background = window.scrollY > 50 ? 'rgba(5,9,17,.98)' : 'rgba(5,9,17,.88)';
});

/* Utilities */
function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3200); }
function copyLink() { navigator.clipboard.writeText(window.location.href).then(() => showToast('📋 ¡Enlace copiado!')).catch(() => showToast('Copiá la URL manualmente')); }
function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); }

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  renderPosts();
  initSim();
});
