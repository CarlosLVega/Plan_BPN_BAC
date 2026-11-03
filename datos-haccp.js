/* =========================================================================
   ADEX Sweets & Pink · Plan HACCP del ponqué de vainilla
   Todo el contenido del panel HACCP (derecha) vive aquí. haccp.js lo dibuja.
   Para cambiar un texto, edítalo en este archivo.
   ========================================================================= */
window.HCFG = {
  /* ---------- Cronómetro de exposición (minutos) ---------- */
  agenda: [
    { id: 'h-objetivos',    nombre: 'Objetivos',     desde: 0,  hasta: 1 },
    { id: 'h-marco',        nombre: 'Marco',         desde: 1,  hasta: 3 },
    { id: 'h-pasos',        nombre: '12 pasos',      desde: 3,  hasta: 5 },
    { id: 'h-flujo',        nombre: 'Flujo',         desde: 5,  hasta: 6 },
    { id: 'h-peligros',     nombre: 'Peligros',      desde: 6,  hasta: 8 },
    { id: 'h-pcc',          nombre: 'PCC',           desde: 8,  hasta: 10 },
    { id: 'h-limites',      nombre: 'Límites',       desde: 10, hasta: 12 },
    { id: 'h-monitoreo',    nombre: 'Monitoreo',     desde: 12, hasta: 13 },
    { id: 'h-acciones',     nombre: 'Acciones',      desde: 13, hasta: 14 },
    { id: 'h-verificacion', nombre: 'Verificación',  desde: 14, hasta: 16 },
    { id: 'h-registros',    nombre: 'Registros',     desde: 16, hasta: 17 },
    { id: 'h-matriz',       nombre: 'Matriz',        desde: 17, hasta: 19 },
    { id: 'h-cierre',       nombre: 'Cierre',        desde: 19, hasta: 20 }
  ],

  /* ---------- Portada ---------- */
  integrantes: ['Adarut Villamizar', 'Erika Bolívar', 'María Flores', 'Ximena Ramírez'],
  indicadores: [
    { n: 12, sufijo: '', texto: 'pasos del Codex Alimentarius' },
    { n: 7,  sufijo: '', texto: 'principios del sistema HACCP' },
    { n: 4,  sufijo: '', texto: 'puntos críticos de control en 11 etapas' },
    { n: 6,  sufijo: '', texto: 'formatos nuevos (F15 a F20)' }
  ],

  /* ---------- 01 · Objetivos ---------- */
  vacio: {
    bpm: 'Ya garantiza una planta higiénica: flujo de zona sucia a limpia, personal capacitado, recepción con criterios, saneamiento, laboratorio externo, rotulado, transporte y 14 formatos (F01 a F14).',
    falta: 'Por sí solo no identifica en qué etapas un error puede convertir el ponqué en un alimento peligroso, ni dice qué hacer exactamente cuando eso ocurre.',
    haccp: 'Aplica los 12 pasos del Codex a la misma línea. Para cada PCC define lo que no puede faltar: límite crítico, monitoreo y acción correctiva, con verificación y registros para demostrarlo ante la Secretaría de Salud o el INVIMA.'
  },
  objetivoGeneral: 'Aplicar los 12 pasos y los 7 principios del sistema HACCP a la línea de ponqué de vainilla de ADEX Sweets & Pink, integrándolos con el plan BPM existente, para asegurar que cada lote salga inocuo y con calidad.',
  objetivos: [
    { t: 'Conformar un equipo HACCP multidisciplinario con conocimiento del producto y del proceso.', ir: 'h-pasos', donde: 'Paso 1' },
    { t: 'Describir el producto, su uso previsto y la población consumidora, y verificar en planta el diagrama de flujo.', ir: 'h-flujo', donde: 'Pasos 2 a 5' },
    { t: 'Identificar los peligros biológicos, químicos y físicos de cada una de las 11 etapas y determinar cuáles son significativos.', ir: 'h-peligros', donde: 'Principio 1' },
    { t: 'Determinar los PCC con el árbol de decisiones y establecer para cada uno límites críticos, monitoreo y acciones correctivas viables.', ir: 'h-pcc', donde: 'Principios 2 a 5' },
    { t: 'Definir las actividades de verificación y el sistema de documentación y registros del plan.', ir: 'h-verificacion', donde: 'Principios 6 y 7' }
  ],

  /* ---------- 02 · Marco conceptual ---------- */
  pprIntro: 'Los programas prerrequisito (PPR) son las condiciones básicas de higiene que deben existir antes del HACCP. El Codex los llama Buenas Prácticas de Higiene; en Colombia son las BPM de la Res. 2674 de 2013 y el plan de saneamiento de su artículo 26.',
  ppr: [
    { p: 'Instalaciones y flujo', ic: 'route', reg: 'Plano', como: 'Planta de ~80 m², flujo en un solo sentido de zona sucia a limpia, áreas separadas (recepción, bodega, refrigeración, horneo, enfriamiento cerrado, empaque, residuos, vestier).' },
    { p: 'Proveedores y recepción', ic: 'box', reg: 'F01, F02', como: 'Proveedores aprobados, criterios de aceptación y rechazo por insumo, PEPS y estibas a 15 cm.' },
    { p: 'Personal manipulador', ic: 'hand', reg: 'F03, F10', como: 'Certificado médico anual, revisión diaria, dotación completa, lavado de manos, 10 h/año de capacitación.' },
    { p: 'Limpieza y desinfección', ic: 'drop', reg: 'F04, F05, F06', como: 'Procedimiento de 6 pasos, hipoclorito / amonio cuaternario rotados cada mes, limpieza diaria y profunda.' },
    { p: 'Control de plagas', ic: 'radar', reg: 'F07', como: '13 estaciones, empresa externa cada 3 meses, trampas adhesivas internas.' },
    { p: 'Residuos sólidos', ic: 'bin', reg: 'F08', como: 'Canecas por colores (Res. 2184 de 2019), retiro diario por salida propia.' },
    { p: 'Agua potable', ic: 'drop', reg: 'F09', como: 'Tanque lavado cada 6 meses, cloro residual y pH semanal (Res. 2115 de 2007).' },
    { p: 'Análisis de laboratorio', ic: 'flask', reg: 'F13', como: 'Laboratorio externo acreditado ONAC o autorizado por el INVIMA.' },
    { p: 'Transporte y trazabilidad', ic: 'truck', reg: 'F12, F14', como: 'Vehículo inspeccionado antes de cada despacho, lote en cada unidad, retiro de producto.' }
  ],
  sinPpr: 'Sin prerrequisitos, el HACCP se llenaría de «PCC» que en realidad son fallas de higiene general. Con ellos, el HACCP puede concentrarse solo en los peligros que necesitan un control específico.',

  historia: [
    { anio: '1959', t: 'Comida para el espacio', texto: 'A finales de los 50 y comienzos de los 60, Pillsbury, la NASA y los laboratorios del Ejército de EE. UU. en Natick debían garantizar que los alimentos de los astronautas no causaran enfermedad. Analizar cada unidad era imposible (se destruía el producto), así que cambiaron el enfoque: controlar el proceso en los puntos donde se puede perder la inocuidad, en lugar de inspeccionar al final.' },
    { anio: '1971', t: 'Presentación pública', texto: 'El sistema se presenta en la Conferencia Nacional de Protección de Alimentos de Estados Unidos.' },
    { anio: '1985', t: 'Recomendación científica', texto: 'La Academia Nacional de Ciencias de EE. UU. recomienda su uso.' },
    { anio: '1989–92', t: 'Los siete principios', texto: 'El Comité Asesor Nacional sobre Criterios Microbiológicos para los Alimentos (NACMCF) formula los siete principios del HACCP.' },
    { anio: '1993', t: 'Codex Alimentarius', texto: 'La Comisión del Codex adopta las directrices para su aplicación, que hoy hacen parte de los Principios Generales de Higiene de los Alimentos (CXC 1-1969).' },
    { anio: '2002', t: 'Colombia', texto: 'El Decreto 60 de 2002 promueve la aplicación del HACCP en las fábricas de alimentos.' },
    { anio: '2013', t: 'Los prerrequisitos', texto: 'La Resolución 2674 de 2013 fija las BPM que funcionan como prerrequisitos del HACCP.' },
    { anio: '2020', t: 'Revisión del Codex', texto: 'Se publica la revisión 2020 de los Principios Generales de Higiene de los Alimentos (CXC 1-1969), referencia de este plan.' }
  ],

  calidad: {
    inocuidad: 'La garantía de que el alimento no causará daño al consumidor cuando se prepare o consuma según su uso previsto.',
    calidad: 'El conjunto de características que hacen que el producto satisfaga al cliente.',
    regla: 'Un ponqué puede ser de mala calidad y aun así inocuo (seco, poco esponjoso), pero nunca puede ser «de buena calidad» si no es inocuo.',
    tabla: [
      ['Pregunta que responde', '¿El ponqué cumple lo que espera el cliente?', '¿El ponqué puede enfermar o lesionar a quien lo come?'],
      ['Ejemplos en ADEX', 'Miga húmeda y esponjosa, color dorado, sabor a vainilla, peso de 454 g o 120 g', 'Sin Salmonella, sin mohos, sin fragmentos extraños, alérgenos declarados en la etiqueta'],
      ['¿Es negociable?', 'Sí: depende del mercado y del precio', 'No: es una obligación legal y ética'],
      ['Herramienta principal', 'Fichas técnicas, controles de proceso, satisfacción del cliente', 'BPM + HACCP + criterios microbiológicos (Res. 1407 de 2022)']
    ],
    juego: [
      { t: 'Miga húmeda y esponjosa', c: 'calidad', porque: 'Es una característica que busca el cliente; un ponqué seco sigue siendo inocuo.' },
      { t: 'Sin Salmonella', c: 'inocuidad', porque: 'Un patógeno puede enfermar a quien lo consume: no es negociable.' },
      { t: 'Color dorado', c: 'calidad', porque: 'Es un atributo sensorial que satisface al cliente.' },
      { t: 'Alérgenos declarados en la etiqueta', c: 'inocuidad', porque: 'Una etiqueta sin alérgenos puede causar una reacción grave en una persona alérgica.' },
      { t: 'Sabor a vainilla', c: 'calidad', porque: 'Es lo que el cliente espera del producto, no lo que lo protege.' },
      { t: 'Sin fragmentos extraños', c: 'inocuidad', porque: 'Insectos, piedras o plástico pueden lesionar al consumidor.' },
      { t: 'Peso de 454 g o 120 g', c: 'calidad', porque: 'Es lo que se le promete al cliente en la presentación.' },
      { t: 'Sin mohos', c: 'inocuidad', porque: 'La recontaminación por mohos es el principal peligro después del horneo.' }
    ]
  },

  rutaIntro: 'Un sistema de gestión de la inocuidad (SGIA) es el conjunto de políticas, procedimientos, controles, auditorías y capacitaciones que asegura que cada vez que se produce un alimento este no sea inseguro. El HACCP es su núcleo técnico; el SGIA es más amplio.',
  ruta: [
    { etapa: 'Prerrequisitos (BPM)', que: 'Res. 2674 de 2013, plan de saneamiento, capacitación, concepto sanitario favorable.', estado: 'Implementado (plan BPM, semana 12)', tipo: 'ok' },
    { etapa: 'HACCP', que: '12 pasos y 7 principios sobre los programas prerrequisito.', estado: 'En implementación (este plan)', tipo: 'norm', aqui: true },
    { etapa: 'ISO 22000:2018', que: 'Política, objetivos, revisión por la dirección, comunicación en la cadena, mejora continua.', estado: 'Meta a mediano plazo', tipo: 'warn' },
    { etapa: 'Esquema GFSI (p. ej., FSSC 22000)', que: 'Certificación por tercero aceptada por grandes compradores.', estado: 'Visión 2030, si se distribuye a cadenas', tipo: '' }
  ],

  normas: [
    { id: 'fsma', kicker: 'Estados Unidos · FDA · 2011', titulo: 'Ley FSMA', sub: 'Food Safety Modernization Act',
      texto: 'Su cambio central es pasar de reaccionar ante los brotes a prevenirlos. Exige un plan de inocuidad con análisis de peligros y controles preventivos basados en riesgo, elaborado por una persona calificada (PCQI).',
      claves: ['Controles de alérgenos', 'Controles de saneamiento', 'Cadena de suministro', 'Proveedores extranjeros', 'Transporte sanitario', 'Adulteración intencional', 'Trazabilidad'],
      adex: 'Hoy ADEX vende solo en Cúcuta, así que no le aplica directamente; si exportara a EE. UU. debería registrarse ante la FDA y cumplirla. Este plan ya incorpora varias de sus ideas: alérgenos como PCC, aprobación de proveedores e inspección del vehículo antes del despacho.' },
    { id: 'gfsi', kicker: 'Internacional · The Consumer Goods Forum · 2000', titulo: 'GFSI', sub: 'Global Food Safety Initiative',
      texto: 'No certifica empresas: establece requisitos de referencia (benchmarking) y reconoce los esquemas que los cumplen. Su lema: «certificado una vez, aceptado en todas partes».',
      claves: ['FSSC 22000', 'BRCGS', 'IFS', 'SQF'],
      adex: 'Como microempresa no está obligada a certificarse, pero si cumple su visión de distribuir en tiendas de la región y luego en cadenas, estas suelen exigir un esquema reconocido por la GFSI. Tener BPM y HACCP bien documentados es el primer escalón.' }
  ],

  /* ---------- 03 · Los 12 pasos ---------- */
  pasos: [
    { n: 1,  nombre: 'Conformar el equipo HACCP', tipo: 'Preliminar', ir: 'equipo' },
    { n: 2,  nombre: 'Describir el producto', tipo: 'Preliminar', ir: 'producto' },
    { n: 3,  nombre: 'Identificar el uso previsto y los consumidores', tipo: 'Preliminar', ir: 'uso' },
    { n: 4,  nombre: 'Elaborar el diagrama de flujo', tipo: 'Preliminar', ir: 'h-flujo' },
    { n: 5,  nombre: 'Confirmar el diagrama en planta (in situ)', tipo: 'Preliminar', ir: 'h-insitu' },
    { n: 6,  nombre: 'Realizar el análisis de peligros', tipo: 'Principio 1', ir: 'h-peligros' },
    { n: 7,  nombre: 'Determinar los puntos críticos de control', tipo: 'Principio 2', ir: 'h-pcc' },
    { n: 8,  nombre: 'Establecer los límites críticos', tipo: 'Principio 3', ir: 'h-limites' },
    { n: 9,  nombre: 'Establecer el sistema de monitoreo', tipo: 'Principio 4', ir: 'h-monitoreo' },
    { n: 10, nombre: 'Establecer las acciones correctivas', tipo: 'Principio 5', ir: 'h-acciones' },
    { n: 11, nombre: 'Establecer la verificación y validación', tipo: 'Principio 6', ir: 'h-verificacion' },
    { n: 12, nombre: 'Establecer la documentación y los registros', tipo: 'Principio 7', ir: 'h-registros' }
  ],

  equipo: [
    { id: 'calidad', nivel: 0, cargo: 'Responsable de calidad y BPM', rol: 'Coordinadora',
      formacion: 'Bacterióloga, asesoría externa. Microbiología de alimentos, ETA, toma de muestras e interpretación de resultados.',
      funciones: 'Coordina el equipo, elabora y actualiza el plan, realiza el análisis de peligros, revisa registros cada semana, dirige la verificación y la auditoría interna, lidera la capacitación HACCP.' },
    { id: 'gerente', nivel: 1, cargo: 'Gerente propietaria', rol: 'Dirección',
      formacion: 'Conoce el negocio, los proveedores y los clientes.',
      funciones: 'Aprueba el plan y los recursos (termómetros, tamiz de repuesto, calibraciones), decide retiros de producto y compromete a la dirección.' },
    { id: 'jefe', nivel: 1, cargo: 'Jefe de producción', rol: 'Horneo y tamizado',
      formacion: 'Formulación, horneo y enfriamiento; conoce cada etapa y equipo.',
      funciones: 'Describe el proceso real, valida límites operativos, monitorea los PCC de horneo y tamizado, aplica acciones correctivas.' },
    { id: 'operaria', nivel: 1, cargo: 'Operaria de producción', rol: 'Representante',
      formacion: 'Experiencia práctica en preparación, enfriamiento y empaque.',
      funciones: 'Aporta cómo se hacen las tareas en la práctica, monitorea enfriamiento y rotulado.' },
    { id: 'auxiliar', nivel: 1, cargo: 'Auxiliar de despacho', rol: 'Entrada y salida',
      formacion: 'Recepción de materias primas, residuos, plagas y transporte.',
      funciones: 'Aporta los peligros de entrada y salida del producto y verifica recepción y despacho.' },
    { id: 'externo', nivel: 2, cargo: 'Ingeniero(a) de alimentos', rol: 'Apoyo externo',
      formacion: 'Procesos térmicos y vida útil.',
      funciones: 'Asesora la validación del horneo (mapeo de temperatura del horno) y del estudio de vida útil.' }
  ],
  equipoReglas: ['Capacitación inicial de 2 h', 'Reunión mensual', 'Reunión extraordinaria ante cambios o quejas', 'Acta en el F20'],
  equipoNota: 'Debe conocer de verdad el producto y el proceso: quien no conoce el ponqué no sabe si un área está adecuada o si un PCC está bien planteado. Se reúne de forma extraordinaria cuando cambie la receta, un proveedor, un equipo o se presente una queja o un resultado de laboratorio no conforme.',

  producto: [
    ['Nombre del producto', 'Ponqué de vainilla horneado, tipo pound cake'],
    ['Presentaciones', 'Entero de 1 lb (454 g) y porción de 120 g'],
    ['Ingredientes', 'Harina de trigo fortificada, mantequilla, azúcar, huevo, leche, esencia de vainilla, polvo de hornear y sal'],
    ['Aditivos y conservantes', 'Polvo de hornear (leudante). No se usan conservantes: la estabilidad depende de la baja actividad de agua, el horneo completo, el enfriamiento cerrado y el empaque sellado'],
    ['Fisicoquímicas esperadas*', 'pH aproximado 6,8 a 7,8 · aw aproximada 0,80 a 0,88 · humedad aproximada 20 a 25 %'],
    ['Sensoriales', 'Corteza dorada, miga amarilla clara, compacta y húmeda, olor y sabor a vainilla y mantequilla'],
    ['Tratamiento que asegura la inocuidad', 'Horneo a 170-180 °C por 45-55 minutos, con centro ≥ 71 °C (PCC 2)'],
    ['Empaque', 'Bolsa plástica de grado alimentario sellada (Res. 683 de 2012); el entero se despacha en canastilla tapada'],
    ['Rotulado', 'Res. 5109 de 2005: nombre, ingredientes, alérgenos (gluten, huevo, leche), contenido neto, lote, vencimiento, conservación, fabricante'],
    ['Almacenamiento', 'Temperatura ambiente, lugar fresco y seco, protegido del sol y de la humedad'],
    ['Vida útil', '5 días empacado (a confirmar con el estudio de vida útil)'],
    ['Criterios microbiológicos', 'Grupo 8 de la Res. 1407 de 2022: mesófilos aerobios, mohos y levaduras, coliformes, S. aureus coagulasa positiva y B. cereus'],
    ['Distribución', 'Punto propio, domicilios y tiendas del barrio, en vehículo inspeccionado']
  ],
  productoNota: '*Valores de referencia para este tipo de producto; se confirman con análisis fisicoquímico en el laboratorio externo durante la validación.',
  phNota: {
    titulo: '¿Por qué importa el pH aunque ADEX no use conservante?',
    texto: 'Un conservante no sirve para cualquier alimento: primero hay que saber qué microorganismo crece y cuál es el pH, porque la eficacia depende de él. El ponqué tiene un pH cercano a la neutralidad por el polvo de hornear; a ese pH el sorbato de potasio pierde buena parte de su efecto, porque actúa mejor en medios ácidos. Si ADEX quisiera alargar la vida útil, debería evaluar un conservante para panadería adecuado a ese pH (por ejemplo, propionato de calcio) y volver a validar la vida útil.',
    mientras: 'Mientras tanto, los mohos se controlan con la baja aw, el horneo completo, el enfriamiento en área cerrada (PCC 3) y el empaque sellado con fecha de vencimiento (PCC 4).'
  },

  uso: [
    { ic: 'cake', t: 'Forma de consumo', tag: 'Listo para consumir', texto: 'Listo para el consumo, sin ningún tratamiento posterior (no se recalienta). El entero se corta en casa; la porción se consume directamente (merienda, lonchera, acompañante de bebidas).' },
    { ic: 'users', t: 'Población objetivo', tag: 'Público general', texto: 'Público general: niños, jóvenes, adultos, adultos mayores y gestantes.' },
    { ic: 'shield', t: 'Grupos vulnerables', tag: 'Peligro microbiológico', tipo: 'bad', texto: 'Niños pequeños, gestantes, adultos mayores e inmunocomprometidos: una Salmonella que sobreviva al horneo les causaría un cuadro más grave. Por eso el horneo es PCC y su límite tiene margen de seguridad.' },
    { ic: 'alert', t: 'Personas con alergias', tag: 'Gluten · huevo · leche', tipo: 'bad', texto: 'No apto para personas alérgicas al gluten (trigo), al huevo o a la leche. Este peligro se controla con el rotulado (PCC 4).' },
    { ic: 'heart', t: 'Diabetes, obesidad o enfermedad cardiovascular', tag: 'Consumo moderado', tipo: 'warn', texto: 'Alto en azúcar y en grasa saturada (mantequilla). No se dirige a esta población ni se promociona como saludable. Para la venta empacada en tiendas se debe revisar si aplica el etiquetado frontal de advertencia (Res. 810 de 2021 y Res. 2492 de 2022).' },
    { ic: 'baby', t: 'Lactantes', tag: 'Menores de 2 años', tipo: 'warn', texto: 'No está dirigido a menores de 2 años, a quienes no se recomienda ofrecer alimentos con azúcar añadido.' },
    { ic: 'clock', t: 'Uso indebido previsible', tag: 'Vencido o húmedo', tipo: 'warn', texto: 'Consumirlo después de la fecha de vencimiento o guardarlo en lugar húmedo: se previene con la fecha de vencimiento y las condiciones de conservación en la etiqueta.' }
  ],

  /* ---------- 04 · Diagrama de flujo (paso 4) y verificación in situ (paso 5) ---------- */
  flujo: [
    { n: 1,  etapa: 'Recepción de materias primas', det: 'Harina, azúcar, mantequilla, huevos, leche, esencia, polvo de hornear · inspección F01', salida: 'Rechazo de insumos no conformes' },
    { n: 2,  etapa: 'Almacenamiento', det: 'Secos en bodega sobre estibas (PEPS) · huevos, mantequilla y leche en nevera 0-4 °C (F02)' },
    { n: 3,  etapa: 'Alistamiento y pesaje', det: 'Pesaje según fórmula estándar · desinfección de huevos', salida: 'Cáscaras → residuos orgánicos' },
    { n: 4,  etapa: 'Cremado de mantequilla y azúcar', det: 'Batidora industrial hasta mezcla clara y aireada' },
    { n: 5,  etapa: 'Incorporación de huevos y vainilla', det: 'Huevos quebrados aparte, uno a uno' },
    { n: 6,  etapa: 'Tamizado y adición de secos', det: 'Harina, polvo de hornear y sal tamizados, alternados con la leche', pcc: 1, salida: 'Residuos del tamiz → revisión' },
    { n: 7,  etapa: 'Moldeado', det: 'Moldes engrasados y enharinados' },
    { n: 8,  etapa: 'Horneo', det: '170-180 °C · 45-55 min · centro ≥ 71 °C (F15)', pcc: 2 },
    { n: 9,  etapa: 'Enfriamiento', det: 'En rejilla, cubierto, en área cerrada · ≤ 30 °C y ≤ 3 h antes de empacar (F15)', pcc: 3 },
    { n: 10, etapa: 'Desmolde, porcionado, empaque y rotulado', det: 'Utensilios exclusivos desinfectados · bolsa sellada · etiqueta con alérgenos, lote y vencimiento (F15)', pcc: 4, salida: 'Unidades no conformes → F14' },
    { n: 11, etapa: 'Almacenamiento y despacho', det: 'Temperatura ambiente, PEPS, canastilla tapada, vehículo inspeccionado (F12)' }
  ],
  insituIntro: 'El equipo HACCP recorre la planta durante una jornada real y comprueba que cada etapa ocurre en el área y en el orden del plano. Es lo primero que revisa un evaluador. Se registra en el F18 y se repite cada año o ante cambios.',
  insitu: [
    ['1. Recepción', 'Recepción (puerta de proveedores)', 'Mesa de inspección, báscula y termómetro presentes'],
    ['2. Almacenamiento', 'Bodega seca y Refrigeración', 'Estibas a 15 cm, nevera con termómetro'],
    ['3. Alistamiento y pesaje', 'Alistamiento', 'Punto de desinfección de huevos separado de la mesa de preparación'],
    ['4-7. Cremado, huevos, tamizado, moldeado', 'Preparación', 'Tamiz de malla fina y tamiz de repuesto en la mesa de preparación'],
    ['8. Horneo', 'Horneo', 'Termómetro de horno y termómetro de punzón disponibles'],
    ['9. Enfriamiento', 'Enfriamiento (área cerrada)', 'Rejillas, cubiertas, sin corrientes de aire exteriores'],
    ['10. Desmolde, porcionado, empaque, rotulado', 'Terminado → Empaque y rotulado', 'Dos áreas contiguas; el producto avanza sin regresar a zonas sucias'],
    ['11. Almacenamiento y despacho', 'Despacho', 'Canastillas tapadas, puerta independiente al vehículo']
  ],

  /* ---------- 05 · Principio 1 · Análisis de peligros ---------- */
  peligrosIntro: 'Peligros biológicos (B), químicos (Q) y físicos (F) de cada etapa, evaluados con una matriz de probabilidad × severidad. Solo los significativos (puntaje ≥ 4) pasan al árbol de decisiones; los demás quedan controlados por los prerrequisitos.',
  severidad: {
    A: 'Alta: enfermedad grave, hospitalización o muerte (p. ej., salmonelosis, anafilaxia)',
    M: 'Media: enfermedad o lesión leve a moderada',
    B: 'Baja: efecto mínimo'
  },
  peligros: [
    { etapa: 'Recepción', items: [
      { t: 'B', peligro: 'Salmonella spp. en cáscara de huevo (materia fecal); mohos en harina húmeda', p: 'M', s: 'A', just: 'Fuente frecuente de Salmonella en pastelería', control: 'Proveedores aprobados, criterios de aceptación y rechazo, F01' },
      { t: 'Q', peligro: 'Micotoxinas en harina mal almacenada; insumos vencidos o sin registro sanitario', p: 'B', s: 'A', just: 'Proveedores con registro sanitario; harina húmeda se rechaza', control: 'PPR: aprobación de proveedores, F01' },
      { t: 'F', peligro: 'Insectos, piedras, hilos o plástico en la harina', p: 'M', s: 'M', just: 'Pueden llegar en bultos de harina', control: 'Inspección en recepción; se elimina en el tamizado' }
    ]},
    { etapa: 'Almacenamiento', items: [
      { t: 'B', peligro: 'Mohos por humedad; multiplicación de Salmonella si se rompe la cadena de frío de los huevos; plagas', p: 'B', s: 'M', just: 'Bodega seca, nevera 0-4 °C controlada 2 veces al día', control: 'PPR: PEPS, estibas, F02, control de plagas F07' },
      { t: 'Q', peligro: 'Contacto con productos de aseo', p: 'B', s: 'A', just: 'Químicos en cuarto aparte con llave', control: 'PPR: almacenamiento separado de químicos' },
      { t: 'F', peligro: 'Polvo, restos de plagas', p: 'B', s: 'M', just: 'Recipientes con tapa', control: 'PPR: limpieza y control de plagas' }
    ]},
    { etapa: 'Alistamiento y pesaje', items: [
      { t: 'B', peligro: 'Contaminación cruzada con Salmonella desde la cáscara del huevo', p: 'M', s: 'A', just: 'La cáscara contamina manos, mesa y masa', control: 'Desinfección de huevos en punto aparte; se elimina en el horneo' },
      { t: 'Q', peligro: 'Exceso de polvo de hornear', p: 'B', s: 'B', just: 'Fórmula estándar y báscula verificada', control: 'PPR: fórmula estándar' },
      { t: 'F', peligro: 'Fragmentos de cáscara', p: 'M', s: 'B', just: 'Fragmentos pequeños de baja severidad', control: 'Quebrar cada huevo en recipiente aparte' }
    ]},
    { etapa: 'Cremado', items: [
      { t: 'B', peligro: 'S. aureus desde manos o utensilios mal lavados', p: 'B', s: 'M', just: 'Etapa corta, sin tiempo para que crezca; el horneo destruye células vegetativas', control: 'PPR: lavado de manos, utensilios desinfectados' },
      { t: 'Q', peligro: 'Residuos de detergente o desinfectante en el bowl', p: 'B', s: 'M', just: 'Enjuague como paso obligatorio', control: 'PPR: procedimiento de limpieza F04' },
      { t: 'F', peligro: 'Piezas sueltas o desgaste metálico de la batidora', p: 'B', s: 'A', just: 'Equipo revisado antes de usar', control: 'PPR: mantenimiento preventivo' }
    ]},
    { etapa: 'Incorporación de huevos y vainilla', items: [
      { t: 'B', peligro: 'Salmonella del huevo crudo hacia la masa', p: 'M', s: 'A', just: 'La masa cruda contiene huevo', control: 'La masa cruda no se prueba; se elimina en el horneo' },
      { t: 'Q', peligro: 'Esencia no apta para alimentos o reenvasada', p: 'B', s: 'M', just: 'Se rechaza en recepción', control: 'PPR: F01' },
      { t: 'F', peligro: 'Cáscaras', p: 'M', s: 'B', just: 'Igual que en la etapa 3', control: 'Huevo quebrado aparte' }
    ]},
    { etapa: 'Tamizado y adición de secos', items: [
      { t: 'B', peligro: 'Esporas de Bacillus cereus propias de la harina', p: 'M', s: 'M', just: 'Las esporas resisten el horneo', control: 'Baja aw del producto impide su multiplicación; vida útil corta; verificación de laboratorio' },
      { t: 'F', peligro: 'Insectos, hilos del empaque, piedras, plástico o metal en los secos', p: 'M', s: 'M', just: 'Única etapa que retira materia extraña de la harina', control: 'Tamizado obligatorio con malla íntegra (PCC 1)' }
    ]},
    { etapa: 'Moldeado', items: [
      { t: 'B', peligro: 'Moldes mal lavados', p: 'B', s: 'M', just: 'El horneo posterior elimina la carga', control: 'PPR: lavado de moldes' },
      { t: 'Q', peligro: 'Grasa rancia como desmoldante', p: 'B', s: 'B', just: 'Desmoldante con fecha vigente', control: 'PPR: rotación PEPS' },
      { t: 'F', peligro: 'Restos de papel o pintura de moldes viejos', p: 'B', s: 'M', just: 'Moldes en buen estado', control: 'PPR: reemplazo de moldes deteriorados' }
    ]},
    { etapa: 'Horneo', items: [
      { t: 'B', peligro: 'Supervivencia de Salmonella y otros patógenos por cocción incompleta', p: 'M', s: 'A', just: 'Es la única etapa que elimina los patógenos vegetativos', control: 'Temperatura y tiempo controlados (PCC 2)' },
      { t: 'Q', peligro: 'Formación de acrilamida por sobrecocción', p: 'B', s: 'M', just: 'Temperatura moderada, corteza dorada, no oscura', control: 'Límite operativo de 180 °C' }
    ]},
    { etapa: 'Enfriamiento', items: [
      { t: 'B', peligro: 'Recontaminación con esporas de mohos del ambiente; condensación dentro del empaque si se empaca caliente', p: 'M', s: 'M', just: 'Primer momento en que el producto cocido queda expuesto; ninguna etapa posterior lo elimina', control: 'Área cerrada, producto cubierto, temperatura y tiempo de enfriamiento (PCC 3)' },
      { t: 'F', peligro: 'Polvo o insectos sobre el producto', p: 'B', s: 'M', just: 'Producto cubierto', control: 'PPR: control de plagas, área cerrada' }
    ]},
    { etapa: 'Desmolde, porcionado, empaque y rotulado', items: [
      { t: 'B', peligro: 'S. aureus desde manos, cuchillos o tablas', p: 'B', s: 'A', just: 'Utensilios exclusivos; los guantes no reemplazan el lavado', control: 'PPR: higiene del manipulador F03, frotis de manos y superficies' },
      { t: 'Q', peligro: 'Alérgenos no declarados (gluten, huevo, leche) o fecha de vencimiento errada', p: 'M', s: 'A', just: 'Una etiqueta errada puede causar anafilaxia en un alérgico', control: 'Verificación del 100 % de las etiquetas (PCC 4)' },
      { t: 'Q', peligro: 'Migración desde empaque no apto', p: 'B', s: 'M', just: 'Bolsas con ficha técnica', control: 'PPR: Res. 683 de 2012' },
      { t: 'F', peligro: 'Fragmentos de empaque', p: 'B', s: 'B', just: '—', control: 'PPR: inspección visual' }
    ]},
    { etapa: 'Almacenamiento y despacho', items: [
      { t: 'B', peligro: 'Mohos si el empaque se rompe o hay humedad', p: 'B', s: 'M', just: 'Empaque sellado (verificado en PCC 4) y vida útil corta', control: 'PPR: lugar fresco y seco, PEPS, F12' },
      { t: 'F', peligro: 'Golpes y daño del empaque', p: 'B', s: 'B', just: '—', control: 'Canastilla tapada' }
    ]}
  ],

  /* ---------- 06 · Principio 2 · Árbol de decisiones ---------- */
  pccIntro: 'Un PCC es una etapa donde se puede aplicar un control esencial para prevenir, eliminar o reducir a un nivel aceptable un peligro significativo. No todas las etapas necesitan uno: medir temperatura tiene sentido en el horneo y el enfriamiento, no en el corte; el tamizado sirve para materia extraña, no para microorganismos.',
  arbol: [
    { q: '¿Existen medidas de control para el peligro en esta etapa o en una posterior?', si: 'Pasa a P2', no: 'Se modifica el proceso' },
    { q: '¿La etapa está diseñada específicamente para eliminar o reducir el peligro a un nivel aceptable?', si: 'Es PCC', no: 'Pasa a P3' },
    { q: '¿Puede la contaminación producirse o aumentar hasta niveles inaceptables?', si: 'Pasa a P4', no: 'No es PCC' },
    { q: '¿Una etapa posterior eliminará o reducirá el peligro a un nivel aceptable?', si: 'No es PCC', no: 'Es PCC' }
  ],
  casos: [
    { etapa: '1. Recepción', t: 'B', peligro: 'Salmonella en huevo', r: ['Sí', 'No', 'Sí', 'Sí'], extra: 'horneo', decision: 'No es PCC · punto de control (F01)' },
    { etapa: '1. Recepción', t: 'F', peligro: 'Materia extraña en harina', r: ['Sí', 'No', 'Sí', 'Sí'], extra: 'tamizado', decision: 'No es PCC · punto de control (F01)' },
    { etapa: '3. Alistamiento', t: 'B', peligro: 'Contaminación cruzada desde cáscara', r: ['Sí', 'No', 'Sí', 'Sí'], extra: 'horneo', decision: 'No es PCC' },
    { etapa: '5. Incorporación de huevos', t: 'B', peligro: 'Salmonella hacia la masa', r: ['Sí', 'No', 'Sí', 'Sí'], extra: 'horneo', decision: 'No es PCC' },
    { etapa: '6. Adición de secos', t: 'B', peligro: 'Esporas de B. cereus', r: ['Sí', 'No', 'No', null], decision: 'No es PCC · se vigila con laboratorio',
      nota: 'Con aw de 0,80 a 0,88, B. cereus no puede multiplicarse (necesita aw cercana a 0,93 o más): sus esporas no llegan a niveles peligrosos en los 5 días de vida útil.' },
    { etapa: '6. Tamizado', t: 'F', peligro: 'Materia extraña en los secos', r: ['Sí', 'Sí', null, null], decision: 'PCC 1', pcc: 1 },
    { etapa: '8. Horneo', t: 'B', peligro: 'Supervivencia de Salmonella', r: ['Sí', 'Sí', null, null], decision: 'PCC 2', pcc: 2 },
    { etapa: '9. Enfriamiento', t: 'B', peligro: 'Recontaminación por mohos y condensación', r: ['Sí', 'No', 'Sí', 'No'], decision: 'PCC 3', pcc: 3 },
    { etapa: '10. Empaque y rotulado', t: 'Q', peligro: 'Alérgenos no declarados / vencimiento errado', r: ['Sí', 'Sí', null, null], decision: 'PCC 4', pcc: 4 }
  ],
  resultadoNota: 'La recepción y el almacenamiento siguen siendo puntos de control (PC) importantes, pero no son PCC: una etapa posterior (tamizado u horneo) elimina el peligro, o los prerrequisitos ya lo mantienen controlado. Así se evita «poner PCC en todo», que haría el sistema inmanejable.',

  /* ---------- 07 a 10 · Los cuatro PCC ---------- */
  limitesIntro: 'El límite crítico es el valor que separa lo aceptable de lo inaceptable. Sin un número no se puede saber si el lote sobrepasó el control. Además se fija un límite operativo, más exigente, que permite corregir antes de llegar al crítico.',
  pccs: [
    { n: 1, nombre: 'Tamizado', etapa: 6, tipo: 'F', peligro: 'Materia extraña', ic: 'sieve',
      critico: 'Malla del tamiz íntegra (sin roturas, deformaciones ni hilos sueltos) antes y después de cada lote; 100 % de la harina, polvo de hornear y sal pasan por el tamiz',
      criticoCorto: 'Malla íntegra antes y después · 100 % de secos tamizados',
      operativo: 'Malla de 1 mm o menor; tamiz de repuesto disponible',
      direccion: 'Riesgo si la malla pierde su integridad', dir: 'neq',
      fundamento: 'Una malla fina retiene insectos, piedras, hilos y fragmentos que causan lesiones.',
      mon: { que: 'Integridad de la malla y lo que queda retenido', como: 'Inspección visual de la malla a contraluz antes y después de tamizar; revisión de lo retenido (insectos, hilos, objetos)', cuando: 'Antes y después de cada lote', quien: 'Jefe de producción', reg: 'F15' },
      acciones: [
        { desv: 'Malla rota o deformada, o hallazgo de objeto extraño', producto: 'Retener todo lo tamizado desde la última verificación conforme y volver a tamizarlo con el tamiz de repuesto. Si ya se incorporó a la masa, descartar esa masa (no se puede tamizar una masa).', proceso: 'Cambiar el tamiz; buscar el fragmento faltante de la malla; revisar el proveedor si el objeto venía en la harina.', resp: 'Jefe de producción', reg: 'F16' }
      ],
      verif: 'Revisión semanal de registros; auditoría semestral', regs: 'F15, F16',
      accionCorta: 'Retamizar con tamiz de repuesto; descartar masa si ya se incorporó; buscar fragmento' },
    { n: 2, nombre: 'Horneo', etapa: 8, tipo: 'B', peligro: 'Salmonella', ic: 'thermo',
      critico: 'Temperatura interna en el centro del ponqué ≥ 71 °C',
      criticoCorto: 'Centro ≥ 71 °C',
      operativo: 'Horno 170-180 °C, 45-55 min, centro ≥ 93 °C y palillo seco',
      direccion: 'Riesgo si queda por debajo del límite', dir: 'down',
      fundamento: '71 °C (160 °F) es la temperatura recomendada por el USDA para preparaciones con huevo, suficiente para destruir Salmonella.',
      mon: { que: 'Temperatura del horno y temperatura interna del centro', como: 'Termómetro de horno; termómetro digital de punzón calibrado, desinfectado con alcohol al 70 %, insertado en el centro del ponqué ubicado en el punto más frío del horno', cuando: 'Cada lote, al final del tiempo de horneo', quien: 'Jefe de producción', reg: 'F15' },
      acciones: [
        { desv: 'Centro < 71 °C (o palillo húmedo)', producto: 'Si se detecta al sacarlo: devolver al horno inmediatamente y continuar hasta centro ≥ 93 °C, luego volver a medir. Si el ponqué ya se enfrió sin alcanzar el límite: descartar el lote.', proceso: 'Verificar la temperatura real del horno con el termómetro de horno; ajustar; si el horno no calienta, suspender el horneo hasta su reparación y no preparar más masa; descartar la masa cruda que no se pueda hornear en el día.', resp: 'Jefe de producción', reg: 'F16' }
      ],
      verif: 'Mapeo del horno; termómetro semanal y calibración anual; análisis microbiológico', regs: 'F15, F16, F17',
      accionCorta: 'Devolver al horno hasta ≥ 93 °C; descartar si ya se enfrió; suspender si el horno falla' },
    { n: 3, nombre: 'Enfriamiento', etapa: 9, tipo: 'B', peligro: 'Mohos y condensación', ic: 'air',
      critico: 'Temperatura interna ≤ 30 °C antes de empacar y tiempo entre la salida del horno y el empaque ≤ 3 h, con el producto cubierto todo el tiempo',
      criticoCorto: '≤ 30 °C y ≤ 3 h, producto cubierto',
      operativo: 'Empacar entre 1,5 y 2 h después del horneo',
      direccion: 'Riesgo si sobrepasa la temperatura (condensación) o el tiempo (exposición a esporas)', dir: 'up',
      fundamento: 'Empacar caliente genera vapor que se condensa en la bolsa, sube la aw en la superficie y favorece mohos.',
      mon: { que: 'Temperatura interna y tiempo transcurrido', como: 'Termómetro de punzón en una unidad testigo; hora de salida del horno y hora de empaque; verificación de que el producto está cubierto y el área cerrada', cuando: 'Cada lote, antes de empacar', quien: 'Operaria de producción', reg: 'F15' },
      acciones: [
        { desv: 'Producto > 30 °C cumplido el tiempo normal', producto: 'No empacar; dejar enfriar cubierto en el área cerrada hasta ≤ 30 °C.', proceso: 'Revisar separación en rejillas y que no haya fuentes de calor cerca; enfriar menos unidades por rejilla.', resp: 'Operaria de producción', reg: 'F16' },
        { desv: 'Más de 3 h de exposición o área abierta / producto descubierto', producto: 'Retener el lote como no conforme. La responsable de calidad lo evalúa; si hubo contacto con corrientes de aire exterior, insectos o producto descubierto, descartar. Ese lote no se empaca con la vida útil normal.', proceso: 'Reforzar la programación de lotes para empacar a tiempo; revisar el cierre del área y el estado de las cubiertas.', resp: 'Responsable de calidad', reg: 'F16, F14' }
      ],
      verif: 'Placas de sedimentación mensuales; estudio de vida útil', regs: 'F15, F16',
      accionCorta: 'No empacar hasta ≤ 30 °C; retener y evaluar o descartar si > 3 h o expuesto' },
    { n: 4, nombre: 'Empaque y rotulado', etapa: 10, tipo: 'Q', peligro: 'Alérgenos no declarados', ic: 'tag',
      critico: '100 % de unidades con etiqueta correcta: declara gluten, huevo y leche, lote, vencimiento = elaboración + 5 días; 0 unidades sin etiqueta o con sellado abierto',
      criticoCorto: '100 % etiquetas correctas y sellado íntegro',
      operativo: 'Cotejo con la etiqueta maestra al inicio y al final del lote',
      direccion: 'Cualquier desviación (tolerancia cero)', dir: 'zero',
      fundamento: 'La Res. 5109 de 2005 exige declarar los ingredientes que causan hipersensibilidad.',
      mon: { que: 'Etiqueta (alérgenos, lote, vencimiento) y sellado', como: 'Revisión visual del 100 % de las unidades; cotejo de la primera y la última etiqueta con la etiqueta maestra; prueba de presión suave del sellado', cuando: 'Cada lote, cada unidad', quien: 'Operaria rotula; jefe de producción verifica', reg: 'F15' },
      acciones: [
        { desv: 'Etiqueta sin alérgenos, lote o fecha errados, unidad sin etiqueta', producto: 'Separar las unidades y reetiquetar con la etiqueta correcta antes de que salgan. Si ya se despacharon: retiro del producto de las tiendas con el código de lote.', proceso: 'Corregir la plantilla del generador de etiquetas; revisar la etiqueta maestra; reentrenar a quien rotula.', resp: 'Jefe de producción (gerente si hay retiro)', reg: 'F16, F14' },
        { desv: 'Sellado defectuoso', producto: 'Pasar el producto a bolsa nueva y sellar dentro del mismo turno; si se manipuló sin higiene o pasó la jornada, descartar.', proceso: 'Revisar la selladora y su temperatura.', resp: 'Operaria de producción', reg: 'F16' }
      ],
      verif: 'Revisión semanal; auditoría; quejas', regs: 'F15, F16, F14',
      accionCorta: 'Reetiquetar o resellar; retiro de producto si ya salió' }
  ],

  monitoreoIntro: 'Secuencia planificada de observaciones o mediciones que confirma que cada PCC está bajo control antes de que el ponqué salga de la planta. Se monitorea cada lote (unos 20 ponqués, código PQ-AAMMDD-01), para detectar la desviación a tiempo y detener, corregir y continuar.',

  reglaGeneral: ['Detener la etapa', 'Separar el producto afectado', 'Corregir la causa', 'Verificar que el PCC volvió a control', 'Continuar la producción'],
  accionesIntro: 'No basta con fijar el PCC y el límite: hay que decir qué hacer cuando se sobrepasa. Las acciones deben ser viables para una microempresa, que no puede parar un día entero buscando la solución.',
  alternativas: ['Tamiz de repuesto', 'Termómetro de repuesto', 'Reproceso cuando es seguro', 'Descarte solo si la inocuidad no se puede recuperar'],
  escalamiento: 'Si el mismo PCC se desvía dos o más veces en un mes, el equipo HACCP se reúne, analiza la causa raíz y programa una capacitación específica sobre esa falla (registro F10).',

  /* ---------- 11 · Principio 6 · Verificación y validación ---------- */
  verificacionDef: 'Confirma que el plan HACCP funciona como se diseñó y que los registros son reales.',
  validacionDef: 'Comprueba, con evidencia científica, que los límites críticos sí controlan el peligro.',
  validacion: [
    { t: 'Mapeo de temperatura del horno', texto: 'Con termómetro de punzón se mide la temperatura interna de ponqués en distintas posiciones del horno durante tres lotes, para identificar el punto más frío: ahí se monitorea el PCC 2.' },
    { t: 'Tres lotes consecutivos', texto: 'Tres lotes seguidos cumpliendo los límites de los cuatro PCC, con análisis microbiológico del producto terminado.' },
    { t: 'Estudio de vida útil', texto: 'Unidades de un mismo lote a temperatura ambiente se analizan en el laboratorio externo (mohos y levaduras, mesófilos) los días 0, 3, 5 y 6, con evaluación sensorial, para confirmar los 5 días de la etiqueta.' }
  ],
  // Valores de ejemplo para la demostración del mapeo (no son mediciones reales)
  hornoDemo: [97, 99, 96, 95, 98, 94, 96, 97, 93],
  vidaUtil: [
    { dia: 0, t: 'Día 0', texto: 'Muestra el día de elaboración: punto de partida de mohos y levaduras, mesófilos y evaluación sensorial.' },
    { dia: 3, t: 'Día 3', texto: 'Seguimiento a mitad de la vida útil, con las mismas determinaciones.' },
    { dia: 5, t: 'Día 5', texto: 'Último día de la vida útil declarada en la etiqueta: el producto debe seguir cumpliendo.' },
    { dia: 6, t: 'Día 6', texto: 'Un día después del vencimiento declarado, para confirmar los 5 días de la etiqueta.' }
  ],
  verificacion: [
    { act: 'Revisión y firma de los registros de monitoreo (F15) y de acciones correctivas (F16)', frec: 'Semanal', resp: 'Responsable de calidad', reg: 'F15, F16' },
    { act: 'Verificación del termómetro de punzón en agua con hielo (debe marcar 0 °C ± 1 °C)', frec: 'Semanal', resp: 'Jefe de producción', reg: 'F17' },
    { act: 'Análisis microbiológico de producto terminado (Res. 1407 de 2022)', frec: 'Mensual', nota: 'Durante el primer semestre; luego trimestral', resp: 'Responsable de calidad', reg: 'F13' },
    { act: 'Placas de sedimentación (DRBC, 15 min) en el área de enfriamiento y frotis de superficies de empaque', frec: 'Mensual', resp: 'Responsable de calidad', reg: 'F13' },
    { act: 'Observación directa del monitoreo (que se mida como dice el plan)', frec: 'Mensual', nota: 'Sin aviso', resp: 'Responsable de calidad', reg: 'F19' },
    { act: 'Revisión de quejas y devoluciones relacionadas con inocuidad', frec: 'Mensual', resp: 'Gerente y responsable de calidad', reg: 'F14' },
    { act: 'Auditoría interna del plan HACCP con lista de chequeo', frec: 'Semestral', resp: 'Equipo HACCP', reg: 'F19' },
    { act: 'Calibración del termómetro de punzón y del termómetro de horno con laboratorio acreditado', frec: 'Anual', resp: 'Responsable de calidad', reg: 'F17' },
    { act: 'Verificación in situ del diagrama de flujo', frec: 'Anual', nota: 'Y ante cambios', resp: 'Equipo HACCP', reg: 'F18' },
    { act: 'Revisión completa del plan HACCP', frec: 'Anual', nota: 'O ante cambios de receta, proveedor, equipo, o desviaciones repetidas', resp: 'Equipo HACCP', reg: 'F20' }
  ],
  auditorias: 'Las auditorías permiten saber qué está pasando realmente: si un PCC se sobrepasó, si se cumplió, si las capacitaciones dadas por una falla funcionaron. Con sus hallazgos se mejora el plan.',

  /* ---------- 12 · Principio 7 · Documentación y registros ---------- */
  registrosIntro: 'Lo que no está escrito no se puede demostrar. Cuando la Secretaría de Salud o el INVIMA visitan la planta piden el plan, los registros de monitoreo, las acciones correctivas, las capacitaciones y los resultados de laboratorio. Todo se archiva en la oficina por un mínimo de dos años.',
  documentos: [
    { t: 'Plan HACCP', texto: 'Equipo, descripción del producto, uso previsto, diagrama de flujo, análisis de peligros, determinación de PCC y matriz del plan.' },
    { t: 'Plan BPM y de saneamiento', texto: 'Con sus cuatro programas (documento de la semana 12).' },
    { t: 'Procedimientos', texto: 'De monitoreo, de calibración de termómetros y de retiro de producto.' }
  ],
  formatosBPM: ['Recepción', 'Temperatura de neveras', 'Estado de salud', 'Limpieza diaria', 'Limpieza profunda', 'Soluciones desinfectantes', 'Plagas', 'Residuos', 'Agua potable', 'Capacitación', 'Producción', 'Vehículo', 'Laboratorio', 'Quejas y retiros'],
  formatosH: [
    { cod: 'F15', nombre: 'Monitoreo de PCC por lote', det: 'Tamizado, horneo, enfriamiento, empaque y rotulado', frec: 'Cada lote', resp: 'Jefe de producción / operaria', ejemplo: 'f15' },
    { cod: 'F16', nombre: 'Desviaciones y acciones correctivas HACCP', det: 'Una fila por cada desviación', frec: 'Cada desviación', resp: 'Quien detecta + responsable de calidad', ejemplo: 'f16' },
    { cod: 'F17', nombre: 'Verificación y calibración de termómetros', det: 'Agua con hielo y calibración externa', frec: 'Semanal / anual', resp: 'Jefe de producción / responsable de calidad' },
    { cod: 'F18', nombre: 'Verificación in situ del diagrama de flujo', det: 'Recorrido del equipo HACCP', frec: 'Anual y ante cambios', resp: 'Equipo HACCP' },
    { cod: 'F19', nombre: 'Auditoría interna y observación del monitoreo', det: 'Lista de chequeo HACCP', frec: 'Mensual / semestral', resp: 'Responsable de calidad' },
    { cod: 'F20', nombre: 'Actas de reunión y revisión del plan', det: 'Reuniones del equipo HACCP', frec: 'Mensual', resp: 'Coordinadora del equipo' }
  ],
  f15: {
    cols: ['Lote', 'Tamiz antes / después', 'Horno °C / tiempo', 'Centro °C', 'Salida horno', 'Empaque', 'T° al empacar', 'Etiqueta y sellado', 'Conforme', 'Firma'],
    filas: [
      ['PQ-261102-01', '✓ / ✓', '175 / 50 min', '96', '10:50', '12:35', '28 °C', '✓ 20/20', 'Sí', ''],
      ['PQ-261102-02', '✓ / ✓', '172 / 48 min', '68 → 95*', '13:05', '14:50', '29 °C', '✓ 20/20', 'Sí*', '']
    ],
    nota: '*Lote 02: el centro marcó 68 °C, se devolvió al horno 7 minutos y alcanzó 95 °C; la desviación se anotó en el F16.'
  },
  f16: {
    cols: ['Fecha', 'Lote', 'PCC', 'Desviación', 'Acción sobre el producto', 'Causa y corrección', 'Verificación', 'Firma'],
    filas: [
      ['02/11', 'PQ-261102-02', 'PCC 2', 'Centro 68 °C (< 71 °C)', 'Devuelto al horno 7 min; re-medido 95 °C', 'Puerta del horno abierta varias veces; se instruyó no abrir antes de 40 min', 'Lote 03 conforme (97 °C)', '']
    ],
    nota: 'Ejemplo tomado del plan.'
  },

  /* ---------- 13 · Matriz y capacitación ---------- */
  capacitacionIntro: 'Al plan de capacitación de 10 horas anuales del plan BPM se agrega una sesión de 2 horas sobre el sistema HACCP: el total pasa a 12 horas al año.',
  capacitacion: [
    ['Al implementar el plan (y en la inducción de personal nuevo)', 'Sistema HACCP de ADEX: qué es un PCC, los 4 PCC, sus límites, cómo medir, qué hacer ante una desviación y cómo llenar el F15 y el F16', 'Taller práctico en planta: medición con termómetro de punzón, inspección del tamiz y cotejo de etiquetas', '2'],
    ['Cuando un PCC se desvíe 2 o más veces en un mes', 'Refuerzo específico de la falla encontrada', 'Análisis del caso con el personal', 'Según necesidad']
  ],

  /* ---------- 14 · Cierre ---------- */
  resumen: [
    { tag: 'Principios 1 y 2', titulo: '4 de 11 etapas', texto: 'Con los prerrequisitos implementados, solo el tamizado, el horneo, el enfriamiento y el empaque con rotulado necesitan un control crítico.' },
    { tag: 'Principios 3 a 5', titulo: 'Límite, monitoreo y acción', texto: 'El horneo es el único paso que elimina Salmonella; el enfriamiento protege de los mohos; el rotulado protege a las personas alérgicas. Cada PCC tiene una acción viable para una microempresa.' },
    { tag: 'Principios 6 y 7', titulo: 'El primer escalón', texto: 'Validación, calibración, laboratorio, auditorías y seis registros nuevos. Con BPM y HACCP documentados, ADEX abre el camino hacia ISO 22000 y un esquema GFSI.' }
  ],
  preguntas: [
    ['¿Por qué la recepción no es un PCC si ahí llega la Salmonella?', 'Porque una etapa posterior la elimina: el horneo (PCC 2) destruye la Salmonella del huevo y el tamizado (PCC 1) retira la materia extraña. La recepción sigue siendo un punto de control con el F01.'],
    ['¿Por qué el límite del horneo es 71 °C?', 'Es la temperatura interna que recomienda el USDA para preparaciones con huevo, suficiente para destruir Salmonella. El límite operativo (centro ≥ 93 °C) da margen para corregir antes de llegar al crítico.'],
    ['Si las esporas de B. cereus resisten el horneo, ¿por qué no son PCC?', 'Porque con una aw de 0,80 a 0,88 no pueden multiplicarse (necesitan cerca de 0,93): no llegan a niveles peligrosos en los 5 días de vida útil. Se vigilan con el laboratorio.'],
    ['¿Por qué el rotulado es un PCC?', 'Una etiqueta sin gluten, huevo o leche puede causar anafilaxia en una persona alérgica. Por eso tiene tolerancia cero: el 100 % de las unidades se revisa.'],
    ['¿Qué pasa si el horno se daña en plena producción?', 'Se suspende el horneo hasta su reparación, no se prepara más masa y se descarta la masa cruda que no se pueda hornear en el día. Todo queda en el F16.'],
    ['¿Cuál es la diferencia entre verificar y validar?', 'Validar comprueba con evidencia que el límite sí controla el peligro (mapeo del horno, vida útil). Verificar confirma que el plan se cumple como se diseñó (revisión de registros, calibración, auditorías).']
  ],

  referencias: [
    'Codex Alimentarius. (2020). Principios generales de higiene de los alimentos (CXC 1-1969, revisión 2020). FAO/OMS.',
    'Ministerio de Salud y Protección Social. (2013). Resolución 2674 de 2013.',
    'Ministerio de Salud y Protección Social. (2022). Resolución 1407 de 2022. Criterios microbiológicos para alimentos y bebidas.',
    'Ministerio de la Protección Social. (2005). Resolución 5109 de 2005. Rotulado o etiquetado de alimentos envasados.',
    'Ministerio de Salud y Protección Social. (2012). Resolución 683 de 2012. Materiales en contacto con alimentos.',
    'Ministerio de Salud y Protección Social. (2021). Resolución 810 de 2021, modificada por la Resolución 2492 de 2022. Etiquetado nutricional y frontal.',
    'Presidencia de la República de Colombia. (2002). Decreto 60 de 2002. Aplicación del Sistema HACCP en las fábricas de alimentos.',
    'U.S. Food and Drug Administration. (2011). Food Safety Modernization Act (FSMA).',
    'Global Food Safety Initiative. (s. f.). GFSI Benchmarking Requirements. The Consumer Goods Forum.',
    'U.S. Department of Agriculture, FSIS. (s. f.). Safe minimum internal temperature chart.',
    'ADEX Sweets & Pink. (2026). Plan BPM del ponqué de vainilla.'
  ]
};
