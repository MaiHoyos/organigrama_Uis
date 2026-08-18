(() => {
  "use strict";

  const STORAGE_KEY = "uis-organigrama-canvas-v4";
  const LEGACY_STORAGE_KEY = "uis-organigrama-canvas-v3";
  const SCHEMA_VERSION = 12;
  const CANVAS_WIDTH = 2800;
  const MIN_ZOOM = 0.35;
  const MAX_ZOOM = 1.50;
  const ZOOM_STEP = 0.10;
  const GRID = 5;
  const FACULTY_SHIFT = 440;

  const GROUPS = ["rectoria", "investigacion", "vacademica", "administrativa", "proyeccion", "facultades"];
  const GROUP_BY_CORE = {
    rectoria: "rectoria",
    vie: "investigacion",
    vacad: "vacademica",
    vadmin: "administrativa",
    vproyeccion: "proyeccion",
    facultades: "facultades"
  };

  const branchClass = {
    rectoria: "branch-rectoria",
    investigacion: "branch-turq",
    vacademica: "branch-blue",
    administrativa: "branch-admin",
    proyeccion: "branch-proyeccion",
    facultades: "branch-purple",
    core: ""
  };

  const connectionBranchClass = {
    investigacion: "branch-turq",
    vacademica: "branch-blue",
    administrativa: "branch-admin",
    proyeccion: "branch-proyeccion",
    facultades: "branch-purple"
  };

  const baseNodes = [];
  const add = (id, label, x, y, w, h, parent = null, opts = {}) => {
    baseNodes.push({
      id, label, x, y, w, h, parent,
      group: opts.group || "core",
      kind: opts.kind || "normal",
      relation: opts.relation || "hierarchical",
      style: opts.style || "normal",
      sourceSide: opts.sourceSide || "auto",
      targetSide: opts.targetSide || "auto",
      css: opts.css || "",
      custom: false
    });
  };

  // =========================
  // Estructura principal
  // =========================
  add("superior", "CONSEJO SUPERIOR", 820, 55, 360, 54, null, {kind:"main", css:"dark"});
  add("rectoria", "RECTORÍA", 820, 137, 360, 66, "superior", {kind:"main", css:"rectoria"});
  add("academico", "CONSEJO ACADÉMICO", 820, 238, 360, 54, "rectoria", {kind:"main", css:"dark"});

  add("vie", "VICERRECTORÍA DE\nINVESTIGACIÓN Y EXTENSIÓN", 115, 355, 325, 72, "academico", {kind:"main", css:"turq", sourceSide:"bottom", targetSide:"top"});
  add("vacad", "VICERRECTORÍA\nACADÉMICA", 500, 355, 300, 72, "academico", {kind:"main", css:"blue", sourceSide:"bottom", targetSide:"top"});
  add("vadmin", "VICERRECTORÍA\nADMINISTRATIVA", 865, 355, 360, 72, "academico", {kind:"main", css:"admin", sourceSide:"bottom", targetSide:"top"});

  // NUEVO: Vicerrectoría de Proyección Social y Territorio.
  // Al ser una unidad nueva, su casilla principal es amarilla.
  add(
    "vproyeccion",
    "VICERRECTORÍA DE\nPROYECCIÓN SOCIAL\nY TERRITORIO",
    1275, 355, 360, 72, "academico",
    {kind:"main", style:"new", sourceSide:"bottom", targetSide:"top"}
  );

  // Se desplaza la rama de Facultades para dejar espacio limpio a la nueva Vicerrectoría.
  add("facultades", "FACULTADES", 1490 + FACULTY_SHIFT, 355, 235, 72, "academico", {kind:"main", css:"purple", sourceSide:"bottom", targetSide:"top"});

  // =========================
  // Rectoría: asesorías/apoyos
  // =========================
  add("idr", "Instituto de Desarrollo\nRegional", 500, 42, 230, 40, "rectoria", {group:"rectoria", relation:"advisory", style:"new"});
  add("uiaes", "Unidad de Información y\nAnálisis Estadístico - UIAES", 235, 100, 240, 47, "planeacion", {group:"rectoria", relation:"hierarchical", sourceSide:"left", targetSide:"right"});
  add("planeacion", "Planeación", 500, 100, 230, 40, "rectoria", {group:"rectoria", relation:"advisory"});
  add("control-gestion", "Dirección de Control Interno\ny Evaluación de Gestión", 500, 151, 230, 47, "rectoria", {group:"rectoria", relation:"advisory"});
  add("control-disciplinario", "Oficina de Control Interno\nDisciplinario", 500, 209, 230, 47, "rectoria", {group:"rectoria", relation:"advisory"});
  add("uisalud", "Unidad Especializada en Salud\n- UISALUD", 500, 267, 230, 47, "rectoria", {group:"rectoria", relation:"advisory"});

  add("relaciones", "Relaciones Exteriores", 1285, 100, 235, 40, "rectoria", {group:"rectoria"});
  add("secretaria", "Secretaría General", 1285, 151, 235, 40, "rectoria", {group:"rectoria"});
  add("certificacion", "Dirección de Certificación\ny Gestión Documental", 1285, 202, 235, 47, "secretaria", {group:"rectoria", sourceSide:"bottom", targetSide:"top"});
  add("comunicaciones", "Dirección de Comunicaciones", 1285, 260, 235, 40, "rectoria", {group:"rectoria", relation:"advisory"});

  // =========================
  // Vicerrectoría de Investigación y Extensión
  // =========================
  let y = 460;
  const vieX = 120, vieW = 315, rowH = 45, gap = 8;
  [
    ["cie","Consejo de Investigación\ny Extensión"],
    ["ieia","Instituto de Estudios\nInterdisciplinarios y Acción"],
    ["transferencia","Estrategia para la Dirección de\nTransferencia de Conocimiento"],
    ["direcciones-ie","Direcciones de Investigación\ny Extensión de las Facultades"],
    ["comite-ie","Comité Operativo de\nInvestigación y Extensión"],
    ["programas","Coordinación de Programas\ny Proyectos"]
  ].forEach(([id,label]) => { add(id,label,vieX,y,vieW,rowH,"vie",{group:"investigacion"}); y += rowH+gap; });
  add("centro-tecnico","Centro Administrativo de Estudios\nTécnicos y Tecnológicos",vieX,y,vieW,52,"vie",{group:"investigacion",style:"new"});

  // =========================
  // Vicerrectoría Académica
  // =========================
  y = 460;
  const vaX = 500, vaW = 300;
  [
    ["posgrados","Dirección de Posgrados"],
    ["calidad","Coordinación de Evaluación\nde la Calidad"],
    ["cultural","Dirección Cultural"],
    ["admisiones","Dirección de Admisiones\ny Registro Académico"],
    ["biblioteca","Biblioteca"],
    ["cededuis","CEDEDUIS"],
    ["bienestar","Bienestar Estudiantil"]
  ].forEach(([id,label]) => { add(id,label,vaX,y,vaW,rowH,"vacad",{group:"vacademica"}); y += rowH+gap; });
  add("servicios-salud","Coordinación de Servicios Integrales\nde Salud y Desarrollo",520,y,260,52,"bienestar",{group:"vacademica",style:"sublevel"}); y += 60;
  add("alimentacion","Coordinación de Servicios\nde Alimentación",520,y,260,47,"bienestar",{group:"vacademica",style:"sublevel"}); y += 58;
  add("consejo-sedes","Consejo de Sedes",500,y,300,43,"vacad",{group:"vacademica",style:"new"}); y += 53;
  [
    ["barranca","Escuela de Formación y Desarrollo\nTerritorial Barrancabermeja"],
    ["malaga","Sede Málaga"],
    ["socorro","Sede Socorro"],
    ["barbosa","Sede Barbosa"]
  ].forEach(([id,label]) => { add(id,label,520,y,260,45,"consejo-sedes",{group:"vacademica",style:"new"}); y += 53; });

  // =========================
  // Vicerrectoría Administrativa
  // =========================
  y = 460;
  const adX = 865, adW = 360;
  add("financiera","División Financiera",adX,y,adW,43,"vadmin",{group:"administrativa"}); y += 51;
  [
    ["inventarios","Sección de Inventarios"],
    ["recaudos","Sección de Recaudos"],
    ["presupuesto","Sección de Presupuesto"],
    ["tesoreria","Sección de Tesorería"],
    ["contabilidad","Sección de Contabilidad"]
  ].forEach(([id,label]) => { add(id,label,885,y,320,35,"financiera",{group:"administrativa",style:"sublevel"}); y += 42; });
  [
    ["talento","División de Gestión de Talento Humano",43],
    ["contratacion","División de Contratación",43],
    ["tic","División de Tecnologías de la Información\ny la Comunicación",50],
    ["publicaciones","División de Publicaciones",43],
    ["mantenimiento","División de Mantenimiento Tecnológico",43],
    ["planta","División de Planta Física",43]
  ].forEach(([id,label,h]) => { add(id,label,adX,y,adW,h,"vadmin",{group:"administrativa"}); y += h+8; });
  add("seguridad","Sección de Seguridad",885,y,320,35,"planta",{group:"administrativa",style:"sublevel"});

  // =========================
  // NUEVA Vicerrectoría de Proyección Social y Territorio
  // =========================
  // La Vicerrectoría es amarilla; sus dependencias son blancas.
  add(
    "comite-proyeccion",
    "Comité de Proyección Social\ny Territorio",
    1280, 460, 350, 54, "vproyeccion",
    {group:"proyeccion", style:"sublevel", sourceSide:"bottom", targetSide:"top"}
  );

  add(
    "educacion-buen-vivir",
    "Educación y Buen Vivir",
    1280, 528, 350, 48, "vproyeccion",
    {group:"proyeccion", style:"sublevel", sourceSide:"bottom", targetSide:"top"}
  );

  add(
    "extension-regionalizacion",
    "Extensión y Proyección Social\nde Regionalización",
    1280, 590, 350, 60, "vproyeccion",
    {group:"proyeccion", style:"sublevel", sourceSide:"bottom", targetSide:"top"}
  );

  add(
    "sedes-regionales",
    "Sedes Regionales",
    1310, 664, 290, 45, "extension-regionalizacion",
    {group:"proyeccion", style:"sublevel", sourceSide:"bottom", targetSide:"top"}
  );

  add(
    "amovi",
    "AMOVI",
    1280, 723, 350, 48, "vproyeccion",
    {group:"proyeccion", style:"sublevel", sourceSide:"bottom", targetSide:"top"}
  );

  // =========================
  // Facultades
  // =========================
  const fx = [1280 + FACULTY_SHIFT, 1480 + FACULTY_SHIFT, 1680 + FACULTY_SHIFT, 1880 + FACULTY_SHIFT];
  const fw = 185;
  const fHeaders = [
    ["fac-ciencias","FACULTAD\nDE CIENCIAS",fx[0]],
    ["fac-humanas","FACULTAD DE\nCIENCIAS HUMANAS",fx[1]],
    ["fac-ingenierias","FACULTAD DE\nINGENIERÍAS",fx[2]],
    ["fac-salud","FACULTAD\nDE SALUD",fx[3]]
  ];
  fHeaders.forEach(([id,label,x]) => add(id,label,x,460,fw,60,"facultades",{group:"facultades",kind:"faculty-header",sourceSide:"bottom",targetSide:"top"}));

  // NUEVO: Facultad de Ciencias Agrarias.
  // La facultad es amarilla porque corresponde a una incorporación nueva.
  // Sus programas quedan blancos porque dependen de ella.
  add("fac-agrarias", "FACULTAD DE CIENCIAS\nAGRARIAS", 2080 + FACULTY_SHIFT, 460, fw, 60, "facultades", {
    group:"facultades",
    kind:"faculty-header",
    style:"new",
    sourceSide:"bottom",
    targetSide:"top"
  });

  const addFacultyList = (parent, x, items) => {
    let yy = 535;
    items.forEach(item => {
      const [id,label,h=40,style="normal",p=parent] = item;
      add(id,label,x,yy,fw,h,p,{group:"facultades",style});
      yy += h + 8;
    });
  };

  addFacultyList("fac-ciencias", fx[0], [
    ["fc-consejo","Consejo de Facultad"],
    ["biologia","Escuela de Biología"],
    ["fisica","Escuela de Física"],
    ["matematicas","Escuela de Matemáticas"],
    ["quimica","Escuela de Química"]
  ]);

  addFacultyList("fac-humanas", fx[1], [
    ["fch-consejo","Consejo de Facultad"],
    ["lenguas","Instituto de Lenguas"],
    ["derecho","Escuela de Derecho y\nCiencia Política",46],
    // Debe verse inmediatamente debajo de Derecho.
    ["gestion-judicial","Tecnología en Gestión Judicial\ne Investigación Criminal",54,"sublevel","derecho"],
    ["economia","Escuela de Economía\ny Administración",46],
    ["educacion","Escuela de Educación"],
    ["historia","Escuela de Historia"],
    ["idiomas","Escuela de Idiomas"],
    ["trabajo-social","Escuela de Trabajo Social"],
    ["filosofia","Escuela de Filosofía"],
    ["deportes","Departamento de Educación\nFísica y Deportes",46],
    ["admin-finanzas","Escuela de Administración\ny Finanzas",46],
    // NUEVA unidad: Escuela de Artes y Música.
    ["musica","Escuela de Artes y Música",46,"new","fac-humanas"],
    // Dos carreras separadas debajo de la nueva escuela.
    ["carrera-musica","Música",40,"sublevel","musica"],
    ["artes-plasticas","Artes Plásticas",40,"sublevel","musica"]
  ]);

  addFacultyList("fac-ingenierias", fx[2], [
    ["fi-consejo","Consejo de Facultad"],
    ["diseno","Escuela de Diseño\nIndustrial",44],
    ["civil","Escuela de Ingeniería\nCivil",44],
    ["electrica","Escuela de Ingeniería Eléctrica,\nElectrónica y Telecomunicaciones",54],
    ["industriales","Escuela de Estudios Industriales\ny Empresariales",50],
    // Ambos programas van inmediatamente debajo de Industriales.
    ["tecnologia-empresarial","Tecnología Empresarial",40,"sublevel","industriales"],
    ["gestion-empresarial","Gestión Empresarial",40,"sublevel","industriales"],
    ["mecanica","Escuela de Ingeniería\nMecánica",44],
    ["sistemas","Escuela de Ingeniería de\nSistemas e Informática",50],
    // IA debe quedar justo debajo de Sistemas.
    ["inteligencia-artificial","Ingeniería en Inteligencia Artificial",46,"sublevel","sistemas"],
    ["geologia","Escuela de Geología"],
    ["metalurgica","Escuela de Ingeniería Metalúrgica\ny Ciencia de los Materiales",54],
    ["petroleos","Escuela de Ingeniería de Petróleos",44],
    ["ing-quimica","Escuela de Ingeniería Química",44],
    // Ingeniería en Alimentos justo debajo de Ingeniería Química.
    ["alimentos","Ing. en Alimentos",40,"sublevel","ing-quimica"]
  ]);

  // NUEVO: Escuela de Hábitat y Territorio (amarilla).
  add("habitat-territorio", "Escuela de Hábitat\ny Territorio", 1680 + FACULTY_SHIFT, 1350, fw, 50, "fac-ingenierias", {
    group:"facultades",
    style:"new",
    sourceSide:"bottom",
    targetSide:"top"
  });

  // Programas dependientes de Hábitat y Territorio: blancos.
  add("ing-construccion", "Ing. Construcción", 1700 + FACULTY_SHIFT, 1412, 165, 40, "habitat-territorio", {
    group:"facultades",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  add("arquitectura", "Arquitectura", 1700 + FACULTY_SHIFT, 1465, 165, 40, "habitat-territorio", {
    group:"facultades",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  add("admin-turistica-hotelera", "Administración de Empresas\nTurísticas y Hoteleras", 1700 + FACULTY_SHIFT, 1518, 165, 58, "habitat-territorio", {
    group:"facultades",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });

  // NUEVO: programas de la Facultad de Ciencias Agrarias.
  // Todos quedan blancos por depender de la nueva facultad.
  add("ing-forestal", "Ing. Forestal", 2080 + FACULTY_SHIFT, 535, fw, 40, "fac-agrarias", {
    group:"facultades", style:"sublevel"
  });
  add("zootecnia", "Zootecnia", 2080 + FACULTY_SHIFT, 583, fw, 40, "fac-agrarias", {
    group:"facultades", style:"sublevel"
  });
  add("med-veterinaria", "Medicina Veterinaria", 2080 + FACULTY_SHIFT, 631, fw, 40, "fac-agrarias", {
    group:"facultades", style:"sublevel"
  });
  add("ing-agronomica", "Ing. Agronómica", 2080 + FACULTY_SHIFT, 679, fw, 40, "fac-agrarias", {
    group:"facultades", style:"sublevel"
  });
  // Programas del área Agroindustrial por ciclos propedéuticos:
  // este es el cuadro padre. Sus tres carreras se desprenden de él.
  add(
    "programas-agroindustrial",
    "Programas del área Agroindustrial\npor ciclos propedéuticos",
    2080 + FACULTY_SHIFT, 727, fw, 58, "fac-agrarias",
    {
      group:"facultades",
      style:"sublevel",
      sourceSide:"bottom",
      targetSide:"top"
    }
  );

  add(
    "tecnico-produccion-agropecuaria",
    "Técnico profesional en\nproducción agropecuaria",
    2080 + FACULTY_SHIFT, 797, fw, 54, "programas-agroindustrial",
    {
      group:"facultades",
      style:"sublevel",
      sourceSide:"bottom",
      targetSide:"top"
    }
  );

  add(
    "tecnologia-agroindustrial",
    "Tecnología Agroindustrial",
    2080 + FACULTY_SHIFT, 863, fw, 42, "programas-agroindustrial",
    {
      group:"facultades",
      style:"sublevel",
      sourceSide:"bottom",
      targetSide:"top"
    }
  );

  add(
    "administracion-agroindustrial",
    "Administración Agroindustrial",
    2080 + FACULTY_SHIFT, 917, fw, 42, "programas-agroindustrial",
    {
      group:"facultades",
      style:"sublevel",
      sourceSide:"bottom",
      targetSide:"top"
    }
  );

  addFacultyList("fac-salud", fx[3], [
    ["fs-consejo","Consejo de Facultad"],
    ["proinapsa","PROINAPSA"],
    ["microbiologia","Escuela de Microbiología"],
    ["enfermeria","Escuela de Enfermería"],
    ["fisioterapia","Escuela de Fisioterapia"],
    ["nutricion","Escuela de Nutrición"],
    ["medicina","Escuela de Medicina"]
  ]);

  // Departamentos de Medicina, a la derecha del nodo Escuela de Medicina.
  let my = 871;
  [
    ["ciencias-basicas","Departamento de Ciencias Básicas"],
    ["cirugia","Departamento de Cirugía"],
    ["gineco","Departamento de Ginecobstetricia"],
    ["med-interna","Departamento de Medicina Interna"],
    ["patologia","Departamento de Patología"],
    ["pediatria","Departamento de Pediatría"],
    ["salud-mental","Departamento de Salud Mental"],
    ["salud-publica","Departamento de Salud Pública"]
  ].forEach(([id,label]) => { add(id,label,1880 + FACULTY_SHIFT,my,185,34,"medicina",{group:"facultades",style:"sublevel"}); my += 41; });
  add("regencia","Tecnología en Regencia de Farmacia",1880 + FACULTY_SHIFT,1215,205,40,"fac-salud",{group:"facultades",style:"sublevel",sourceSide:"bottom",targetSide:"top"});


  // =========================
  // Modelo interno de Escuela (recuadro informativo de la referencia)
  // =========================
  add("modelo-escuela-frame", "Modelo interno de Escuela", 1705, 65, 405, 215, null, {kind:"model-frame"});
  add("modelo-direccion", "Dirección de\nEscuela", 1765, 128, 130, 54, null, {kind:"model-item", style:"sublevel"});
  add("modelo-consejo", "Consejo de\nEscuela", 1940, 148, 110, 54, null, {kind:"model-item", style:"sublevel"});
  add("modelo-personal", "Personal docente\ny administrativo", 1765, 202, 130, 64, null, {kind:"model-item", style:"sublevel"});


  const baseState = {
    schemaVersion: SCHEMA_VERSION,
    nodes: baseNodes,
    expanded: Object.fromEntries(GROUPS.map(g => [g,false])),
    collapsedNodes: {},
    zoom: 1
  };

  const $ = s => document.querySelector(s);
  const canvas = $("#orgCanvas");
  const nodesLayer = $("#nodesLayer");
  const svg = $("#connections");
  const shell = $("#canvasShell");
  const stage = $("#canvasStage");

  const zoomOutBtn = $("#zoomOutBtn");
  const zoomInBtn = $("#zoomInBtn");
  const fitBtn = $("#fitBtn");
  const zoomValue = $("#zoomValue");

  const editBtn = $("#editBtn");
  const editBar = $("#editBar");
  const addBtn = $("#addBtn");
  const renameBtn = $("#renameBtn");
  const parentBtn = $("#parentBtn");
  const linkBtn = $("#linkBtn");
  const deleteBtn = $("#deleteBtn");
  const doneBtn = $("#doneBtn");
  const expandBtn = $("#expandBtn");
  const collapseBtn = $("#collapseBtn");
  const resetBtn = $("#resetBtn");

  const dialog = $("#nodeDialog");
  const dialogTitle = $("#dialogTitle");
  const labelWrap = $("#labelWrap");
  const labelInput = $("#labelInput");
  const parentWrap = $("#parentWrap");
  const parentLabel = $("#parentLabel");
  const parentSelect = $("#parentSelect");
  const relationWrap = $("#relationWrap");
  const relationSelect = $("#relationSelect");
  const styleWrap = $("#styleWrap");
  const styleSelect = $("#styleSelect");
  const anchorWrap = $("#anchorWrap");
  const sourceSideSelect = $("#sourceSideSelect");
  const targetSideSelect = $("#targetSideSelect");
  const newNodeHint = $("#newNodeHint");
  const saveDialogBtn = $("#saveDialogBtn");

  let state = loadState();
  let editMode = false;
  let selectedId = null;
  let selectedLinkChildId = null;
  let dialogMode = "add";
  let drag = null;

  const PROTECTED_NODES = new Set([
    "superior","rectoria","academico","vie","vacad","vadmin","vproyeccion","facultades"
  ]);

  function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }

  function normalizeState(parsed){
    parsed.nodes ||= [];
    parsed.nodes.forEach(n => {
      if(!n.relation) n.relation = "hierarchical";
      if(!n.style) n.style = "normal";
      if(!n.sourceSide) n.sourceSide = "auto";
      if(!n.targetSide) n.targetSide = "auto";
      if(typeof n.custom !== "boolean") n.custom = false;
    });
    parsed.collapsedNodes ||= {};
    parsed.expanded ||= {};
    GROUPS.forEach(g => {
      if(typeof parsed.expanded[g] !== "boolean") parsed.expanded[g] = false;
    });
    if(typeof parsed.zoom !== "number") parsed.zoom = 1;
    parsed.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, parsed.zoom));
    parsed.schemaVersion ||= 3;
    return parsed;
  }

  function migrateLegacyState(parsed){
    const fromSchema = parsed.schemaVersion || 0;
    parsed = normalizeState(parsed);

    // IDs que ya existían antes de incorporar la versión nueva.
    const existing = new Set(parsed.nodes.map(n => n.id));

    // Se agregan casillas institucionales que pudieran faltar,
    // conservando los movimientos que el usuario ya hubiese realizado.
    baseNodes.forEach(base => {
      if(!existing.has(base.id)) parsed.nodes.push(deepClone(base));
    });

    // Desde V8 se reserva espacio para la nueva Vicerrectoría.
    // Solo se desplazan las casillas de Facultades que ya existían:
    // las casillas recién incorporadas ya vienen en su nueva posición base.
    if(fromSchema < 8){
      parsed.nodes.forEach(n => {
        if(existing.has(n.id) && (n.group === "facultades" || n.id === "facultades")){
          n.x += FACULTY_SHIFT;
        }
      });
    }

    const get = id => parsed.nodes.find(n => n.id === id);

    // Corrección institucional: Certificación y Gestión Documental depende de Secretaría General.
    const cert = get("certificacion");
    if(cert){
      cert.parent = "secretaria";
      cert.group = "rectoria";
      cert.sourceSide = "bottom";
      cert.targetSide = "top";
    }

    // Las cuatro ramas principales salen ordenadamente desde abajo de Consejo Académico.
    ["vie","vacad","vadmin","vproyeccion","facultades"].forEach(id => {
      const n = get(id);
      if(n){
        n.parent = "academico";
        n.sourceSide = "bottom";
        n.targetSide = "top";
      }
    });

    // Las cuatro facultades salen desde abajo de la casilla FACULTADES.
    ["fac-ciencias","fac-humanas","fac-ingenierias","fac-salud","fac-agrarias"].forEach(id => {
      const n = get(id);
      if(n){
        n.parent = "facultades";
        n.sourceSide = "bottom";
        n.targetSide = "top";
      }
    });

    // Evita que los departamentos tapen la casilla Escuela de Medicina.
    const medicina = get("medicina");
    if(medicina){
      const deptIds = ["ciencias-basicas","cirugia","gineco","med-interna","patologia","pediatria","salud-mental","salud-publica"];
      let yy = medicina.y + medicina.h + 8;
      deptIds.forEach(id => {
        const d = get(id);
        if(d && d.y < yy){
          d.y = yy;
          d.x = medicina.x;
        }
        if(d) yy = Math.max(yy, d.y) + d.h + 7;
      });
    }

    const regencia = get("regencia");
    if(regencia && regencia.x >= 2000){
      regencia.x = 1880;
      regencia.y = 1215;
      regencia.sourceSide = "bottom";
      regencia.targetSide = "top";
    }

    // Estilos de los nuevos bloques:
    // encabezados nuevos = amarillo; dependencias = blanco.
    const agrarias = get("fac-agrarias");
    if(agrarias) agrarias.style = "new";

    // V9: corregir la estructura del bloque Agroindustrial.
    // Se conserva la posición que el usuario haya dado al cuadro padre.
    const programasAgro = get("programas-agroindustrial");
    if(programasAgro){
      programasAgro.label = "Programas del área Agroindustrial\npor ciclos propedéuticos";
      programasAgro.h = 58;
      programasAgro.style = "sublevel";

      const agroChildren = [
        ["tecnico-produccion-agropecuaria", 70],
        ["tecnologia-agroindustrial", 136],
        ["administracion-agroindustrial", 190]
      ];

      agroChildren.forEach(([id, offsetY]) => {
        const child = get(id);
        if(child){
          child.parent = "programas-agroindustrial";
          child.group = "facultades";
          child.style = "sublevel";
          child.sourceSide = "bottom";
          child.targetSide = "top";

          // Si viene de una versión anterior, colocar las nuevas carreras
          // debajo del padre, incluso si el usuario ya había movido ese padre.
          if(fromSchema < 9){
            child.x = programasAgro.x;
            child.y = programasAgro.y + offsetY;
          }
        }
      });
    }

    const habitat = get("habitat-territorio");
    if(habitat) habitat.style = "new";

    const vproyeccion = get("vproyeccion");
    if(vproyeccion) vproyeccion.style = "new";

    [
      "comite-proyeccion","educacion-buen-vivir",
      "extension-regionalizacion","sedes-regionales","amovi"
    ].forEach(id => {
      const n = get(id);
      if(n) n.style = "sublevel";
    });

    // V11: corregir la posición visual de los subprogramas.
    // Se conserva el desplazamiento global de cada Facultad, pero se restablece
    // la posición relativa interna de sus dependencias para que queden debajo
    // de la unidad a la que realmente pertenecen.
    if(fromSchema < 11){
      const restoreFacultyGeometry = (facultyId, nodeIds) => {
        const currentFaculty = get(facultyId);
        const baseFaculty = baseNodes.find(n => n.id === facultyId);
        if(!currentFaculty || !baseFaculty) return;

        const dx = currentFaculty.x - baseFaculty.x;
        const dy = currentFaculty.y - baseFaculty.y;

        nodeIds.forEach(id => {
          const current = get(id);
          const base = baseNodes.find(n => n.id === id);
          if(!current || !base) return;

          current.x = base.x + dx;
          current.y = base.y + dy;
          current.w = base.w;
          current.h = base.h;
          current.parent = base.parent;
          current.group = base.group;
          current.style = base.style;
          current.sourceSide = base.sourceSide || "auto";
          current.targetSide = base.targetSide || "auto";
        });
      };

      restoreFacultyGeometry("fac-humanas", [
        "fch-consejo","lenguas","derecho","gestion-judicial",
        "economia","educacion","historia","idiomas","trabajo-social",
        "filosofia","deportes","admin-finanzas","musica",
        "carrera-musica","artes-plasticas"
      ]);

      restoreFacultyGeometry("fac-ingenierias", [
        "fi-consejo","diseno","civil","electrica","industriales",
        "tecnologia-empresarial","gestion-empresarial","mecanica",
        "sistemas","inteligencia-artificial","geologia","metalurgica",
        "petroleos","ing-quimica","alimentos","habitat-territorio",
        "ing-construccion","arquitectura","admin-turistica-hotelera"
      ]);
    }

    // V12: eliminar la antigua Escuela de Artes y consolidar la nueva
    // Escuela de Artes y Música con dos carreras independientes.
    const oldArtesIndex = parsed.nodes.findIndex(n => n.id === "artes");
    if(oldArtesIndex >= 0){
      parsed.nodes.splice(oldArtesIndex, 1);
    }

    const musica = get("musica");
    if(musica){
      musica.label = "Escuela de Artes y Música";
      musica.style = "new";
      musica.parent = "fac-humanas";
      musica.group = "facultades";
    }

    const carreraMusica = get("carrera-musica");
    if(carreraMusica){
      carreraMusica.label = "Música";
      carreraMusica.parent = "musica";
      carreraMusica.group = "facultades";
      carreraMusica.style = "sublevel";
      carreraMusica.sourceSide = "bottom";
      carreraMusica.targetSide = "top";
    }

    const artesPlasticas = get("artes-plasticas");
    if(artesPlasticas){
      artesPlasticas.parent = "musica";
      artesPlasticas.group = "facultades";
      artesPlasticas.style = "sublevel";
      artesPlasticas.sourceSide = "bottom";
      artesPlasticas.targetSide = "top";
    }

    // V10: nuevas incorporaciones derivadas de los mensajes.
    if(musica) musica.style = "new";

    const regenciaV10 = get("regencia");
    if(regenciaV10){
      regenciaV10.label = "Tecnología en Regencia de Farmacia";
      regenciaV10.style = "sublevel";
      regenciaV10.w = 205;
      regenciaV10.h = 40;
      regenciaV10.parent = "fac-salud";
      regenciaV10.group = "facultades";
      regenciaV10.sourceSide = "bottom";
      regenciaV10.targetSide = "top";
    }

    [
      "ing-forestal","zootecnia","med-veterinaria","ing-agronomica",
      "programas-agroindustrial","tecnico-produccion-agropecuaria",
      "tecnologia-agroindustrial","administracion-agroindustrial",
      "alimentos","ing-construccion","arquitectura",
      "admin-turistica-hotelera","carrera-musica","artes-plasticas",
      "gestion-judicial","tecnologia-empresarial",
      "gestion-empresarial","inteligencia-artificial",
      "regencia"
    ].forEach(id => {
      const n = get(id);
      if(n) n.style = "sublevel";
    });

    parsed.schemaVersion = SCHEMA_VERSION;
    return parsed;
  }

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(Array.isArray(parsed.nodes) && parsed.expanded){
          const normalized = normalizeState(parsed);

          // Si viene de una versión anterior, incorporar las nuevas dependencias
          // sin perder las posiciones que el usuario ya haya editado.
          if((normalized.schemaVersion || 0) < SCHEMA_VERSION){
            const migrated = migrateLegacyState(normalized);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            return migrated;
          }

          return normalized;
        }
      }

      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if(legacyRaw){
        const legacy = JSON.parse(legacyRaw);
        if(Array.isArray(legacy.nodes) && legacy.expanded){
          const migrated = migrateLegacyState(legacy);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      }

      return deepClone(baseState);
    }catch(e){
      return deepClone(baseState);
    }
  }

  function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function byId(id){ return state.nodes.find(n => n.id === id); }
  function childrenOf(id){ return state.nodes.filter(n => n.parent === id); }

  // Devuelve TODOS los descendientes de una casilla, no solo los hijos directos.
  // Ej.: Facultad de Salud -> Escuela de Medicina -> Departamentos.
  function descendantsOf(id){
    const result = [];
    const visited = new Set([id]);
    const queue = [id];

    while(queue.length){
      const parentId = queue.shift();
      childrenOf(parentId).forEach(child => {
        if(visited.has(child.id)) return;
        visited.add(child.id);
        result.push(child);
        queue.push(child.id);
      });
    }

    return result;
  }

  // Mueve una casilla y toda su rama exactamente el mismo delta.
  // También actualiza descendientes ocultos/contraídos porque trabaja sobre state.nodes.
  function moveBranch(rootId, dx, dy){
    const root = byId(rootId);
    if(!root) return;

    const branch = [root, ...descendantsOf(rootId)];

    // No permitir que ningún elemento de la rama salga por arriba/izquierda.
    const minX = Math.min(...branch.map(n => n.x));
    const minY = Math.min(...branch.map(n => n.y));
    const safeDx = Math.max(dx, 5 - minX);
    const safeDy = Math.max(dy, 5 - minY);

    branch.forEach(n => {
      n.x += safeDx;
      n.y += safeDy;
    });
  }

  function isNodeCollapsedByParent(node){
    let p = node.parent;
    while(p){
      if(state.collapsedNodes[p]) return true;
      p = byId(p)?.parent || null;
    }
    return false;
  }

  function isVisible(node){
    if(node.group !== "core" && !state.expanded[node.group]) return false;
    if(isNodeCollapsedByParent(node)) return false;
    return true;
  }

  function hasExpandableContent(node){
    if(GROUP_BY_CORE[node.id]) return true;
    return childrenOf(node.id).length > 0;
  }

  function isExpandedForNode(node){
    const g = GROUP_BY_CORE[node.id];
    if(g) return !!state.expanded[g];
    return !state.collapsedNodes[node.id];
  }

  function nodeBranch(node){
    if(node.group && node.group !== "core") return node.group;
    if(node.id === "vie") return "investigacion";
    if(node.id === "vacad") return "vacademica";
    if(node.id === "vadmin") return "administrativa";
    if(node.id === "vproyeccion") return "proyeccion";
    if(node.id === "facultades") return "facultades";
    if(node.id === "rectoria") return "rectoria";
    return "core";
  }

  function render(){
    nodesLayer.innerHTML = "";
    canvas.classList.toggle("editing", editMode);

    state.nodes.forEach(node => {
      if(!isVisible(node)) return;

      if(node.kind === "model-frame"){
        const frame = document.createElement("div");
        frame.className = "model-frame";
        frame.style.left = node.x + "px";
        frame.style.top = node.y + "px";
        frame.style.width = node.w + "px";
        frame.style.height = node.h + "px";
        frame.textContent = node.label;
        nodesLayer.appendChild(frame);
        return;
      }

      const el = document.createElement("button");
      el.type = "button";
      el.className = "org-node";
      el.dataset.id = node.id;
      el.style.left = node.x + "px";
      el.style.top = node.y + "px";
      el.style.width = node.w + "px";
      el.style.height = node.h + "px";

      const branch = nodeBranch(node);
      if(branchClass[branch]) el.classList.add(branchClass[branch]);
      if(node.kind === "main") el.classList.add("main", node.css || "dark");
      if(node.kind === "faculty-header") el.classList.add("faculty-header");
      if(node.kind === "model-item") el.classList.add("model-item");
      if(node.style === "sublevel") el.classList.add("sublevel");
      if(node.style === "new") el.classList.add("new-node");
      if(node.relation === "advisory") el.classList.add("advisory");
      if(selectedId === node.id) el.classList.add("selected");
      if(editMode) el.classList.add("editable");

      const span = document.createElement("span");
      span.className = "label";
      node.label.split("\n").forEach((part,i) => {
        if(i) span.appendChild(document.createElement("br"));
        span.appendChild(document.createTextNode(part));
      });
      el.appendChild(span);

      if(hasExpandableContent(node) && !editMode){
        const badge = document.createElement("span");
        badge.className = "toggle-badge";
        badge.textContent = isExpandedForNode(node) ? "−" : "+";
        el.appendChild(badge);
      }

      el.addEventListener("click", ev => onNodeClick(ev,node));
      el.addEventListener("dblclick", ev => {
        if(!editMode) return;
        ev.preventDefault();
        selectNode(node.id);
        openRename();
      });

      if(node.kind !== "model-item" || editMode){
        el.addEventListener("pointerdown", ev => startDrag(ev,node,el));
      }

      nodesLayer.appendChild(el);
    });

    resizeCanvas();
    requestAnimationFrame(drawConnections);
    updateEditButtons();
  }

  function onNodeClick(ev,node){
    ev.stopPropagation();

    if(editMode){
      selectNode(node.id);
      return;
    }

    const group = GROUP_BY_CORE[node.id];
    if(group){
      state.expanded[group] = !state.expanded[group];
      saveState();
      render();
      return;
    }

    if(childrenOf(node.id).length){
      state.collapsedNodes[node.id] = !state.collapsedNodes[node.id];
      saveState();
      render();
    }
  }

  function selectNode(id){
    selectedId = id;
    selectedLinkChildId = null;
    render();
  }

  function selectLink(childId){
    if(!editMode) return;
    selectedId = null;
    selectedLinkChildId = childId;
    render();
  }

  function updateEditButtons(){
    const node = selectedId ? byId(selectedId) : null;
    const hasNode = !!node;
    const hasEditableLink = !!selectedLinkChildId || !!(node && node.parent);

    renameBtn.disabled = !hasNode;
    parentBtn.disabled = !hasNode || !node.parent || PROTECTED_NODES.has(node.id);
    linkBtn.disabled = !hasEditableLink;
    deleteBtn.disabled = !hasNode || PROTECTED_NODES.has(node.id);
  }

  function startDrag(ev,node,el){
    if(!editMode || ev.button !== 0) return;
    ev.preventDefault();
    selectNodeWithoutRender(node.id);

    const rect = canvas.getBoundingClientRect();
    const branch = [node, ...descendantsOf(node.id)];
    const startPositions = new Map(
      branch.map(item => [item.id, {x:item.x, y:item.y}])
    );

    drag = {
      id:node.id,
      branchIds:branch.map(item => item.id),
      startPositions,
      pointerId:ev.pointerId,
      startClientX:ev.clientX,
      startClientY:ev.clientY,
      startX:node.x,
      startY:node.y,
      minStartX:Math.min(...branch.map(item => item.x)),
      minStartY:Math.min(...branch.map(item => item.y)),
      canvasScale:rect.width / CANVAS_WIDTH
    };

    el.setPointerCapture(ev.pointerId);
    el.addEventListener("pointermove", moveDrag);
    el.addEventListener("pointerup", endDrag, {once:true});
    el.addEventListener("pointercancel", endDrag, {once:true});
  }

  function selectNodeWithoutRender(id){
    selectedId = id;
    selectedLinkChildId = null;
    document.querySelectorAll(".org-node").forEach(el => {
      el.classList.toggle("selected",el.dataset.id === id);
    });
    drawConnections();
    updateEditButtons();
  }

  function moveDrag(ev){
    if(!drag || ev.pointerId !== drag.pointerId) return;
    const root = byId(drag.id);
    if(!root) return;

    const scale = drag.canvasScale || 1;
    const rawDx = (ev.clientX - drag.startClientX)/scale;
    const rawDy = (ev.clientY - drag.startClientY)/scale;

    // Snap calculado desde la casilla que se está agarrando.
    const snappedRootX = Math.round((drag.startX + rawDx)/GRID)*GRID;
    const snappedRootY = Math.round((drag.startY + rawDy)/GRID)*GRID;
    let deltaX = snappedRootX - drag.startX;
    let deltaY = snappedRootY - drag.startY;

    // Evita sacar cualquier descendiente fuera del lienzo por arriba/izquierda.
    deltaX = Math.max(deltaX, 5 - drag.minStartX);
    deltaY = Math.max(deltaY, 5 - drag.minStartY);

    // MUY IMPORTANTE: cada posición se recalcula desde la foto inicial del drag,
    // para que toda la rama se mueva exactamente junta y no acumule errores.
    drag.branchIds.forEach(id => {
      const item = byId(id);
      const start = drag.startPositions.get(id);
      if(!item || !start) return;

      item.x = start.x + deltaX;
      item.y = start.y + deltaY;

      const itemEl = document.querySelector(`.org-node[data-id="${CSS.escape(id)}"]`);
      if(itemEl){
        itemEl.style.left = item.x + "px";
        itemEl.style.top = item.y + "px";
      }
    });

    resizeCanvas();
    drawConnections();
  }

  function endDrag(ev){
    if(!drag) return;
    const el = ev.currentTarget;
    try{ el.releasePointerCapture(drag.pointerId); }catch(e){}
    el.removeEventListener("pointermove", moveDrag);
    drag = null;
    saveState();
    drawConnections();
  }

  function nodeRect(node){
    return {
      x:node.x, y:node.y, w:node.w, h:node.h,
      cx:node.x+node.w/2, cy:node.y+node.h/2
    };
  }

  function resolveAutoSides(parent, child, sourceSide, targetSide){
    const p=nodeRect(parent), c=nodeRect(child);
    const dx=c.cx-p.cx, dy=c.cy-p.cy;

    if(sourceSide === "auto" && targetSide === "auto"){
      if(Math.abs(dx) > Math.abs(dy)*1.25){
        return dx >= 0
          ? {source:"right", target:"left"}
          : {source:"left", target:"right"};
      }
      return dy >= 0
        ? {source:"bottom", target:"top"}
        : {source:"top", target:"bottom"};
    }

    const opposite = {top:"bottom",bottom:"top",left:"right",right:"left"};

    if(sourceSide === "auto"){
      if(targetSide !== "auto") sourceSide = opposite[targetSide];
      else sourceSide = dy >= 0 ? "bottom" : "top";
    }

    if(targetSide === "auto"){
      targetSide = opposite[sourceSide] || (dy >= 0 ? "top" : "bottom");
    }

    return {source:sourceSide, target:targetSide};
  }

  function anchorPoint(rect, side){
    if(side === "top") return {x:rect.cx, y:rect.y};
    if(side === "bottom") return {x:rect.cx, y:rect.y+rect.h};
    if(side === "left") return {x:rect.x, y:rect.cy};
    return {x:rect.x+rect.w, y:rect.cy}; // right
  }

  function pathFor(parent, child){
    const p=nodeRect(parent), c=nodeRect(child);
    let sourceSide = child.sourceSide || "auto";
    let targetSide = child.targetSide || "auto";

    // Si el usuario no ha fijado manualmente el anclaje, estas dos ramas
    // siempre salen desde abajo para conservar la lectura limpia del organigrama.
    if(sourceSide === "auto" && ["academico","facultades"].includes(parent.id)){
      sourceSide = "bottom";
      if(targetSide === "auto") targetSide = "top";
    }

    const sides = resolveAutoSides(
      parent,
      child,
      sourceSide,
      targetSide
    );

    const a = anchorPoint(p, sides.source);
    const b = anchorPoint(c, sides.target);
    const sourceHorizontal = ["left","right"].includes(sides.source);
    const targetHorizontal = ["left","right"].includes(sides.target);

    if(sourceHorizontal && targetHorizontal){
      const midX = a.x + (b.x-a.x)*0.5;
      return `M ${a.x} ${a.y} H ${midX} V ${b.y} H ${b.x}`;
    }

    if(!sourceHorizontal && !targetHorizontal){
      const midY = a.y + (b.y-a.y)*0.5;
      return `M ${a.x} ${a.y} V ${midY} H ${b.x} V ${b.y}`;
    }

    if(sourceHorizontal){
      return `M ${a.x} ${a.y} H ${b.x} V ${b.y}`;
    }

    return `M ${a.x} ${a.y} V ${b.y} H ${b.x}`;
  }

  function drawConnections(){
    const visibleIds = new Set(state.nodes.filter(isVisible).map(n=>n.id));
    const height = parseFloat(canvas.style.height) || canvas.clientHeight || 650;

    svg.setAttribute("viewBox",`0 0 ${CANVAS_WIDTH} ${height}`);
    svg.innerHTML="";

    state.nodes.forEach(node => {
      if(!visibleIds.has(node.id) || !node.parent || !visibleIds.has(node.parent)) return;
      const parent=byId(node.parent);
      if(!parent) return;

      const d = pathFor(parent,node);

      // Línea invisible más ancha para que sea fácil seleccionarla con el mouse.
      const hit=document.createElementNS("http://www.w3.org/2000/svg","path");
      hit.setAttribute("d",d);
      hit.setAttribute("class","connector-hit");
      hit.dataset.childId=node.id;
      hit.addEventListener("click",ev=>{
        if(!editMode) return;
        ev.stopPropagation();
        selectLink(node.id);
      });
      svg.appendChild(hit);

      const path=document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d",d);

      let cls="connector";
      if(node.relation==="advisory") cls += " advisory";

      // Las líneas que bajan desde Consejo Académico conservan el verde institucional.
      // El color de rama se aplica en los niveles internos.
      if(node.group !== "core"){
        const br=nodeBranch(node);
        if(connectionBranchClass[br]) cls += " "+connectionBranchClass[br];
      }

      if(selectedLinkChildId === node.id) cls += " selected-link";
      path.setAttribute("class",cls);

      const title=document.createElementNS("http://www.w3.org/2000/svg","title");
      title.textContent=`${parent.label.replaceAll("\n"," ")} → ${node.label.replaceAll("\n"," ")}`;
      path.appendChild(title);

      svg.appendChild(path);
    });
  }

  function resizeCanvas(){
    const visible = state.nodes.filter(isVisible);
    let maxY=610;
    visible.forEach(n => maxY=Math.max(maxY,n.y+n.h+70));
    canvas.style.height=Math.min(Math.max(maxY,650),1800)+"px";
    updateZoomStage();
  }

  function clampZoom(value){
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  }

  function updateZoomStage(){
    const zoom = clampZoom(state.zoom || 1);
    const logicalHeight = parseFloat(canvas.style.height) || 650;

    canvas.style.transform = `scale(${zoom})`;
    stage.style.width = (CANVAS_WIDTH * zoom) + "px";
    stage.style.height = (logicalHeight * zoom) + "px";
    zoomValue.textContent = Math.round(zoom * 100) + "%";

    zoomOutBtn.disabled = zoom <= MIN_ZOOM + 0.001;
    zoomInBtn.disabled = zoom >= MAX_ZOOM - 0.001;
  }

  function setZoom(value, persist=true){
    state.zoom = clampZoom(Math.round(value * 100) / 100);
    updateZoomStage();
    if(persist) saveState();
  }

  function fitToWidth(){
    const available = Math.max(320, shell.clientWidth - 24);
    // "Ajustar" reduce cuando hace falta, pero no agranda por encima del 100 %.
    setZoom(Math.min(1, available / CANVAS_WIDTH));
    shell.scrollTo({left:0, top:0, behavior:"smooth"});
  }

  function setEditMode(value){
    editMode=value;
    editBar.classList.toggle("is-hidden",!value);
    editBtn.classList.toggle("active",value);
    editBtn.textContent=value?"✓ Editando":"✎ Editar organigrama";

    if(!value){
      selectedId=null;
      selectedLinkChildId=null;
    }

    render();
  }

  function fillParents(excludeId=null){
    parentSelect.innerHTML="";

    state.nodes
      .filter(n => n.kind !== "model-frame")
      .forEach(n=>{
        if(n.id===excludeId) return;
        if(excludeId && isDescendant(excludeId,n.id)) return;

        const option=document.createElement("option");
        option.value=n.id;
        option.textContent=n.label.replaceAll("\n"," ");
        parentSelect.appendChild(option);
      });
  }

  function isDescendant(ancestorId, candidateId){
    let p=byId(candidateId)?.parent;
    while(p){
      if(p===ancestorId) return true;
      p=byId(p)?.parent || null;
    }
    return false;
  }

  function inheritedGroup(parent){
    if(!parent) return "core";
    if(parent.group!=="core") return parent.group;
    return GROUP_BY_CORE[parent.id] || "core";
  }

  function setDialogVisibility({
    label=true,
    parent=true,
    style=true,
    relation=true,
    anchors=false,
    newHint=false
  }={}){
    labelWrap.classList.toggle("is-hidden",!label);
    parentWrap.classList.toggle("is-hidden",!parent);
    styleWrap.classList.toggle("is-hidden",!style);
    relationWrap.classList.toggle("is-hidden",!relation);
    anchorWrap.classList.toggle("is-hidden",!anchors);
    newNodeHint.classList.toggle("is-hidden",!newHint);
  }

  function openAdd(){
    dialogMode="add";
    dialogTitle.textContent="Agregar nueva casilla";
    parentLabel.textContent="Depende de";
    setDialogVisibility({label:true,parent:true,style:false,relation:true,anchors:true,newHint:true});

    labelInput.value="";
    fillParents();
    parentSelect.value=selectedId || "academico";
    relationSelect.value="hierarchical";
    styleSelect.value="new";
    sourceSideSelect.value="auto";
    targetSideSelect.value="auto";

    dialog.showModal();
    setTimeout(()=>labelInput.focus(),30);
  }

  function openRename(){
    if(!selectedId) return;
    const node=byId(selectedId);
    if(!node) return;

    dialogMode="rename";
    dialogTitle.textContent="Editar casilla";
    parentLabel.textContent="Depende de";
    setDialogVisibility({label:true,parent:false,style:true,relation:true,anchors:false,newHint:false});

    labelInput.value=node.label.replaceAll("\n"," ");
    relationSelect.value=node.relation || "hierarchical";
    styleSelect.value=node.style || "normal";

    dialog.showModal();
    setTimeout(()=>labelInput.select(),30);
  }

  function openChangeParent(){
    if(!selectedId) return;
    const node=byId(selectedId);
    if(!node || !node.parent) return;

    dialogMode="parent";
    dialogTitle.textContent="Cambiar dependencia";
    parentLabel.textContent="Depende de";
    setDialogVisibility({label:true,parent:true,style:true,relation:true,anchors:true,newHint:false});

    labelInput.value=node.label.replaceAll("\n"," ");
    fillParents(selectedId);
    parentSelect.value=node.parent;
    relationSelect.value=node.relation || "hierarchical";
    styleSelect.value=node.style || "normal";
    sourceSideSelect.value=node.sourceSide || "auto";
    targetSideSelect.value=node.targetSide || "auto";

    dialog.showModal();
  }

  function openEditLink(){
    const childId = selectedLinkChildId || (selectedId && byId(selectedId)?.parent ? selectedId : null);
    if(!childId) return;

    const node=byId(childId);
    if(!node || !node.parent) return;

    selectedLinkChildId = childId;
    selectedId = null;

    dialogMode="link";
    dialogTitle.textContent="Editar enlace";
    parentLabel.textContent="La línea viene de";
    setDialogVisibility({label:false,parent:true,style:false,relation:true,anchors:true,newHint:false});

    // Se conserva el valor aunque el campo esté oculto.
    labelInput.value=node.label.replaceAll("\n"," ");
    fillParents(node.id);
    parentSelect.value=node.parent;
    relationSelect.value=node.relation || "hierarchical";
    sourceSideSelect.value=node.sourceSide || "auto";
    targetSideSelect.value=node.targetSide || "auto";

    dialog.showModal();
  }

  function saveDialog(){
    let node = selectedId ? byId(selectedId) : null;
    const cleanLabel=labelInput.value.trim().replace(/\s*\n\s*/g," ");

    if(dialogMode==="add"){
      if(!cleanLabel){labelInput.focus();return;}

      const parent=byId(parentSelect.value);
      if(!parent) return;

      const id="custom-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
      const group=inheritedGroup(parent);
      if(group!=="core") state.expanded[group]=true;

      const siblings=childrenOf(parent.id);
      const offset=siblings.length*18;

      state.nodes.push({
        id,
        label:cleanLabel,
        x:Math.max(10,parent.x+20+offset),
        y:parent.y+parent.h+65+offset,
        w:Math.max(190,Math.min(330,parent.w)),
        h:46,
        parent:parent.id,
        group,
        kind:"normal",
        relation:relationSelect.value,
        style:"new",             // Todo elemento recién creado queda amarillo
        sourceSide:
          sourceSideSelect.value === "auto" && ["academico","facultades"].includes(parent.id)
            ? "bottom"
            : sourceSideSelect.value,
        targetSide:
          targetSideSelect.value === "auto" && ["academico","facultades"].includes(parent.id)
            ? "top"
            : targetSideSelect.value,
        css:"",
        custom:true
      });

      selectedId=id;
      selectedLinkChildId=null;
    }

    else if(dialogMode==="rename"){
      if(!node || !cleanLabel){labelInput.focus();return;}
      node.label=cleanLabel;
      node.relation=relationSelect.value;
      node.style=styleSelect.value;
    }

    else if(dialogMode==="parent"){
      if(!node || !cleanLabel){labelInput.focus();return;}
      const newParent=byId(parentSelect.value);
      if(!newParent) return;

      node.label=cleanLabel;
      node.parent=newParent.id;
      node.group=inheritedGroup(newParent);
      node.relation=relationSelect.value;
      node.style=styleSelect.value;
      node.sourceSide =
        sourceSideSelect.value === "auto" && ["academico","facultades"].includes(newParent.id)
          ? "bottom"
          : sourceSideSelect.value;
      node.targetSide =
        targetSideSelect.value === "auto" && ["academico","facultades"].includes(newParent.id)
          ? "top"
          : targetSideSelect.value;

      if(node.group!=="core") state.expanded[node.group]=true;
    }

    else if(dialogMode==="link"){
      const childId = selectedLinkChildId;
      node = byId(childId);
      if(!node) return;

      const newParent=byId(parentSelect.value);
      if(!newParent) return;

      node.parent=newParent.id;
      node.group=inheritedGroup(newParent);
      node.relation=relationSelect.value;
      node.sourceSide =
        sourceSideSelect.value === "auto" && ["academico","facultades"].includes(newParent.id)
          ? "bottom"
          : sourceSideSelect.value;
      node.targetSide =
        targetSideSelect.value === "auto" && ["academico","facultades"].includes(newParent.id)
          ? "top"
          : targetSideSelect.value;

      if(node.group!=="core") state.expanded[node.group]=true;
    }

    saveState();
    dialog.close();
    render();
  }

  function deleteSelected(){
    if(!selectedId) return;
    const node=byId(selectedId);
    if(!node) return;

    const descendants=[];
    const collect=id=>childrenOf(id).forEach(ch=>{descendants.push(ch.id);collect(ch.id)});
    collect(node.id);

    const extra=descendants.length
      ? `\nTambién se eliminarán ${descendants.length} casilla(s) dependiente(s).`
      : "";

    if(!confirm(`¿Eliminar “${node.label.replaceAll("\n"," ")}”?${extra}`)) return;

    const remove=new Set([selectedId,...descendants]);
    state.nodes=state.nodes.filter(n=>!remove.has(n.id));
    selectedId=null;
    selectedLinkChildId=null;
    saveState();
    render();
  }

  zoomOutBtn.addEventListener("click",()=>setZoom((state.zoom || 1) - ZOOM_STEP));
  zoomInBtn.addEventListener("click",()=>setZoom((state.zoom || 1) + ZOOM_STEP));
  fitBtn.addEventListener("click",fitToWidth);

  editBtn.addEventListener("click",()=>setEditMode(!editMode));
  doneBtn.addEventListener("click",()=>setEditMode(false));
  addBtn.addEventListener("click",openAdd);
  renameBtn.addEventListener("click",openRename);
  parentBtn.addEventListener("click",openChangeParent);
  linkBtn.addEventListener("click",openEditLink);
  deleteBtn.addEventListener("click",deleteSelected);
  saveDialogBtn.addEventListener("click",saveDialog);

  expandBtn.addEventListener("click",()=>{
    GROUPS.forEach(g=>state.expanded[g]=true);
    state.collapsedNodes={};
    saveState();
    render();
  });

  collapseBtn.addEventListener("click",()=>{
    GROUPS.forEach(g=>state.expanded[g]=false);
    state.collapsedNodes={};
    selectedId=null;
    selectedLinkChildId=null;
    saveState();
    render();
  });

  resetBtn.addEventListener("click",()=>{
    if(!confirm("¿Restablecer el organigrama a la distribución inicial? Se eliminarán las casillas, enlaces y movimientos guardados.")) return;

    const currentZoom = state.zoom || 1;
    state=deepClone(baseState);
    state.zoom=currentZoom;
    selectedId=null;
    selectedLinkChildId=null;
    localStorage.removeItem(STORAGE_KEY);
    render();
  });

  canvas.addEventListener("click",()=>{
    if(editMode){
      selectedId=null;
      selectedLinkChildId=null;
      render();
    }
  });

  window.addEventListener("resize",()=>{ updateZoomStage(); drawConnections(); });

  // Mover con flechas del teclado mientras se edita.
  window.addEventListener("keydown",ev=>{
    if(
      !editMode ||
      !selectedId ||
      ["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)
    ) return;

    const node=byId(selectedId);
    if(!node) return;

    const step=ev.shiftKey?20:5;
    let dx=0, dy=0;

    if(ev.key==="ArrowLeft") dx=-step;
    else if(ev.key==="ArrowRight") dx=step;
    else if(ev.key==="ArrowUp") dy=-step;
    else if(ev.key==="ArrowDown") dy=step;
    else return;

    ev.preventDefault();
    moveBranch(selectedId, dx, dy);
    saveState();
    render();
  });

  render();

  requestAnimationFrame(()=>{
    shell.scrollLeft=Math.max(0,(CANVAS_WIDTH-shell.clientWidth)/2-120);
  });
  updateZoomStage();
})();
