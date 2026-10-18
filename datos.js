/* =========================================================================
   ADEX Sweets & Pink · Plan BPM del ponqué de vainilla
   Todo el contenido de la página vive aquí. app.js lo dibuja.
   ========================================================================= */
window.CFG = {
  /* ---------- Cronómetro de exposición (minutos) ---------- */
  agenda: [
    { id: 'empresa',     nombre: 'Empresa',               desde: 0,  hasta: 2 },
    { id: 'plano',       nombre: 'Plano',                 desde: 2,  hasta: 5 },
    { id: 'proceso',     nombre: 'Proceso',               desde: 5,  hasta: 7 },
    { id: 'recepcion',   nombre: 'Recepción',             desde: 7,  hasta: 9 },
    { id: 'personal',    nombre: 'Personal',              desde: 9,  hasta: 12 },
    { id: 'saneamiento', nombre: 'Saneamiento',           desde: 12, hasta: 15 },
    { id: 'micro',       nombre: 'Microbiología',         desde: 15, hasta: 17 },
    { id: 'salida',      nombre: 'Etiqueta y transporte', desde: 17, hasta: 19 },
    { id: 'cierre',      nombre: 'Cierre',                desde: 19, hasta: 20 }
  ],

  /* ---------- 1. Empresa ---------- */
  indicadores: [
    { n: 40, sufijo: '',      texto: 'ponqués de 1 lb por jornada' },
    { n: 5,  sufijo: ' días', texto: 'vida útil a temperatura ambiente' },
    { n: 11, sufijo: '',      texto: 'etapas de proceso' },
    { n: 14, sufijo: '',      texto: 'formatos de registro' }
  ],

  organigrama: [
    { id: 'gerente', nivel: 0, cargo: 'Gerente propietaria', sub: 'Dirección y compras',
      texto: 'Aprueba proveedores y compras, asigna recursos para adecuaciones locativas, recibe las quejas de clientes y decide los retiros de producto. Firma el plan de saneamiento.' },
    { id: 'calidad', nivel: 1, cargo: 'Responsable de calidad y BPM', sub: 'Bacterióloga, asesoría externa',
      texto: 'Diseña y actualiza el plan BPM, verifica los registros cada semana, toma y envía las muestras al laboratorio, interpreta resultados, lidera las capacitaciones y la auditoría interna (Res. 2674, Cap. V).' },
    { id: 'jefe', nivel: 2, cargo: 'Jefe de producción', sub: 'Formulación y horneo',
      texto: 'Controla cada lote: fórmula, horneo, enfriamiento. Diligencia F02, F03 y F11. Revisa el estado de salud del personal al ingreso.' },
    { id: 'operarias', nivel: 2, cargo: 'Operarias de producción (2)', sub: 'Preparación, limpieza y empaque',
      texto: 'Elaboran, porcionan, empacan y rotulan. Ejecutan la limpieza diaria y profunda (F04, F05) y preparan las soluciones desinfectantes (F06).' },
    { id: 'auxiliar', nivel: 2, cargo: 'Auxiliar de despacho', sub: 'Recepción, residuos y transporte',
      texto: 'Recibe e inspecciona materias primas (F01), saca los residuos (F08), revisa las estaciones de plagas (F07) e inspecciona el vehículo antes de cada entrega (F12).' }
  ],

  ficha: [
    ['Producto', 'Ponqué de vainilla horneado, tipo pound cake'],
    ['Presentaciones', 'Entero de 1 lb (454 g) y porción de 120 g en bolsa sellada'],
    ['Ingredientes', 'Harina de trigo fortificada, mantequilla, azúcar, huevo, leche, esencia de vainilla, polvo de hornear, sal'],
    ['Conservación', 'Temperatura ambiente, lugar fresco y seco, protegido del sol'],
    ['Vida útil', '5 días empacado (validada con pruebas de estabilidad)'],
    ['Alérgenos', 'Gluten (trigo), huevo, leche'],
    ['Consumidor', 'Público general; no apto para personas con alergia a los alérgenos declarados'],
    ['Peligro principal', 'Mohos por recontaminación después del horneo y huevo crudo mal manejado antes de hornear']
  ],

  /* ---------- 2. Plano de la planta (SVG 960 × 620) ---------- */
  areas: [
    { id: 'recepcion', nombre: 'Recepción', sub: 'materias primas', x: 20, y: 20, w: 180, h: 120, arts: 'Arts. 6, 16 y 28',
      texto: 'Puerta independiente para proveedores. Mesa de inspección en acero inoxidable, báscula y termómetro. Aquí se diligencia el F01 y se retira el cartón exterior antes de entrar a bodega.',
      recorrido: 'Llegan harina, azúcar, huevos y mantequilla. Se inspeccionan y se registran en el F01.' },
    { id: 'bodega', nombre: 'Bodega seca', sub: 'PEPS sobre estibas', x: 20, y: 140, w: 180, h: 140, arts: 'Arts. 6 y 28',
      texto: 'Estibas plásticas a 15 cm del piso y separadas de la pared. Insumos abiertos en recipientes con tapa, rotulados con fecha de apertura. Estante “No conforme”.',
      recorrido: 'Los insumos secos se guardan por PEPS sobre estibas; huevos y mantequilla pasan a la nevera.' },
    { id: 'refri', nombre: 'Refrigeración', sub: 'neveras 0 a 4 °C', x: 20, y: 280, w: 180, h: 120, arts: 'Arts. 6 y 28', zona: 'cold',
      texto: 'Nevera con termómetro, registrada dos veces al día (F02). Aquí se guardan huevos y mantequilla, separados de cualquier producto listo.',
      recorrido: 'Huevos y mantequilla se conservan entre 0 y 4 °C, con lectura de temperatura dos veces al día (F02).' },
    { id: 'alistamiento', nombre: 'Alistamiento', sub: 'pesaje', x: 200, y: 20, w: 160, h: 210, arts: 'Arts. 7 y 8',
      texto: 'Pesaje según fórmula estándar y desinfección de huevos justo antes de usar, lejos de la mesa de preparación para no contaminar la masa con la cáscara.',
      recorrido: 'Se pesan los ingredientes de la fórmula y se desinfectan los huevos justo antes de usarlos.' },
    { id: 'preparacion', nombre: 'Preparación', sub: 'mezclado', x: 360, y: 20, w: 200, h: 210, arts: 'Arts. 7 y 8',
      texto: 'Mesas de acero inoxidable y batidora industrial, superficies lisas y sin grietas. Limpieza entre preparaciones y al final del día (F04). Lavamanos de pedal cercano.',
      recorrido: 'Cremado de mantequilla y azúcar, huevos, vainilla y harina tamizada. Se llenan los moldes.' },
    { id: 'horneo', nombre: 'Horneo', sub: 'horno de convección', x: 560, y: 20, w: 200, h: 210, arts: 'Arts. 7, 8 y 26', pc: true,
      texto: 'Horno separado de la pared, con extractor y filtro. Termómetro de horno para verificar 170 a 180 °C. Tiempo y temperatura de cada lote en el F11.',
      recorrido: 'Horneo a 170-180 °C por 45-55 minutos. Se verifica que el centro salga seco. Punto de control.' },
    { id: 'enfriamiento', nombre: 'Enfriamiento', sub: 'rejillas, área cerrada', x: 760, y: 20, w: 180, h: 210, arts: 'Art. 7', pc: true,
      texto: 'Área cerrada, sin corrientes de aire del exterior, para que el producto no se recontamine con esporas de mohos mientras se enfría. Producto cubierto. Muestreo de ambiente trimestral.',
      recorrido: 'Enfriamiento en rejilla, cubierto y en área cerrada para que no caigan esporas de mohos. Punto de control.' },
    { id: 'lavado', nombre: 'Lavado', sub: 'utensilios', x: 200, y: 230, w: 160, h: 170, arts: 'Arts. 7 y 26',
      texto: 'Poceta doble en acero inoxidable (lavado y desinfección), escurridor para secado al aire y trampa de grasas a la salida.' },
    { id: 'empaque', nombre: 'Empaque y rotulado', sub: 'zona limpia', x: 360, y: 230, w: 260, h: 170, arts: 'Art. 7 y Res. 5109', zona: 'clean',
      texto: 'Zona de mayor exigencia: el producto ya no recibirá calor. Mesa y utensilios exclusivos desinfectados; etiqueta con lote, vencimiento, alérgenos y conservación.',
      recorrido: 'Empaque en bolsa sellada y etiqueta con lote y vencimiento.' },
    { id: 'terminado', nombre: 'Terminado', sub: 'desmolde y porcionado', x: 620, y: 230, w: 320, h: 170, arts: 'Art. 7',
      texto: 'Desmolde del ponqué ya frío y corte de porciones con cuchillo y tabla exclusivos, desinfectados. Mesa de acero inoxidable lejos de corrientes de aire.',
      recorrido: 'Desmolde y porcionado con utensilios exclusivos desinfectados.' },
    { id: 'residuos', nombre: 'Residuos', sub: 'acceso exterior propio', x: 20, y: 400, w: 180, h: 180, arts: 'Arts. 6 y 26', zona: 'waste',
      texto: 'Área cerrada y ventilada con canecas de tapa por colores. Piso y paredes lavables, punto de agua. Salida propia para no cruzarse con producto terminado.' },
    { id: 'aseo', nombre: 'Aseo', sub: 'químicos con llave', x: 200, y: 400, w: 120, h: 180, arts: 'Arts. 6 y 26',
      texto: 'Detergentes y desinfectantes rotulados, con hojas de seguridad, separados de producción y de la bodega de alimentos.' },
    { id: 'vestier', nombre: 'Vestier y baño', sub: 'filtro sanitario', x: 320, y: 400, w: 160, h: 180, arts: 'Arts. 6 y 14',
      texto: 'Entrada del personal. Casilleros para ropa de calle, baño que no abre a producción y lavamanos de pedal antes de entrar a planta.' },
    { id: 'despacho', nombre: 'Despacho', sub: 'salida de producto', x: 480, y: 400, w: 200, h: 180, arts: 'Arts. 28 y 29',
      texto: 'Ponqués empacados en canastillas tapadas, listos para entrega. Puerta independiente hacia el vehículo; inspección y F12 antes de cargar.',
      recorrido: 'Salida en canastilla tapada, con vehículo inspeccionado.' },
    { id: 'oficina', nombre: 'Oficina', sub: 'administración y archivo', x: 680, y: 400, w: 260, h: 180, arts: 'Art. 26',
      texto: 'Archivo de registros, certificados médicos, constancias de capacitación, certificados de fumigación y lavado de tanque, y resultados de laboratorio para la visita sanitaria.' }
  ],

  // Ruta animada del producto (ids de área, en orden)
  ruta: ['recepcion', 'bodega', 'refri', 'alistamiento', 'preparacion', 'horneo', 'enfriamiento', 'terminado', 'empaque', 'despacho'],

  // Puertas: [x, y, w, h]
  puertas: [
    [8, 58, 8, 44],      // proveedores → recepción
    [80, 137, 40, 6],    // recepción → bodega
    [80, 277, 40, 6],    // bodega → refrigeración
    [197, 170, 6, 40],   // bodega → alistamiento
    [357, 100, 6, 40],   // alistamiento → preparación
    [557, 100, 6, 40],   // preparación → horneo
    [757, 100, 6, 40],   // horneo → enfriamiento
    [830, 227, 40, 6],   // enfriamiento → terminado
    [617, 295, 6, 40],   // terminado → empaque
    [540, 397, 40, 6],   // empaque → despacho
    [260, 227, 40, 6],   // alistamiento → lavado
    [380, 397, 40, 6],   // vestier → empaque
    [8, 470, 8, 44],     // salida de residuos
    [380, 584, 44, 8],   // entrada del personal
    [560, 584, 44, 8]    // salida al vehículo
  ],

  estaciones: [
    [8, 30], [8, 380], [250, 8], [650, 8], [952, 120], [952, 470], [300, 592], [760, 592],   // 1-8 exteriores
    [180, 120], [170, 260], [500, 560], [220, 560], [910, 250]                             // 9-13 interiores
  ],

  produccionIntro: 'Mesas en acero inoxidable, batidora industrial, horno de convección, rejillas de enfriamiento y moldes en buen estado. Todo liso, sin grietas ni óxido y separado de la pared para limpiar detrás. No se usan utensilios de madera porque son porosos y no se pueden desinfectar bien.',

  /* ---------- 3. Proceso productivo ---------- */
  etapas: [
    { n: 1, etapa: 'Recepción', desc: 'Llegan harina, azúcar, mantequilla, huevos, esencia y polvo de hornear de proveedores aprobados.',
      b: '<i>Salmonella</i> en cáscara de huevo; mohos en harina húmeda', q: 'Insumos vencidos o sin registro sanitario', f: 'Insectos, piedras o plástico en la harina',
      control: 'Inspección de cada entrega con criterios de aceptación y rechazo', reg: 'F01', pc: true },
    { n: 2, etapa: 'Almacenamiento', desc: 'Secos en bodega sobre estibas; huevos y mantequilla en nevera.',
      b: 'Crecimiento de mohos por humedad; roedores e insectos', q: 'Contacto con productos de aseo', f: 'Plagas y polvo',
      control: 'PEPS, estibas a 15 cm del piso, recipientes con tapa, químicos en cuarto aparte', reg: 'F02', pc: false },
    { n: 3, etapa: 'Alistamiento y pesaje', desc: 'Se pesan los ingredientes según la fórmula estándar y se desinfectan los huevos.',
      b: 'Contaminación cruzada desde la cáscara del huevo', q: 'Exceso de polvo de hornear', f: 'Fragmentos de cáscara',
      control: 'Báscula verificada, huevos desinfectados en punto aparte, se quiebran en recipiente separado antes de agregarlos', reg: '—', pc: false },
    { n: 4, etapa: 'Cremado de mantequilla y azúcar', desc: 'Se baten hasta obtener una mezcla clara y aireada.',
      b: 'Manos o utensilios mal lavados', q: 'Residuos de detergente en el bowl', f: 'Piezas sueltas de la batidora',
      control: 'Bowl y globo lavados y desinfectados, revisión de la batidora antes de usar', reg: '—', pc: false },
    { n: 5, etapa: 'Incorporación de huevos y vainilla', desc: 'Se agregan uno a uno, junto con la esencia de vainilla.',
      b: '<i>Salmonella</i> del huevo crudo hacia la masa', q: 'Esencia no apta para alimentos', f: 'Cáscaras',
      control: 'Huevo quebrado aparte y revisado; la masa cruda no se prueba', reg: '—', pc: false },
    { n: 6, etapa: 'Adición de secos tamizados', desc: 'Harina, polvo de hornear y sal tamizados, alternados con la leche.',
      b: 'Esporas de <i>Bacillus cereus</i> propias de la harina', q: '—', f: 'Grumos, insectos o hilos del empaque',
      control: 'Tamizado obligatorio de la harina', reg: '—', pc: false },
    { n: 7, etapa: 'Moldeado', desc: 'La mezcla va a moldes engrasados y enharinados.',
      b: 'Moldes mal lavados', q: 'Grasa rancia como desmoldante', f: 'Restos de papel o pintura de moldes viejos',
      control: 'Moldes en buen estado, desmoldante vigente', reg: '—', pc: false },
    { n: 8, etapa: 'Horneo', desc: '170 a 180 °C durante 45 a 55 minutos, según el molde.',
      b: 'Supervivencia de patógenos si la cocción queda incompleta', q: '—', f: '—',
      control: 'Temperatura del horno verificada con termómetro; el palillo debe salir seco del centro', reg: 'F11', pc: true },
    { n: 9, etapa: 'Enfriamiento', desc: 'En rejilla, dentro del área cerrada de enfriamiento, cubierto.',
      b: 'Recontaminación con esporas de mohos del ambiente', q: '—', f: 'Polvo o insectos',
      control: 'Área cerrada, producto cubierto y enfriado por completo antes de empacar para evitar condensación', reg: 'F11', pc: true },
    { n: 10, etapa: 'Desmolde, porcionado y empaque', desc: 'Corte de porciones y empaque en bolsa sellada con etiqueta.',
      b: 'Manos, cuchillos y tablas contaminados', q: 'Empaque no apto para alimentos', f: 'Fragmentos de empaque',
      control: 'Utensilios exclusivos desinfectados, empaque con ficha técnica (Res. 683/2012), etiqueta con lote y vencimiento', reg: '—', pc: false },
    { n: 11, etapa: 'Almacenamiento y despacho', desc: 'Producto empacado a temperatura ambiente hasta su entrega.',
      b: 'Mohos si el empaque se rompe o hay humedad', q: '—', f: 'Golpes y daño del empaque',
      control: 'Lugar fresco y seco, PEPS, canastilla tapada y vehículo inspeccionado', reg: 'F12', pc: true }
  ],

  /* ---------- 4. Recepción: juego del inspector ---------- */
  entregas: [
    { insumo: 'Bulto de harina de 25 kg', ve: 'Una esquina está mojada y huele a humedad.', ok: false,
      porque: 'La humedad favorece el crecimiento de mohos y la producción de micotoxinas; además indica mal almacenamiento del proveedor.' },
    { insumo: 'Bandeja de 30 huevos', ve: 'Cáscaras limpias y enteras, ninguno roto. La granja tiene registro ICA.', ok: true,
      porque: 'Cumple todos los criterios. Se guardan en nevera en su bandeja.' },
    { insumo: 'Mantequilla en bloque', ve: 'Llega blanda y brillante, en un carro sin refrigeración.', ok: false,
      porque: 'Perdió la refrigeración; la grasa se pudo alterar y el producto se contamina con mayor facilidad.' },
    { insumo: 'Azúcar refinada', ve: 'Bolsa sellada, seca y con registro sanitario vigente.', ok: true,
      porque: 'Empaque íntegro y rotulado completo.' },
    { insumo: 'Esencia de vainilla', ve: 'Viene en un frasco reenvasado, sin etiqueta ni registro sanitario.', ok: false,
      porque: 'Sin rotulado no se sabe qué contiene, si es apta para alimentos ni su fecha de vencimiento.' },
    { insumo: 'Huevos de otro proveedor', ve: 'Varias cáscaras tienen manchas de materia fecal y plumas.', ok: false,
      porque: 'La materia fecal en la cáscara es fuente de <i>Salmonella</i> spp. y contamina la nevera.' },
    { insumo: 'Polvo de hornear', ve: 'Envase sellado, rotulado y vigente hasta 2027.', ok: true,
      porque: 'Cumple los criterios de aceptación.' },
    { insumo: 'Bolsas para empacar porciones', ve: 'En caja cerrada, con ficha técnica de material apto para contacto con alimentos.', ok: true,
      porque: 'Cumplen la Resolución 683 de 2012.' }
  ],

  criterios: [
    ['Harina de trigo', 'Empaque cerrado y seco, registro sanitario, fecha vigente', 'Bolsa rota o húmeda, gorgojos, grumos, olor a humedad', 'Bodega seca, sobre estiba; abierta en recipiente con tapa'],
    ['Azúcar', 'Empaque íntegro, seco, sin material extraño', 'Humedad, insectos, empaque roto', 'Bodega seca, recipiente con tapa'],
    ['Huevos', 'Cáscara limpia, entera, sin fisuras; granja con registro ICA', 'Cáscara rota o con materia fecal, olor anormal', 'Nevera, en su bandeja'],
    ['Mantequilla', 'Llega refrigerada, empaque íntegro, color y olor normales', 'Blanda, derretida, rancia o con moho', 'Nevera 0 a 4 °C'],
    ['Leche', 'Pasteurizada, refrigerada, vigente, empaque íntegro', 'Caliente, inflada o goteando', 'Nevera 0 a 4 °C'],
    ['Esencia de vainilla y polvo de hornear', 'Envase sellado, rotulado y vigente', 'Abierto, reenvasado o vencido', 'Bodega seca'],
    ['Bolsas y etiquetas', 'Aptas para contacto con alimentos (Res. 683/2012), en caja cerrada', 'Sucias o sin ficha técnica', 'Estante propio, lejos de químicos']
  ],

  reglasAlmacen: [
    '<b>PEPS:</b> lo primero que entra es lo primero que sale, con fecha de recepción y de apertura rotuladas.',
    'Estibas plásticas a 15 cm del piso y separadas de la pared.',
    'Nada directo sobre el piso; estante rotulado “No conforme”.',
    'Nevera revisada al inicio y al final de la jornada (F02).'
  ],

  /* ---------- 5. Personal manipulador ---------- */
  dotacion: [
    { el: 'Cofia o gorro', x: 150, y: 40,
      razon: 'Cubre todo el cabello. Si hay barba, cubre-barba. Evita que caigan cabellos y microorganismos del cuero cabelludo al producto.' },
    { el: 'Tapabocas', x: 150, y: 104,
      razon: 'Cubre nariz y boca y se cambia cuando se humedece. La nariz y la garganta son reservorio de <i>Staphylococcus aureus</i>, productor de enterotoxinas termoestables.' },
    { el: 'Uniforme claro', x: 112, y: 182,
      razon: 'Color claro para que se note la suciedad, limpio cada día, sin bolsillos por encima de la cintura y con cierre o broches en lugar de botones, que pueden caer al producto.' },
    { el: 'Delantal', x: 150, y: 290,
      razon: 'Impermeable para el lavado de utensilios. Se retira al ir al baño o salir de la planta para no llevar contaminación de un área a otra.' },
    { el: 'Manos', x: 62, y: 330,
      razon: 'Uñas cortas, limpias, sin esmalte ni uñas postizas. Sin anillos, relojes ni pulseras: bajo ellos se acumula suciedad. Los guantes, si se usan, no reemplazan el lavado de manos.' },
    { el: 'Sin joyas ni celular', x: 238, y: 318,
      razon: 'Ningún objeto personal entra a la planta. El celular se deja en el casillero del vestier porque se toca todo el día y no se puede desinfectar bien.' },
    { el: 'Calzado', x: 120, y: 486,
      razon: 'Cerrado, impermeable, antideslizante y de uso exclusivo dentro de la planta, para no entrar suciedad de la calle y prevenir caídas.' }
  ],

  lavado: [
    'Mojar las manos y aplicar jabón',
    'Frotar palma con palma',
    'Dorso de cada mano entrelazando dedos',
    'Entre los dedos y pulgares en rotación',
    'Uñas contra la palma y muñecas',
    'Enjuagar, secar con toalla desechable y cerrar la llave sin tocarla'
  ],

  capacitacion: [
    ['Al ingresar', 'Inducción: BPM y prácticas higiénicas en ADEX', 'Charla y recorrido por la planta', 2],
    ['Febrero', 'Lavado de manos y presentación personal', 'Taller con gel fluorescente y luz UV', 1.5],
    ['Abril', 'ETA en pastelería: <i>Salmonella</i> en huevo, <i>S. aureus</i>, mohos', 'Charla con casos reales', 2],
    ['Junio', 'Limpieza, desinfección y preparación de soluciones', 'Práctica con la calculadora de diluciones', 1.5],
    ['Agosto', 'Control de plagas y manejo de residuos', 'Recorrido de inspección', 1],
    ['Octubre', 'Almacenamiento, temperaturas y transporte', 'Lectura de termómetros', 1],
    ['Noviembre', 'Rotulado, alérgenos (gluten, huevo, leche) y trazabilidad', 'Ejercicio con el generador de etiquetas', 1]
  ],

  /* ---------- 6. Plan de saneamiento ---------- */
  usos: [
    { uso: 'Superficies con alimento', ppm: 200 },
    { uso: 'Inmersión de utensilios', ppm: 100 },
    { uso: 'Pisos y lavamanos', ppm: 500 },
    { uso: 'Baños y residuos', ppm: 1000 },
    { uso: 'Otra', ppm: null }
  ],

  calendario: [
    ['Diaria', 'Mesas de trabajo', 'Retirar residuos, lavar, enjuagar y desinfectar al final del día y entre preparaciones'],
    ['Diaria', 'Batidora', 'Desmontar bowl, globo y paleta; lavar y desinfectar; limpiar el cabezal'],
    ['Diaria', 'Horno', 'En frío, retirar migas y derrames de bandejas y piso del horno'],
    ['Diaria', 'Moldes y utensilios', 'Lavar en poceta, desinfectar y secar al aire en escurridor'],
    ['Diaria', 'Pisos y desagües', 'Barrer en húmedo, lavar, desinfectar y limpiar rejillas'],
    ['Diaria', 'Canecas', 'Vaciar, lavar y cambiar bolsa'],
    ['Semanal', 'Horno a fondo', 'Desmontar bandejas y desengrasar interior y puerta'],
    ['Semanal', 'Mesas por debajo', 'Patas, bordes inferiores y parte trasera'],
    ['Semanal', 'Sifones y desagües', 'Desmontar rejillas, cepillar y desinfectar'],
    ['Semanal', 'Estanterías de bodega', 'Retirar insumos, limpiar estibas y revisar plagas'],
    ['Semanal', 'Nevera', 'Vaciar, lavar y desinfectar interior y empaques de la puerta'],
    ['Mensual', 'Paredes y techos', 'Lavado completo con amonio cuaternario'],
    ['Mensual', 'Lámparas y extractor', 'Limpieza de protectores y cambio de filtro'],
    ['Mensual', 'Moldes', 'Revisión y retiro de piezas rayadas u oxidadas'],
    ['Mensual', 'Rotación de desinfectante', 'Cambiar de hipoclorito a amonio cuaternario o al revés'],
    ['Semestral', 'Tanque de agua', 'Lavado y desinfección por empresa especializada, con certificado'],
    ['Semestral', 'Trampa de grasas', 'Mantenimiento completo (además de la limpieza quincenal)'],
    ['Semestral', 'Auditoría interna', 'Lista de verificación completa y plan de acciones correctivas']
  ],

  canecas: {
    blanca: { nombre: 'Blanca', sub: 'Aprovechables' },
    negra:  { nombre: 'Negra',  sub: 'No aprovechables' },
    verde:  { nombre: 'Verde',  sub: 'Orgánicos aprovechables' }
  },

  residuos: [
    { r: 'Cáscaras de huevo', c: 'verde', porque: 'Son orgánicas aprovechables (compostables).' },
    { r: 'Caja de cartón del proveedor', c: 'blanca', porque: 'Cartón limpio y seco, aprovechable. Se retira en recepción para que no entre a la planta.' },
    { r: 'Papel de hornear usado con grasa', c: 'negra', porque: 'Contaminado con grasa, ya no es reciclable.' },
    { r: 'Toalla desechable de secado de manos', c: 'negra', porque: 'Residuo no aprovechable.' },
    { r: 'Restos de masa cruda', c: 'verde', porque: 'Orgánico aprovechable.' },
    { r: 'Tapabocas y guantes usados', c: 'negra', porque: 'No aprovechables; se descartan con la bolsa cerrada.' },
    { r: 'Frasco vacío de esencia de vainilla', c: 'blanca', porque: 'Vidrio limpio, aprovechable.' },
    { r: 'Torta no conforme retirada', c: 'verde', porque: 'Orgánico; se registra en el F14 antes de desecharla.' }
  ],

  plagas: [
    { t: 'Prevenir', texto: 'Anjeos, burletes en puertas, grietas selladas, insumos tapados y sin cartón dentro de la planta.' },
    { t: 'Monitorear', texto: 'Revisión semanal de 13 estaciones (actívalas en el plano) y registro en el F07.', boton: true },
    { t: 'Controlar', texto: 'Empresa externa con concepto sanitario cada 3 meses. Cebos solo afuera; adentro, trampas adhesivas.' }
  ],

  /* ---------- 7. Microbiología ---------- */
  muestras: [
    { id: 'ponque', nombre: 'Ponqué terminado', icono: 'cake', frec: 'Trimestral',
      como: 'Una unidad empacada de un lote, en su empaque original, rotulada y enviada el mismo día.',
      porque: 'Confirma la inocuidad del producto final. Los mohos son la principal causa de deterioro y <i>B. cereus</i> forma esporas que resisten el horneo.',
      cajas: [
        { org: 'Mesófilos aerobios', medio: 'PCA', tipo: 'pca' },
        { org: 'Mohos y levaduras', medio: 'DRBC', tipo: 'drbc' },
        { org: 'Coliformes totales', medio: 'Cromogénico', tipo: 'cromo' },
        { org: '<i>S. aureus</i> coagulasa +', medio: 'Baird-Parker', tipo: 'bp' },
        { org: '<i>Bacillus cereus</i>', medio: 'MYP', tipo: 'myp' }
      ] },
    { id: 'superficies', nombre: 'Superficies', icono: 'surface', frec: 'Mensual, rotando',
      como: 'Hisopado de 100 cm² con plantilla estéril sobre mesas, bowl de batidora y tabla de corte, después de la desinfección.',
      porque: 'Verifica que el programa de limpieza y desinfección es eficaz.',
      cajas: [
        { org: 'Mesófilos aerobios', medio: 'PCA', tipo: 'pca' },
        { org: 'Coliformes totales', medio: 'Cromogénico', tipo: 'cromo' }
      ] },
    { id: 'manos', nombre: 'Manos', icono: 'hand', frec: 'Trimestral, todas',
      como: 'Hisopado o lavado de manos de cada manipuladora durante la jornada, sin aviso previo.',
      porque: 'Verifica la técnica de lavado. <i>S. aureus</i> vive en piel y fosas nasales.',
      cajas: [
        { org: 'Coliformes y <i>E. coli</i>', medio: 'Cromogénico', tipo: 'cromo-ecoli' },
        { org: '<i>S. aureus</i>', medio: 'Baird-Parker', tipo: 'bp' }
      ] },
    { id: 'agua', nombre: 'Agua', icono: 'drop', frec: 'Semestral',
      como: 'Muestra de la llave de producción en frasco estéril con tiosulfato, después de flamear y dejar correr el agua.',
      porque: 'Cumplimiento de la Resolución 2115 de 2007, junto con cloro residual, pH y turbiedad.',
      cajas: [
        { org: 'Coliformes totales y <i>E. coli</i>', medio: 'Membrana en agar cromogénico', tipo: 'membrana' }
      ] },
    { id: 'ambiente', nombre: 'Ambiente', icono: 'air', frec: 'Trimestral',
      como: 'Placas abiertas por sedimentación durante 15 minutos en el área de enfriamiento y en empaque.',
      porque: 'El ponqué queda expuesto al aire mientras se enfría; esporas de mohos en el ambiente lo recontaminan.',
      cajas: [
        { org: 'Mohos y levaduras', medio: 'DRBC', tipo: 'drbc' },
        { org: 'Mesófilos aerobios', medio: 'PCA', tipo: 'pca' }
      ] },
    { id: 'materias', nombre: 'Materias primas', icono: 'box', frec: 'Cada lote',
      como: 'Se exige el certificado de análisis del proveedor para la harina.',
      porque: 'Control desde el origen sin costo de análisis propio.',
      cajas: [] }
  ],

  // Colores de fondo de cada agar
  agar: { pca: '#EADBB8', drbc: '#F2B8C8', cromo: '#F3EBC8', bp: '#C9A25E', myp: '#F0A9B8' },

  controlesPlanta: 'Termómetro calibrado para la nevera y termómetro de horno; kit de cloro residual y pH para el agua; tiras indicadoras para verificar las soluciones de cloro; evaluación sensorial de cada lote antes de empacar.',

  /* ---------- 8. Etiqueta y transporte ---------- */
  etiqueta: {
    ingredientes: 'Harina de trigo fortificada, mantequilla, azúcar, huevo, leche entera, esencia de vainilla, polvo de hornear, sal.',
    alergenos: 'Contiene: trigo (gluten), huevo y leche.',
    conservacion: 'Consérvese en lugar fresco y seco',
    pie: 'Fabricado por ADEX Sweets & Pink, Cúcuta, Norte de Santander. Registro sanitario: en trámite (simulación académica).'
  },

  vehiculo: [
    'Compartimiento de carga limpio, seco y sin olores',
    'Sin químicos, combustibles, herramientas ni animales',
    'Canastillas lavadas, desinfectadas y con tapa',
    'Producto empacado, sellado y rotulado con lote',
    'Producto protegido del sol dentro del vehículo',
    'Leyenda “Transporte de alimentos” visible',
    'Planilla F12 diligenciada con destino y lotes'
  ],

  transporte: 'Empacado y sellado antes de salir, con etiqueta de lote y vencimiento; protegido del sol y del calor (en Cúcuta el calor genera condensación dentro de la bolsa y favorece los mohos); ruta planeada para que no permanezca más de lo necesario en el vehículo; si llega con el empaque roto o húmedo, se devuelve y se registra en el F14.',

  /* ---------- 9. Cierre ---------- */
  resumen: [
    { tag: 'Prevenir', titulo: 'Planta y personal', texto: 'Flujo en un solo sentido, manipuladores sanos, capacitados y con dotación completa.' },
    { tag: 'Controlar', titulo: 'Puntos críticos', texto: 'Recepción, horneo y enfriamiento medidos y registrados en cada lote, con trazabilidad por código de lote.' },
    { tag: 'Verificar', titulo: 'Laboratorio y auditoría', texto: 'Análisis en laboratorio externo, 14 formatos de registro y auditoría interna cada 6 meses. Meta: 90 % de cumplimiento.' }
  ],

  formatos: [
    { cod: 'F01', nombre: 'Recepción de materias primas', frec: 'Cada entrega', resp: 'Auxiliar de despacho',
      ejemplo: {
        cols: ['Fecha', 'Proveedor', 'Insumo', 'Lote / vence', 'Reg. sanitario', 'Empaque', 'Decisión', 'Firma'],
        filas: [
          ['16/10', 'Distribuidora ejemplo', 'Harina de trigo 25 kg', 'L2410 · 03/27', 'Sí', 'Íntegro', '<span class="chip ok">Acepta</span>', ''],
          ['16/10', 'Granja ejemplo', 'Huevo AA × 300', 'Postura 14/10', 'ICA', '3 rotos', '<span class="chip bad">Parcial</span>', '']
        ] } },
    { cod: 'F02', nombre: 'Control de temperatura de neveras', frec: '2 veces al día', resp: 'Jefe de producción' },
    { cod: 'F03', nombre: 'Inspección diaria del manipulador', frec: 'Diaria, al ingreso', resp: 'Jefe de producción' },
    { cod: 'F04', nombre: 'Limpieza y desinfección diaria', frec: 'Diaria', resp: 'Operarias',
      ejemplo: {
        cols: ['Fecha', 'Área / equipo', 'Detergente', 'Desinfectante y ppm', 'Hora', 'Responsable', 'Verificó'],
        filas: [
          ['16/10', 'Mesas de preparación', 'Neutro', 'Hipoclorito 200 ppm', '17:40', 'Operaria 1', '✓'],
          ['16/10', 'Batidora', 'Neutro', 'Hipoclorito 200 ppm', '17:50', 'Operaria 2', '✓'],
          ['16/10', 'Pisos', 'Neutro', 'Amonio cuaternario', '18:10', 'Operaria 1', '✓']
        ] } },
    { cod: 'F05', nombre: 'Limpieza profunda', frec: 'Semanal y mensual', resp: 'Operarias' },
    { cod: 'F06', nombre: 'Preparación de soluciones desinfectantes', frec: 'Cada preparación', resp: 'Operarias' },
    { cod: 'F07', nombre: 'Inspección de plagas y estaciones', frec: 'Semanal', resp: 'Auxiliar de despacho' },
    { cod: 'F08', nombre: 'Entrega de residuos', frec: 'Cada recolección', resp: 'Auxiliar de despacho' },
    { cod: 'F09', nombre: 'Cloro residual y pH del agua', frec: 'Semanal', resp: 'Responsable de calidad' },
    { cod: 'F10', nombre: 'Asistencia y evaluación de capacitaciones', frec: 'Cada sesión', resp: 'Responsable de calidad' },
    { cod: 'F11', nombre: 'Producción por lote', frec: 'Cada lote', resp: 'Jefe de producción',
      ejemplo: {
        cols: ['Lote', 'Unidades', 'Horno °C', 'Tiempo', 'Cocción completa', 'Enfriamiento (h)', 'Empaque (hora)', 'Firma'],
        filas: [
          ['PQ-261016-01', '20', '175', '50 min', '✓ centro seco', '1,5', '12:40', ''],
          ['PQ-261016-02', '20', '175', '50 min', '✓ centro seco', '1,5', '14:10', '']
        ] } },
    { cod: 'F12', nombre: 'Inspección del vehículo y despacho', frec: 'Cada despacho', resp: 'Auxiliar de despacho',
      ejemplo: {
        cols: ['Fecha', 'Lote', 'Destino', 'Vehículo OK', 'Canastillas', 'Hora salida', 'Hora entrega', 'Recibe'],
        filas: [
          ['16/10', 'PQ-261016-01', 'Tienda ejemplo, centro', '✓', '2 tapadas', '15:00', '15:30', '']
        ] } },
    { cod: 'F13', nombre: 'Resultados de laboratorio y acciones correctivas', frec: 'Cada resultado', resp: 'Responsable de calidad' },
    { cod: 'F14', nombre: 'Quejas, devoluciones y retiro de producto', frec: 'Cuando ocurra', resp: 'Gerente' }
  ],

  /* ---------- Material de apoyo ---------- */
  gantt: [
    { act: 'Diagnóstico con lista de verificación', de: 1, a: 1 },
    { act: 'Documentación de programas y formatos', de: 1, a: 3 },
    { act: 'Adecuaciones locativas (anjeos, lavamanos, canecas)', de: 2, a: 4 },
    { act: 'Exámenes médicos y capacitación inicial', de: 2, a: 3 },
    { act: 'Implementación de programas y registros', de: 4, a: 8 },
    { act: 'Primer muestreo microbiológico', de: 6, a: 6 },
    { act: 'Auditoría interna y acciones correctivas', de: 8, a: 8 }
  ],

  checklist: [
    { grupo: 'Edificación e instalaciones', items: [
      ['Planta separada de vivienda y focos de contaminación', 'Art. 6'],
      ['Pisos, paredes y techos lisos, lavables y en buen estado', 'Art. 7'],
      ['Ventanas con anjeo y desagües con rejilla', 'Arts. 6 y 7'],
      ['Baño y vestier sin comunicación directa con producción', 'Art. 6'],
      ['Lavamanos de accionamiento no manual con jabón y toallas', 'Art. 6']
    ] },
    { grupo: 'Equipos y utensilios', items: [
      ['Superficies en contacto con alimento de acero inoxidable o material sanitario', 'Art. 8'],
      ['Equipos separados de la pared y en buen estado', 'Art. 8'],
      ['Termómetros funcionando en neveras', 'Art. 8']
    ] },
    { grupo: 'Personal manipulador', items: [
      ['Certificado médico vigente de todas las personas', 'Art. 11'],
      ['Plan de capacitación con mínimo 10 horas al año', 'Arts. 12 y 13'],
      ['Uniforme completo y limpio, sin joyas, uñas cortas', 'Art. 14']
    ] },
    { grupo: 'Materias primas y proceso', items: [
      ['Recepción inspeccionada y registrada en F01', 'Art. 16'],
      ['Almacenamiento PEPS, sobre estibas y rotulado', 'Art. 28'],
      ['Registro de cada lote en F11', 'Cap. V']
    ] },
    { grupo: 'Plan de saneamiento', items: [
      ['Programa de limpieza y desinfección con registros', 'Art. 26'],
      ['Programa de residuos con canecas por colores', 'Art. 26'],
      ['Programa de plagas y certificado de fumigación', 'Art. 26'],
      ['Programa de agua potable y lavado de tanque', 'Art. 26']
    ] },
    { grupo: 'Calidad, rotulado y transporte', items: [
      ['Análisis microbiológicos con laboratorio externo archivados', 'Cap. V'],
      ['Producto rotulado con lote y vencimiento', 'Res. 5109'],
      ['Vehículo limpio, exclusivo y con canastillas tapadas', 'Art. 29']
    ] }
  ],

  preguntas: [
    ['¿Por qué el flujo de la planta es unidireccional?', 'Para que el producto avance de la zona sucia a la limpia sin regresar ni cruzarse con residuos o con personal que viene de la calle. Así se evita la contaminación cruzada (Res. 2674, Arts. 6 y 7).'],
    ['¿Qué pasa si una operaria llega con diarrea?', 'No manipula alimentos. Se registra en el F03 y se reubica en tareas sin contacto con el producto hasta que se recupere (Art. 11). La empresa debe vigilar el estado de salud al ingreso y a diario.'],
    ['¿Cuántas horas de capacitación exigen y quién las da?', 'Mínimo 10 horas al año en un plan continuo y permanente (Arts. 12 y 13). Las dicta la responsable de calidad u otra persona o entidad idónea, con metodología, cronograma y evaluación de efectividad.'],
    ['¿Cuál es la diferencia entre limpiar y desinfectar?', 'Limpiar retira la suciedad visible con agua y detergente. Desinfectar reduce los microorganismos a niveles seguros con un desinfectante. No se puede desinfectar una superficie sucia porque la materia orgánica inactiva el cloro.'],
    ['¿Cómo saben que la limpieza sí funciona?', 'Con inspección visual diaria (F04) y con frotis mensual de superficies analizado en el laboratorio externo (mesófilos y coliformes). Si sale no conforme, se refuerza el procedimiento y se repite el muestreo.'],
    ['¿Por qué rotan los desinfectantes?', 'Para evitar que los microorganismos del ambiente se adapten a un solo principio activo. Cada mes se alterna entre hipoclorito de sodio y amonio cuaternario.'],
    ['¿Dónde se analizan los microorganismos?', 'En un laboratorio externo acreditado por el ONAC (NTC-ISO/IEC 17025) o autorizado por el INVIMA. En la planta solo se toman las muestras y se envían refrigeradas con cadena de custodia.'],
    ['¿Por qué los cebos rodenticidas van solo afuera?', 'Porque son sustancias tóxicas: dentro de la planta podrían contaminar el producto o ser arrastrados por los roedores. Adentro solo se usan trampas adhesivas y lámparas con lámina adhesiva.'],
    ['¿Qué hacen si un resultado de laboratorio sale no conforme?', 'Se retiene o retira el lote con el código de trazabilidad, se investiga la causa, se aplica la acción correctiva, se repite el muestreo y todo se registra en el F13.'],
    ['¿Cuál es el principal peligro del ponqué?', 'La recontaminación con mohos después del horneo, en el enfriamiento y el empaque. Por eso el enfriamiento es un punto de control: área cerrada, producto cubierto y empaque solo cuando está frío para evitar condensación.'],
    ['¿Por qué no se lavan los huevos al recibirlos?', 'Porque el lavado retira la cutícula protectora y abre los poros de la cáscara, lo que facilita la entrada de <i>Salmonella</i>. Se guardan limpios en seco y se desinfectan justo antes de usarlos.'],
    ['¿Por qué el ponqué dura 5 días sin nevera?', 'Porque tiene baja actividad de agua y se hornea completo. Aun así, la vida útil debe sustentarse con pruebas de estabilidad y se respeta la fecha de la etiqueta.']
  ],

  referencias: 'Resolución 2674 de 2013, Resolución 2115 de 2007, Resolución 683 de 2012, Resolución 5109 de 2005, Resolución 2184 de 2019 (MinSalud, MinAmbiente). ADEX Sweets & Pink · Simulación académica · Control e Inocuidad Alimentaria, UDES Cúcuta, 2026.'
};
