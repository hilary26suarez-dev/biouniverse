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
  if (!container) return; // section replaced by CRISPR lab
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
        <span class="post-level-tag">${LEVEL_LABELS[p.level] || 'Nivel 1'}</span>
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
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  renderPosts();
  initSim();
});

/* ============================================================
   TYPEWRITER HERO
   ============================================================ */
const TYPEWRITER_PHRASES = [
  'La biotecnología está\ncambiando el mundo…',
  'La ciencia que\nprograma la vida.',
  'Tu carrera puede\nsalvar millones.',
  'El futuro es\nbiológico.'
];

function initTypewriter() {
  const el = document.getElementById('typewriter');
  const cursorEl = document.querySelector('.cursor');
  if (!el) return;
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const full = TYPEWRITER_PHRASES[phraseIdx];
    const current = full.slice(0, charIdx);
    el.innerHTML = current.replace('\n', '<br/>');

    if (!deleting && charIdx === full.length) {
      setTimeout(tick, phraseIdx === 0 ? 3000 : 2200);
      deleting = true; return;
    }
    if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % TYPEWRITER_PHRASES.length;
      setTimeout(tick, 400); return;
    }
    charIdx += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
}

/* ============================================================
   LIVE IMPACT COUNTER
   ============================================================ */
function initLiveImpact() {
  const el = document.getElementById('liveText');
  if (!el) return;

  // Approximate global rates per second
  const RATES = [
    { text: 'dosis de insulina biotech administradas', rate: 3.1 },
    { text: 'secuencias de ADN analizadas en el mundo', rate: 47 },
    { text: 'personas vacunadas con tecnología biotech', rate: 1.8 },
    { text: 'tests moleculares procesados globalmente', rate: 12 },
  ];

  let idx = 0, count = 0, startTime = Date.now();

  function update() {
    const item = RATES[idx];
    const elapsed = (Date.now() - startTime) / 1000;
    count = Math.floor(elapsed * item.rate);
    el.textContent = `+${count.toLocaleString()} ${item.text}`;
    requestAnimationFrame(update);
  }

  // Cycle metric every 8 seconds
  setInterval(() => {
    idx = (idx + 1) % RATES.length;
    count = 0; startTime = Date.now();
  }, 8000);

  update();
}

/* ============================================================
   PRESENTATION MODE
   ============================================================ */
function togglePresentMode() {
  document.body.classList.toggle('present-mode');
  const btn = document.getElementById('presentBtn');
  btn.title = document.body.classList.contains('present-mode')
    ? 'Salir del modo presentación'
    : 'Modo presentación';
}

/* ============================================================
   QUIZ DE PERSONALIDAD BIOTECNOLÓGICA
   ============================================================ */
const QUIZ_QUESTIONS = [
  {
    q: 'Si pudieras resolver UN problema del mundo, ¿cuál sería?',
    opts: [
      { emoji: '❤️', text: 'Curar enfermedades que aún no tienen tratamiento', val: 'roja' },
      { emoji: '🌍', text: 'Detener el cambio climático y salvar el planeta', val: 'gris' },
      { emoji: '🍽️', text: 'Eliminar el hambre y la desnutrición global', val: 'verde' },
      { emoji: '💻', text: 'Usar datos e IA para descubrir lo que aún no sabemos', val: 'morada' },
    ]
  },
  {
    q: 'En un proyecto de equipo, ¿cuál es tu rol natural?',
    opts: [
      { emoji: '🔬', text: 'El/la que experimenta y prueba ideas en el laboratorio', val: 'roja' },
      { emoji: '📊', text: 'El/la que analiza los datos y encuentra patrones', val: 'morada' },
      { emoji: '🌱', text: 'El/la que piensa en el impacto ambiental y social', val: 'verde' },
      { emoji: '🎨', text: 'El/la que comunica y hace que todos entiendan', val: 'rosa' },
    ]
  },
  {
    q: '¿Qué noticia científica te haría saltar de emoción?',
    opts: [
      { emoji: '🧬', text: 'Se curó el primer paciente con una enfermedad genética usando CRISPR', val: 'roja' },
      { emoji: '🥩', text: 'La carne cultivada es más barata que la animal', val: 'amarilla' },
      { emoji: '🤖', text: 'Una IA diseñó una nueva proteína que no existe en la naturaleza', val: 'morada' },
      { emoji: '🌊', text: 'Bacterias marinas limpian el plástico del océano en semanas', val: 'azul' },
    ]
  },
  {
    q: '¿Cómo te imaginás trabajando?',
    opts: [
      { emoji: '🏥', text: 'En hospitales o farmacéuticas, con impacto directo en pacientes', val: 'roja' },
      { emoji: '🖥️', text: 'Frente a una computadora analizando datos genómicos', val: 'morada' },
      { emoji: '🌿', text: 'Al aire libre o en invernaderos, trabajando con plantas y suelos', val: 'verde' },
      { emoji: '⚖️', text: 'En política pública, definiendo el futuro ético de la ciencia', val: 'rosa' },
    ]
  },
  {
    q: 'Una frase que te representa:',
    opts: [
      { emoji: '💊', text: '"Quiero crear el medicamento que salve a alguien que nadie más pudo salvar"', val: 'roja' },
      { emoji: '🔢', text: '"Los datos no mienten — en ellos está la respuesta"', val: 'morada' },
      { emoji: '♻️', text: '"Si no cuidamos el planeta, no hay ciencia que valga"', val: 'gris' },
      { emoji: '🗣️', text: '"La mejor ciencia es la que llega a todos, no solo a los laboratorios"', val: 'rosa' },
    ]
  }
];

const QUIZ_PROFILES = {
  roja: {
    emoji: '🔴', name: 'Biotecnólogo/a Rojo/a', color: '#FF3B5C',
    badge: 'Medicina & Salud',
    desc: 'Tu misión es salvar vidas desde el laboratorio. Sentís una conexión profunda con el impacto humano de la ciencia. Las terapias génicas, las vacunas y los medicamentos del futuro tienen tu firma. Sos el tipo de científico/a que trabaja pensando en la persona al otro lado del microscopio.',
    careers: ['Investigador/a clínico', 'Desarrollo de vacunas', 'Terapia génica', 'Oncología molecular']
  },
  morada: {
    emoji: '🟣', name: 'Biotecnólogo/a Morado/a', color: '#9B59B6',
    badge: 'Bioinformática & IA',
    desc: 'Sos el puente entre la programación y la biología. Donde otros ven datos, vos ves patrones que pueden cambiar la medicina. AlphaFold, drug discovery con IA, análisis de genomas — ese es tu mundo. Si te gusta programar, acabás de descubrir que podés hacer ciencia con código.',
    careers: ['Bioinformático/a', 'Data Scientist bio', 'IA en pharma', 'Genómica computacional']
  },
  verde: {
    emoji: '🟢', name: 'Biotecnólogo/a Verde', color: '#2ECC71',
    badge: 'Agricultura & Sostenibilidad',
    desc: 'El planeta te importa tanto como las personas. Querés usar la ciencia para alimentar al mundo de forma sostenible, crear cultivos resistentes y proteger los ecosistemas. Tu laboratorio puede ser un invernadero, un campo de cultivo o una biorrefinería. La vida depende literalmente de vos.',
    careers: ['Mejoramiento genético', 'Biotecnología agrícola', 'Sostenibilidad', 'Seguridad alimentaria']
  },
  amarilla: {
    emoji: '🟡', name: 'Biotecnólogo/a Amarillo/a', color: '#FFD23F',
    badge: 'Alimentos & Fermentación',
    desc: 'La revolución alimentaria del siglo XXI te tiene en el centro. Carne sin sacrificio animal, proteínas del futuro, fermentación de precisión — esto es para vos. Combinás ciencia con innovación para resolver uno de los mayores desafíos humanos: cómo alimentar a 10 mil millones de personas.',
    careers: ['Foodtech', 'Ingeniería de fermentación', 'Proteínas alternativas', 'Startups de alimentos']
  },
  azul: {
    emoji: '🔵', name: 'Biotecnólogo/a Azul', color: '#2CB5E8',
    badge: 'Biotecnología Marina',
    desc: 'El océano es tu laboratorio. Explorás la frontera menos conocida de la biotecnología — el 80% de los organismos marinos todavía no fueron estudiados para aplicaciones científicas. Podés descubrir el próximo antibiótico, el biocombustible del futuro o la solución a la contaminación marina.',
    careers: ['Biología marina molecular', 'Bioprospeccion', 'Algas y biocombustibles', 'Bioremediación']
  },
  gris: {
    emoji: '⚪', name: 'Biotecnólogo/a Gris/a', color: '#95A5A6',
    badge: 'Ambiental & Bioeconomía',
    desc: 'Tu ciencia limpia lo que otros contaminaron. Microorganismos que degradan plásticos, bacterias que restauran suelos tóxicos, sistemas biológicos que purifican el agua. La biotecnología gris es silenciosa pero esencial — sin ella, el planeta no tiene futuro.',
    careers: ['Bioremediación', 'Gestión ambiental', 'Bioenergía', 'Economía circular']
  },
  rosa: {
    emoji: '🩷', name: 'Biotecnólogo/a Rosa', color: '#FF79A8',
    badge: 'Bioética & Divulgación',
    desc: '¡Como Hilary! La ciencia más importante no es la que se hace en el laboratorio, sino la que llega a las personas. Vos querés ser el puente entre el conocimiento y el mundo. También podés ser quien define las reglas éticas de hasta dónde debe ir la biotecnología — una responsabilidad enorme.',
    careers: ['Divulgación científica', 'Bioética', 'Regulación', 'Política científica']
  }
};

let quizAnswers = [], quizStep = 0;

function initQuiz() {
  const c = document.getElementById('quizContainer');
  if (!c) return;
  c.innerHTML = `
    <div class="quiz-start">
      <div class="quiz-start-icon">🧬</div>
      <h3>Descubrí tu perfil biotecnológico</h3>
      <p>5 preguntas rápidas para descubrir qué rama de la biotecnología va con tu personalidad y tus valores. No hay respuestas correctas o incorrectas.</p>
      <button class="btn-primary" onclick="startQuiz()">Empezar quiz →</button>
    </div>`;
}

function startQuiz() {
  quizAnswers = []; quizStep = 0;
  renderQuizStep();
}

function renderQuizStep() {
  if (quizStep >= QUIZ_QUESTIONS.length) { showQuizResult(); return; }
  const q = QUIZ_QUESTIONS[quizStep];
  const pct = (quizStep / QUIZ_QUESTIONS.length) * 100;
  document.getElementById('quizContainer').innerHTML = `
    <div class="quiz-step">
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
      <div class="quiz-q-num">Pregunta ${quizStep + 1} de ${QUIZ_QUESTIONS.length}</div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options">
        ${q.opts.map((opt, i) => `
          <button class="quiz-opt" onclick="answerQuiz('${opt.val}')">
            <span class="quiz-opt-emoji">${opt.emoji}</span>
            <span class="quiz-opt-text">${opt.text}</span>
          </button>`).join('')}
      </div>
    </div>`;
}

function answerQuiz(val) {
  quizAnswers.push(val);
  quizStep++;
  renderQuizStep();
}

function showQuizResult() {
  // Count most frequent answer
  const freq = {};
  quizAnswers.forEach(v => freq[v] = (freq[v] || 0) + 1);
  const topVal = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
  const profile = QUIZ_PROFILES[topVal] || QUIZ_PROFILES.roja;

  document.getElementById('quizContainer').innerHTML = `
    <div class="quiz-result">
      <span class="result-profile-emoji">${profile.emoji}</span>
      <span class="result-color-badge" style="background:${profile.color}22;color:${profile.color};border:1px solid ${profile.color}44">${profile.badge}</span>
      <h2 class="result-name">${profile.name}</h2>
      <p class="result-desc">${profile.desc}</p>
      <div class="result-careers">
        ${profile.careers.map(c => `<span class="result-career-tag">${c}</span>`).join('')}
      </div>
      <button class="btn-primary" onclick="scrollToSection('arcoiris')">Explorá tu especialización →</button>
      <button class="quiz-retry-btn" onclick="startQuiz()">Repetir quiz</button>
    </div>`;
}

/* ============================================================
   PROBLEMA → SOLUCIÓN
   ============================================================ */
const PROBLEMS = [
  {
    emoji: '🦠', title: 'Enfermedades sin cura', sub: 'Cáncer, Alzheimer, enfermedades raras',
    biotech: 'Biotecnología Roja',
    desc: 'La biotecnología está desarrollando terapias génicas con CRISPR que corrigen enfermedades hereditarias con una sola aplicación, vacunas personalizadas contra el cáncer basadas en el perfil genético de cada tumor, y anticuerpos diseñados para atacar células específicas sin dañar las sanas.',
    examples: ['Terapia génica CRISPR', 'Vacunas ARNm anticáncer', 'Anticuerpos monoclonales', 'CAR-T cells']
  },
  {
    emoji: '🌾', title: 'Hambre y desnutrición', sub: 'Seguridad alimentaria global',
    biotech: 'Biotecnología Verde + Amarilla',
    desc: 'Cultivos editados genéticamente para resistir sequías, plagas y suelos pobres. Proteínas alternativas producidas por fermentación de precisión que usan 95% menos tierra y agua. Arroz con vitamina A incorporada para prevenir ceguera en millones de niños.',
    examples: ['Cultivos CRISPR tolerantes', 'Proteínas alternativas', 'Arroz Dorado', 'Biofertilizantes']
  },
  {
    emoji: '🌡️', title: 'Cambio climático', sub: 'Emisiones y contaminación',
    biotech: 'Biotecnología Gris + Negra',
    desc: 'Microorganismos diseñados para degradar plásticos y derrames de petróleo. Biocombustibles de tercera generación producidos por algas. Bacterias que capturan CO₂. Biomateriales que reemplazan el plástico derivado del petróleo con alternativas 100% biodegradables.',
    examples: ['Biodegradación de plásticos', 'Algas biocombustible', 'Captura de CO₂', 'Bioplásticos']
  },
  {
    emoji: '🧠', title: 'Enfermedades mentales', sub: 'Depresión, esquizofrenia, autismo',
    biotech: 'Biotecnología Roja + Morada',
    desc: 'La bioinformática y la genómica están identificando los genes asociados a trastornos mentales. Se desarrollan biomarcadores para diagnóstico temprano y tratamientos personalizados según el perfil genético del paciente. La psilocibina y otros compuestos bioactivos están en ensayos clínicos para depresión resistente.',
    examples: ['Genómica de salud mental', 'Biomarcadores cerebrales', 'Farmacogenómica', 'Terapias biológicas']
  },
  {
    emoji: '🌊', title: 'Contaminación oceánica', sub: 'Microplásticos y derrames',
    biotech: 'Biotecnología Azul + Gris',
    desc: 'Bacterias marinas modificadas que detectan y degradan microplásticos. Algas que absorben metales pesados de las aguas costeras. Enzimas marinas (PETasas) que descomponen PET en sus componentes reciclables. Biofiltros basados en organismos marinos para tratamiento de aguas industriales.',
    examples: ['Bacterias degradadoras de PET', 'Algas biofiltro', 'Bioremediación marina', 'PETasas marinas']
  },
  {
    emoji: '👴', title: 'Envejecimiento', sub: 'Calidad de vida en la vejez',
    biotech: 'Biotecnología Roja + Morada',
    desc: 'La biotecnología del envejecimiento busca extender no solo la duración de la vida sino su calidad. Desde terapias senolíticas que eliminan células envejecidas, hasta edición genética de genes asociados a la longevidad, pasando por medicina regenerativa con células madre.',
    examples: ['Terapias senolíticas', 'Medicina regenerativa', 'Células madre', 'Edición del genoma del envejecimiento']
  }
];

let selectedProblem = null;

function initProblems() {
  const grid = document.getElementById('problemsGrid');
  if (!grid) return;
  grid.innerHTML = PROBLEMS.map((p, i) => `
    <button class="problem-card" onclick="selectProblem(${i})" id="prob-${i}">
      <span class="problem-emoji">${p.emoji}</span>
      <div class="problem-title">${p.title}</div>
      <div class="problem-sub">${p.sub}</div>
    </button>`).join('');
}

function selectProblem(idx) {
  const p = PROBLEMS[idx];
  selectedProblem = idx;
  document.querySelectorAll('.problem-card').forEach((c, i) => c.classList.toggle('selected', i === idx));
  const ans = document.getElementById('problemAnswer');
  ans.style.display = 'block';
  ans.innerHTML = `
    <div class="pa-header">
      <span class="pa-emoji">${p.emoji}</span>
      <div>
        <div class="pa-title">${p.title}</div>
        <div class="pa-sub">Solución: ${p.biotech}</div>
      </div>
    </div>
    <p class="pa-desc">${p.desc}</p>
    <div class="pa-examples">${p.examples.map(e => `<span class="pa-example">${e}</span>`).join('')}</div>`;
  ans.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ============================================================
   INIT ALL NEW FEATURES
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initLiveImpact();
  initQuiz();
  initProblems();
});


/* ============================================================
   CRISPR-Cas9 INTERACTIVE LAB — v4 PRO
   ============================================================ */

// --- Audio (Web Audio API — no files needed) ---
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _actx = null;
function getACtx() { if (!_actx) { try { _actx = new AudioCtx(); } catch(e){} } return _actx; }

function playTone(freq, type, duration, vol) {
  try {
    const ac = getACtx(); if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type || 'sine'; o.frequency.value = freq || 440;
    g.gain.setValueAtTime(vol || 0.08, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (duration || 0.2));
    o.start(); o.stop(ac.currentTime + (duration || 0.2));
  } catch(e) {}
}

const SFX = {
  scan:    () => { playTone(880,'sine',.15,.06); setTimeout(()=>playTone(1100,'sine',.1,.05),150); },
  click:   () => playTone(600,'sine',.08,.05),
  error:   () => { playTone(200,'sawtooth',.18,.07); setTimeout(()=>playTone(160,'sawtooth',.15,.06),200); },
  cut:     () => { playTone(300,'square',.05,.08); setTimeout(()=>playTone(150,'square',.12,.06),60); },
  success: () => { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',.2,.06),i*120)); },
  hint:    () => playTone(440,'sine',.12,.04),
  lock:    () => { playTone(700,'sine',.08,.05); setTimeout(()=>playTone(900,'sine',.1,.05),100); },
};

// --- Cases ---
const CRISPR_CASES = [
  {
    patient: { icon: '👦', name: 'Mateo, 8 años',
      condition: 'Anemia falciforme — una sola letra errónea en el gen HBB deforma sus glóbulos rojos y bloquea la circulación de oxígeno.' },
    gene: 'HBB — Hemoglobina Beta',
    seq:        ['A','T','G','G','T','G','C','A','C','C','T','G','A','C','T'],
    mutantPos: 11, mutantBase: 'A', correctBase: 'T',
    wrongFeedback: {
      'A': '⚠️ La base A ya estaba ahí — esa es la mutación, no la solución. Pensá en complementariedad.',
      'C': '⚠️ C no complementa bien en esta posición. Recordá: C siempre va con G, no con A.',
      'G': '⚠️ G formaría un codón diferente que tampoco produce hemoglobina funcional.',
    },
    hintMsg: '💡 La base mutada es A. En el ADN normal, A siempre va de a pares con… ¿cuál?',
    beforeProtein: { icon: '🔴', label: 'Hemoglobina S (defectuosa)', desc: 'Glóbulos en forma de hoz. Bloquean capilares. Crisis de dolor.' },
    afterProtein:  { icon: '🟢', label: 'Hemoglobina A (funcional)', desc: 'Glóbulos redondos. Circulación normal. Sin crisis.' },
    successMsg: '¡Edición exitosa! Los glóbulos rojos de Mateo recuperan su forma bicóncava y pueden transportar oxígeno normalmente.',
    sciNote: 'CTX001 (exa-cel) usa exactamente este mecanismo. Aprobado por FDA en diciembre 2023 — 97% de pacientes libres de crisis dolorosas en fase III.',
    sciDetail: 'La mutación GAG→GTG en el codón 6 del gen HBB produce hemoglobina S. CRISPR reactiva la hemoglobina fetal (HbF) silenciando el gen BCL11A, compensando el defecto.'
  },
  {
    patient: { icon: '👩', name: 'Elena, 34 años',
      condition: 'Distrofia de Duchenne — una mutación en el gen DMD impide producir distrofina, la proteína que protege las fibras musculares del daño mecánico.' },
    gene: 'DMD — Distrofina',
    seq:        ['G','A','T','C','G','A','T','C','G','A','T','C','G','A','T'],
    mutantPos: 7, mutantBase: 'G', correctBase: 'C',
    wrongFeedback: {
      'G': '⚠️ G es justamente la mutación que causó el problema. Tenés que reemplazarla, no repetirla.',
      'A': '⚠️ A alteraría el codón y produciría una proteína diferente. Pensá en la regla C↔G.',
      'T': '⚠️ T no complementa con G. Recordá: T siempre va con A, y C siempre va con G.',
    },
    hintMsg: '💡 La base mutada es G. En el ADN, G siempre va de a pares con su complementaria… ¿cuál es?',
    beforeProtein: { icon: '🔴', label: 'Sin distrofina', desc: 'Fibras musculares sin soporte. Daño progresivo. Pérdida de movilidad.' },
    afterProtein:  { icon: '🟢', label: 'Distrofina funcional', desc: 'Fibras musculares protegidas. Función estructural restaurada.' },
    successMsg: '¡Corrección completada! El gen DMD puede producir distrofina funcional. Las fibras musculares de Elena tienen soporte estructural.',
    sciNote: 'CRISPR para Duchenne está en ensayos fase I/II. La estrategia de saltar exones con CRISPR ya demostró producir distrofina funcional en modelos murinos y pacientes.',
    sciDetail: 'La mutación introduce un codón de stop prematuro en el marco de lectura del gen DMD. CRISPR permite restaurar el marco mediante deleción de exones o corrección directa, produciendo distrofina mini-funcional.'
  }
];

// --- State ---
let crisprState = { caseIdx: 0, step: 'intro', attempts: 0, score: { precision: 0, speed: 0, hints: 0 }, startTime: 0 };
let crisprCountdown = null;

function clearCrisprTimer() {
  if (crisprCountdown) { clearInterval(crisprCountdown); crisprCountdown = null; }
}

function startCountdown(sec, onTick, onExpire) {
  clearCrisprTimer();
  let rem = sec;
  const tick = () => {
    const el = document.getElementById('crisprTimer');
    if (!el) { clearCrisprTimer(); return; }
    const pct = (rem / sec) * 100;
    const col = rem > 15 ? '#00e5ff' : rem > 8 ? '#ffd23f' : '#ff3c3c';
    el.innerHTML = `<div class="timer-bar-wrap"><div class="timer-bar" style="width:${pct}%;background:${col}"></div></div><span class="timer-num" style="color:${col}">${rem}s</span>`;
    if (onTick) onTick(rem);
    if (rem <= 0) { clearCrisprTimer(); if (onExpire) onExpire(); }
    rem--;
  };
  tick();
  crisprCountdown = setInterval(tick, 1000);
}

// --- CAS9 STATUS MESSAGES ---
const CAS9_MSGS = {
  boot:    ['⬛ Sistema iniciando…', '🟦 Cargando secuencia genómica…', '🟩 ARN guía sintetizado', '✅ CRISPR-Cas9 listo'],
  scan:    ['🔍 Escaneando secuencia…', '⚡ Analizando nucleótidos…', '🎯 Mutación detectada en posición TARGET', '🔒 Objetivo localizado'],
  fly:     ['🚀 Cas9 en navegación', '📡 ARN guía activo', '🎯 Posición TARGET confirmada', '⚡ Aproximando al sitio de corte'],
  cut:     ['✂️ Iniciando corte DSB', '⚡ Doble cadena comprometida', '🔓 Sitio expuesto', '⏳ Esperando inserción'],
  repair:  ['🧩 Secuencia correcta recibida', '🔧 Reparación HDR iniciada', '✅ Marco de lectura restaurado', '🟢 Proteína funcional verificada'],
};

function animateCas9Log(msgs, containerId, cb) {
  const el = document.getElementById(containerId);
  if (!el) { if(cb) cb(); return; }
  let i = 0;
  const next = () => {
    if (i >= msgs.length) { if(cb) cb(); return; }
    el.innerHTML = `<span class="cas9-log-line" style="animation-delay:0s">${msgs[i]}</span>`;
    i++;
    setTimeout(next, 700);
  };
  next();
}

function initCrisprLab() {
  const el = document.getElementById('crisprLab');
  if (!el) return;
  renderCrisprIntro();
}

// ========== INTRO ==========
// Scroll gently to CRISPR lab top — only after user interaction
function scrollToCrispr() {
  if (!crisprState || crisprState.step === 'intro') return;
  const el = document.getElementById('crisprLab');
  if (!el) return;
  const rect = el.getBoundingClientRect();
  if (rect.top < -10 || rect.top > window.innerHeight * 0.4) {
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}

// Freeze scroll during CRISPR re-render to prevent mobile jump
function freezeScroll(fn) {
  const y = window.scrollY;
  fn();
  requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)));
}

function renderCrisprIntro() {
  clearCrisprTimer();
  freezeScroll(() => { document.getElementById('crisprLab').innerHTML = `
    <div class="crispr-lab">
      <div class="crispr-intro">
        <div class="crispr-intro-visual">✂️</div>
        <h3>Laboratorio CRISPR-Cas9</h3>
        <p>Vas a editar ADN de un paciente real.<br/>Antes de entrar, aprendé <strong>la única regla que necesitás:</strong></p>

        <div class="rule-explainer">
          <div class="rule-exp-title">🧬 La regla de oro del ADN</div>
          <p class="rule-exp-desc">El ADN tiene 4 letras: <strong>A · T · C · G</strong><br/>Siempre van en pares fijos — nunca cambia:</p>
          <div class="rule-exp-pairs">
            <div class="rule-exp-pair">
              <span class="rule-base rA">A</span>
              <span class="rule-exp-txt">siempre va con</span>
              <span class="rule-base rT">T</span>
            </div>
            <div class="rule-exp-pair">
              <span class="rule-base rC">C</span>
              <span class="rule-exp-txt">siempre va con</span>
              <span class="rule-base rG">G</span>
            </div>
          </div>
          <div class="rule-exp-example">
            <strong>Ejemplo:</strong> Si la mutación cambió una
            <span class="rule-base rT" style="width:28px;height:28px;font-size:.9rem;display:inline-flex">T</span>
            por una
            <span class="rule-base rA" style="width:28px;height:28px;font-size:.9rem;display:inline-flex">A</span>
            errónea — la correcta para reponer es
            <span class="rule-base rT" style="width:28px;height:28px;font-size:.9rem;display:inline-flex">T</span>
            porque <strong>A va con T</strong>.
          </div>
        </div>

        <p style="font-size:.82rem;color:#7a9aaa;margin-bottom:1.75rem">Guardá esta regla — la vas a necesitar al elegir la base correcta.</p>
        <button class="crispr-start-btn" onclick="startCrispr(0)">✅ Entendí, entrar al laboratorio →</button>
      </div>
    </div>`; });
}

// ========== START — boot sequence ==========
function startCrispr(idx) {
  crisprState = { caseIdx: idx, step: 'boot', attempts: 0,
    score: { precision: 3, hintsUsed: 0 }, startTime: Date.now() };
  SFX.scan();

  const c = CRISPR_CASES[idx];
  freezeScroll(() => { document.getElementById('crisprLab').innerHTML = `
    <div class="crispr-lab">
      ${patientBar(c, '<span class="cas9-boot-label">⚡ Iniciando sistema…</span>')}
      <div class="crispr-body">
        <div class="cas9-terminal">
          <div class="terminal-header"><span class="t-dot r"></span><span class="t-dot y"></span><span class="t-dot g"></span><span style="font-size:.72rem;color:#3a5060;margin-left:.5rem">CRISPR-Cas9 v4.1 // Terminal</span></div>
          <div id="cas9Log" class="cas9-log-line">⬛ Sistema iniciando…</div>
        </div>
      </div>
    </div>`; });

  animateCas9Log(CAS9_MSGS.boot, 'cas9Log', () => {
    SFX.lock();
    setTimeout(() => { renderStep1(); scrollToCrispr(); }, 400);
  });
}

// ========== STEP 1: SCAN + find mutation ==========
function renderStep1() {
  clearCrisprTimer();
  const c = CRISPR_CASES[crisprState.caseIdx];
  const seq = [...c.seq];
  seq[c.mutantPos] = c.mutantBase;

  // All bases "alive" — mutant pulses differently but NO arrow
  const dnaHTML = seq.map((base, i) => {
    const isMut = i === c.mutantPos;
    return `<div class="dna-base base-${base} ${isMut ? 'base-mutant base-clickable' : 'base-alive'}"
      ${isMut ? 'onclick="step1Click()"' : ''}
    >${base}</div>`;
  }).join('');

  freezeScroll(() => { document.getElementById('crisprLab').innerHTML = `
    <div class="crispr-lab">
      ${patientBar(c, '1 / 3 — Detectar mutación')}
      <div class="crispr-body">
        <div class="cas9-terminal" style="margin-bottom:1rem">
          <div class="terminal-header"><span class="t-dot r"></span><span class="t-dot y"></span><span class="t-dot g"></span><span style="font-size:.72rem;color:#3a5060;margin-left:.5rem">CRISPR-Cas9 // Escáner activo</span></div>
          <div id="cas9Log" class="cas9-log-line">🔍 Escaneando secuencia…</div>
        </div>
        <div class="tension-alert" style="background:rgba(255,60,60,.06);border-color:rgba(255,60,60,.3)">
          <div class="tension-header">
            <span class="tension-icon">⚠️</span>
            <span class="tension-label" style="color:#ff3c3c">MUTACIÓN DETECTADA</span>
            <div id="crisprTimer" class="timer-wrap"></div>
          </div>
          <p class="tension-msg">El ADN de <strong>${c.patient.name.split(',')[0]}</strong> tiene una base errónea. Cada vez que la célula se divide, copia el error. <strong>Encontrá la base que no pertenece y tocala.</strong> Las bases correctas se mueven suavemente — la mutada tiene un ritmo diferente.</p>
        </div>
        <div class="dna-scene danger" id="dnaScene">
          <div class="dna-label">GEN: ${c.gene}</div>
          <div class="dna-strand-row" id="dnaRow">${dnaHTML}</div>
        </div>
        <div style="display:flex;align-items:center;gap:.875rem;margin-top:1rem;flex-wrap:wrap">
          <button class="hint-btn" onclick="showHint()">💡 Necesito ayuda</button>
          <button class="cc-btn cc-btn-secondary" onclick="clearCrisprTimer();renderCrisprIntro()">← Salir</button>
        </div>
        <div id="hintBox"></div>
      </div>
    </div>`; });

  animateCas9Log(CAS9_MSGS.scan, 'cas9Log', null);
  SFX.scan();

  startCountdown(30,
    (rem) => { if (rem === 10) showToast('⏰ 10 segundos — ¡la mutación sigue replicándose!'); },
    () => showToast('⏰ El ADN siguió replicando. Buscá la base con pulso diferente.')
  );
}

function step1Click() {
  clearCrisprTimer();
  crisprState.score.precision += 1;
  SFX.lock();
  showToast('🎯 Objetivo localizado. Cas9 en camino…');
  setTimeout(() => { renderStep2(); scrollToCrispr(); }, 300);
}

function showHint() {
  const c = CRISPR_CASES[crisprState.caseIdx];
  crisprState.score.hintsUsed++;
  SFX.hint();
  const box = document.getElementById('hintBox');
  if (box) {
    box.innerHTML = `<div class="hint-box">${c.hintMsg}</div>`;
    // also highlight after 2 hints
    if (crisprState.score.hintsUsed >= 2) {
      document.querySelectorAll('.base-mutant').forEach(el => el.classList.add('base-hint-glow'));
      box.innerHTML += `<div class="hint-box" style="margin-top:.5rem">🔎 La base mutada está resaltada — tocala para continuar.</div>`;
    }
  }
}

// ========== STEP 2: CAS9 flies ==========
function renderStep2() {
  clearCrisprTimer();
  const c = CRISPR_CASES[crisprState.caseIdx];
  const seq = [...c.seq]; seq[c.mutantPos] = c.mutantBase;

  const dnaHTML = seq.map((base, i) => {
    const isMut = i === c.mutantPos;
    return `<div class="dna-base base-${base} ${isMut ? 'base-mutant' : ''}">${base}</div>`;
  }).join('');

  const targetPct = Math.round((c.mutantPos / seq.length) * 78);

  freezeScroll(() => { document.getElementById('crisprLab').innerHTML = `
    <div class="crispr-lab">
      ${patientBar(c, '2 / 3 — Cas9 navegando')}
      <div class="crispr-body">
        <div class="cas9-terminal" style="margin-bottom:1rem">
          <div class="terminal-header"><span class="t-dot r"></span><span class="t-dot y"></span><span class="t-dot g"></span><span style="font-size:.72rem;color:#3a5060;margin-left:.5rem">CRISPR-Cas9 // Navegación</span></div>
          <div id="cas9Log" class="cas9-log-line">🚀 Cas9 en navegación</div>
        </div>
        <div class="tension-alert" style="background:rgba(255,210,63,.06);border-color:rgba(255,210,63,.3)">
          <div class="tension-header">
            <span class="tension-icon">🎯</span>
            <span class="tension-label" style="color:#ffd23f">CAS9 EN CAMINO</span>
          </div>
          <p class="tension-msg">El ARN guía lleva al Cas9 exactamente a la posición <strong>${c.mutantPos + 1}</strong>. Va a hacer un corte de doble cadena (DSB) con precisión atómica. Cuando llegue, vas a poder insertar la base correcta.</p>
        </div>
        <div class="dna-scene" id="dnaScene">
          <div class="dna-label">GEN: ${c.gene} — Cas9 aproximando</div>
          <div class="dna-strand-row">${dnaHTML}</div>
          <div class="cas9-robot" id="cas9El" style="left:2%">✂️</div>
        </div>
        <div class="crispr-controls" style="margin-top:1rem">
          <button class="cc-btn cc-btn-primary" id="cutBtn" onclick="step2Cut()" disabled style="opacity:.35">Esperá al Cas9…</button>
        </div>
        <button class="cc-btn cc-btn-secondary" style="margin-top:.875rem" onclick="renderCrisprIntro()">← Salir</button>
      </div>
    </div>`; });

  animateCas9Log(CAS9_MSGS.fly, 'cas9Log', null);
  SFX.scan();

  setTimeout(() => {
    const el = document.getElementById('cas9El');
    if (el) el.style.left = `${targetPct}%`;
  }, 100);

  setTimeout(() => {
    const btn = document.getElementById('cutBtn');
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; btn.textContent = '✂️ Ejecutar corte DSB'; }
    SFX.lock();
  }, 1500);
}

function step2Cut() {
  SFX.cut();
  // Flash the mutant base
  const bases = document.querySelectorAll('.dna-base');
  const c = CRISPR_CASES[crisprState.caseIdx];
  if (bases[c.mutantPos]) {
    bases[c.mutantPos].classList.add('base-cutting');
    bases[c.mutantPos].textContent = '⚡';
  }
  setTimeout(() => { renderStep3(); scrollToCrispr(); }, 800);
}

// ========== STEP 3: cut visible + base keyboard ==========
function renderStep3() {
  const c = CRISPR_CASES[crisprState.caseIdx];
  const seq = [...c.seq]; seq[c.mutantPos] = c.mutantBase;

  const dnaHTML = seq.map((base, i) => {
    if (i === c.mutantPos) return `<div class="dna-base base-cut-slot" id="cutSlot">?</div>`;
    return `<div class="dna-base base-${base}">${base}</div>`;
  }).join('');

  freezeScroll(() => { document.getElementById('crisprLab').innerHTML = `
    <div class="crispr-lab">
      ${patientBar(c, '3 / 3 — Insertar base correcta')}
      <div class="crispr-body">
        <div class="cas9-terminal" style="margin-bottom:1rem">
          <div class="terminal-header"><span class="t-dot r"></span><span class="t-dot y"></span><span class="t-dot g"></span><span style="font-size:.72rem;color:#3a5060;margin-left:.5rem">CRISPR-Cas9 // Corte completado</span></div>
          <div id="cas9Log" class="cas9-log-line">✂️ Iniciando corte DSB</div>
        </div>
        <div class="tension-alert" style="background:rgba(0,229,255,.06);border-color:rgba(0,229,255,.3)">
          <div class="tension-header">
            <span class="tension-icon">✂️</span>
            <span class="tension-label" style="color:#00e5ff">CORTE REALIZADO — INSERTAR BASE</span>
          </div>
          <p class="tension-msg">El hueco <strong style="color:#ffd23f">"?"</strong> es donde estaba la mutación. Usá el teclado de abajo para insertar la base correcta. Recordá: <strong>A↔T</strong> y <strong>C↔G</strong>.</p>
        </div>
        <div class="dna-scene" id="dnaScene">
          <div class="dna-label">GEN: ${c.gene} — hueco esperando base</div>
          <div class="dna-strand-row" id="dnaRow">${dnaHTML}</div>
        </div>
        <div class="base-keyboard">
          <p class="base-kb-label">🧬 ¿Cuál es la base complementaria correcta?</p>
          <div class="base-kb-rule">
            <span class="rule-mini rA">A</span><span>↔</span><span class="rule-mini rT">T</span>
            <span style="margin:0 1rem;color:#2a4050">|</span>
            <span class="rule-mini rC">C</span><span>↔</span><span class="rule-mini rG">G</span>
          </div>
          <div class="base-kb-row" id="baseKbRow">
            <button class="base-kb-btn base-A" onclick="insertBase('A')">A<span>Adenina</span></button>
            <button class="base-kb-btn base-T" onclick="insertBase('T')">T<span>Timina</span></button>
            <button class="base-kb-btn base-C" onclick="insertBase('C')">C<span>Citosina</span></button>
            <button class="base-kb-btn base-G" onclick="insertBase('G')">G<span>Guanina</span></button>
          </div>
        </div>
        <div id="baseFeedback"></div>
        <button class="cc-btn cc-btn-secondary" style="margin-top:1rem" onclick="renderCrisprIntro()">← Salir</button>
      </div>
    </div>`; });

  animateCas9Log(CAS9_MSGS.cut, 'cas9Log', null);
}

function insertBase(base) {
  const c = CRISPR_CASES[crisprState.caseIdx];
  const fb = document.getElementById('baseFeedback');
  const slot = document.getElementById('cutSlot');

  if (base === c.correctBase) {
    // ✅ CORRECT
    SFX.success();
    if (slot) { slot.className = `dna-base base-${base} base-repaired`; slot.textContent = base; slot.id=''; }
    document.querySelectorAll('.base-kb-btn').forEach(b => b.disabled = true);
    if (fb) fb.innerHTML = `<div class="base-feedback-ok">✅ <strong>${base}</strong> es correcto. La base ${base === 'T' ? 'A' : base === 'A' ? 'T' : base === 'C' ? 'G' : 'C'} mutada fue reemplazada por su complementaria <strong>${base}</strong>. Secuencia restaurada.</div>`;

    // Score precision
    if (crisprState.attempts === 0) crisprState.score.precision = 100;
    else if (crisprState.attempts === 1) crisprState.score.precision = 70;
    else crisprState.score.precision = 40;

    animateCas9Log(CAS9_MSGS.repair, 'cas9Log', null);
    setTimeout(() => { showSuccessScreen(); scrollToCrispr(); }, 1400);

  } else {
    // ❌ WRONG
    SFX.error();
    crisprState.attempts++;
    if (slot) { slot.classList.add('base-wrong-shake'); setTimeout(()=>slot.classList.remove('base-wrong-shake'),500); }
    const specific = c.wrongFeedback[base] || '⚠️ Esa base no complementa correctamente en esta posición.';
    const hint2 = crisprState.attempts >= 2
      ? `<br/><span style="color:#ffd23f">💡 Pista: La base mutada es <strong>${c.mutantBase}</strong>. ¿Cuál es su par según la regla A↔T / C↔G?</span>`
      : '';
    if (fb) fb.innerHTML = `<div class="base-feedback-wrong">${specific}${hint2}</div>`;
  }
}

// ========== SUCCESS SCREEN ==========
function showSuccessScreen() {
  clearCrisprTimer();
  const c = CRISPR_CASES[crisprState.caseIdx];
  const elapsed = Math.round((Date.now() - crisprState.startTime) / 1000);
  const speedScore = elapsed < 40 ? 100 : elapsed < 70 ? 75 : 50;
  const hintPenalty = crisprState.score.hintsUsed * 10;
  const finalScore = Math.max(0, Math.round((crisprState.score.precision + speedScore) / 2 - hintPenalty));

  const rank = finalScore >= 90 ? { label: '🏆 Investigador/a Senior', color: '#ffd23f' }
             : finalScore >= 70 ? { label: '🔬 Biotecnólogo/a en Formación', color: '#00e5ff' }
             : finalScore >= 50 ? { label: '🌱 Científico/a Emergente', color: '#2ecc71' }
             :                    { label: '📚 Aprendiz de Laboratorio', color: '#9b59b6' };

  const baseColors = { A:'rgba(0,229,100,.15)', T:'rgba(255,200,0,.1)', C:'rgba(0,180,255,.1)', G:'rgba(200,80,255,.1)' };
  const textColors  = { A:'#00e564', T:'#ffc800', C:'#00b4ff', G:'#c850ff' };
  const seqHTML = c.seq.map((b,i) => `<div class="success-base" style="background:${baseColors[b]};color:${textColors[b]};border:1px solid ${baseColors[b]};animation-delay:${i*.05}s">${b}</div>`).join('');

  freezeScroll(() => { document.getElementById('crisprLab').innerHTML = `
    <div class="crispr-lab">
      <div class="crispr-patient-bar">
        <div class="cpb-icon">${c.patient.icon}</div>
        <div class="cpb-info"><div class="cpb-name">${c.patient.name}</div><div class="cpb-condition">${c.patient.condition}</div></div>
        <div class="cpb-status cured">✓ CURADO/A</div>
      </div>
      <div class="crispr-success">
        <span class="success-emoji">🎉</span>
        <h3>¡Edición genómica exitosa!</h3>
        <p>${c.successMsg}</p>

        <!-- ANTES vs DESPUÉS -->
        <div class="before-after">
          <div class="ba-card ba-before">
            <div class="ba-icon">${c.beforeProtein.icon}</div>
            <div class="ba-label">ANTES</div>
            <div class="ba-name">${c.beforeProtein.label}</div>
            <div class="ba-desc">${c.beforeProtein.desc}</div>
          </div>
          <div class="ba-arrow">→</div>
          <div class="ba-card ba-after">
            <div class="ba-icon">${c.afterProtein.icon}</div>
            <div class="ba-label">DESPUÉS</div>
            <div class="ba-name">${c.afterProtein.label}</div>
            <div class="ba-desc">${c.afterProtein.desc}</div>
          </div>
        </div>

        <!-- DNA corregido -->
        <div class="success-dna-visual">${seqHTML}</div>

        <!-- SCORE -->
        <div class="score-board">
          <div class="score-item"><span class="score-icon">⭐</span><span class="score-val">${crisprState.score.precision}%</span><span class="score-lbl">Precisión</span></div>
          <div class="score-item"><span class="score-icon">⚡</span><span class="score-val">${elapsed}s</span><span class="score-lbl">Tiempo</span></div>
          <div class="score-item"><span class="score-icon">🧠</span><span class="score-val">${crisprState.score.hintsUsed === 0 ? '0' : crisprState.score.hintsUsed}</span><span class="score-lbl">Pistas usadas</span></div>
        </div>
        <div class="rank-badge" style="border-color:${rank.color};color:${rank.color}">${rank.label}</div>

        <!-- MINI EXPLICACIÓN CIENTÍFICA -->
        <div class="sci-note" style="margin:1.5rem auto;max-width:520px">
          <div class="sci-note-label">📚 ¿Qué pasó realmente?</div>
          <p>${c.sciNote}</p>
          <details style="margin-top:.625rem">
            <summary style="font-size:.75rem;color:#00e5ff;cursor:pointer;font-weight:700">Ver detalle técnico →</summary>
            <p style="margin-top:.5rem;font-size:.8rem;color:#7a9aaa;line-height:1.65">${c.sciDetail}</p>
          </details>
        </div>

        <div style="display:flex;gap:.875rem;justify-content:center;flex-wrap:wrap">
          ${crisprState.caseIdx < CRISPR_CASES.length - 1
            ? `<button class="crispr-start-btn" onclick="startCrispr(${crisprState.caseIdx + 1})">Siguiente paciente →</button>`
            : `<button class="crispr-start-btn" onclick="startCrispr(0)">Repetir laboratorio 🔁</button>`}
          <button class="cc-btn cc-btn-secondary" onclick="renderCrisprIntro()" style="margin-top:0">Volver al inicio</button>
        </div>
      </div>
    </div>`; });
}

function patientBar(c, stepLabel) {
  return `<div class="crispr-patient-bar">
    <div class="cpb-icon">${c.patient.icon}</div>
    <div class="cpb-info"><div class="cpb-name">${c.patient.name}</div><div class="cpb-condition">${c.patient.condition}</div></div>
    <div class="cpb-status">${stepLabel}</div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => { initCrisprLab(); });
