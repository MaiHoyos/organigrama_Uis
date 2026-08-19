(() => {
  "use strict";

  const STORAGE_KEY = "uis-organigrama-canvas-v4";
  const LEGACY_STORAGE_KEY = "uis-organigrama-canvas-v3";
  const SCHEMA_VERSION = 23;
  const CANVAS_WIDTH = 2300;
  const MIN_ZOOM = 0.35;
  const MAX_ZOOM = 1.50;
  const ZOOM_STEP = 0.10;
  const GRID = 5;
  const FACULTY_SHIFT = 160;

  const GROUPS = ["rectoria", "cultura-bienestar", "investigacion", "vacademica", "administrativa", "facultades"];
  const GROUP_BY_CORE = {
    rectoria: "rectoria",
    vbienestar: "cultura-bienestar",
    vie: "investigacion",
    vacad: "vacademica",
    vadmin: "administrativa",
    facultades: "facultades"
  };

  const branchClass = {
    rectoria: "branch-rectoria",
    "cultura-bienestar": "branch-wellbeing",
    investigacion: "branch-turq",
    vacademica: "branch-blue",
    administrativa: "branch-admin",
    facultades: "branch-purple",
    core: ""
  };

  const connectionBranchClass = {
    "cultura-bienestar": "branch-wellbeing",
    investigacion: "branch-turq",
    vacademica: "branch-blue",
    administrativa: "branch-admin",
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

  // NUEVA Vicerrectoría. Amarilla por corresponder a una unidad nueva.
  add("vbienestar", "VICERRECTORÍA DE\nCULTURA Y BIENESTAR", 20, 355, 300, 72, "academico", {
    kind:"main",
    style:"new",
    sourceSide:"bottom",
    targetSide:"top"
  });

  add("vie", "VICERRECTORÍA DE\nINVESTIGACIÓN Y EXTENSIÓN", 365, 355, 325, 72, "academico", {kind:"main", css:"turq", sourceSide:"bottom", targetSide:"top"});
  add("vacad", "VICERRECTORÍA\nACADÉMICA", 745, 355, 300, 72, "academico", {kind:"main", css:"blue", sourceSide:"bottom", targetSide:"top"});
  add("vadmin", "VICERRECTORÍA\nADMINISTRATIVA", 1090, 355, 360, 72, "academico", {kind:"main", css:"admin", sourceSide:"bottom", targetSide:"top"});

  // Facultades se mantiene compacta y dentro del ancho del lienzo.
  add("facultades", "FACULTADES", 1650, 355, 235, 72, "academico", {kind:"main", css:"purple", sourceSide:"bottom", targetSide:"top"});

  // =========================
  // Rectoría: asesorías/apoyos
  // =========================
  // Instituto de Desarrollo Regional alineado verticalmente
  // con Planeación, Control Interno y UISALUD.
  add("idr", "Instituto de Desarrollo\nRegional", 500, 42, 230, 40, "rectoria", {
    group:"rectoria",
    relation:"advisory",
    style:"new"
  });
  add("uiaes", "Unidad de Información y\nAnálisis Estadístico - UIAES", 235, 100, 240, 47, "planeacion", {group:"rectoria", relation:"hierarchical", sourceSide:"left", targetSide:"right"});
  add("planeacion", "Planeación", 500, 100, 230, 40, "rectoria", {group:"rectoria", relation:"advisory"});
  add("control-gestion", "Dirección de Control Interno\ny Evaluación de Gestión", 500, 151, 230, 47, "rectoria", {group:"rectoria", relation:"advisory"});
  add("control-disciplinario", "Oficina de Control Interno\nDisciplinario", 500, 209, 230, 47, "rectoria", {group:"rectoria", relation:"advisory"});
  add("uisalud", "Unidad Especializada en Salud\n- UISALUD", 500, 267, 230, 47, "rectoria", {group:"rectoria", relation:"advisory"});

  // NUEVA dependencia de Rectoría.
  add("seccional-arauca", "Seccional Arauca", 1285, 42, 235, 40, "rectoria", {
    group:"rectoria",
    style:"new"
  });

  add("relaciones", "Relaciones Exteriores", 1285, 100, 235, 40, "rectoria", {group:"rectoria"});
  add("secretaria", "Secretaría General", 1285, 151, 235, 40, "rectoria", {group:"rectoria"});
  add("certificacion", "Dirección de Certificación\ny Gestión Documental", 1285, 202, 235, 47, "secretaria", {group:"rectoria", sourceSide:"bottom", targetSide:"top"});
  add("comunicaciones", "Dirección de Comunicaciones", 1285, 260, 235, 40, "rectoria", {group:"rectoria", relation:"advisory"});

  // =========================
  // Vicerrectoría de Investigación y Extensión
  // =========================
  let y = 460;
  const vieX = 370, vieW = 315, rowH = 45, gap = 8;
  [
    ["cie","Consejo de Investigación\ny Extensión"],
    ["ieia","Instituto de Estudios\nInterdisciplinarios y Acción"],
    ["transferencia","Estrategia para la Dirección de\nTransferencia de Conocimiento"],
    ["direcciones-ie","Direcciones de Investigación\ny Extensión de las Facultades"],
    ["comite-ie","Comité Operativo de\nInvestigación y Extensión"],
    ["programas","Coordinación de Programas\ny Proyectos"]
  ].forEach(([id,label]) => { add(id,label,vieX,y,vieW,rowH,"vie",{group:"investigacion"}); y += rowH+gap; });

  // =========================
  // Vicerrectoría de Cultura y Bienestar
  // =========================
  y = 460;
  const vbX = 20, vbW = 300;

  add("cultural","Dirección Cultural",vbX,y,vbW,rowH,"vbienestar",{
    group:"cultura-bienestar",
    style:"sublevel"
  });
  y += rowH + gap;

  add("bienestar","Bienestar Estudiantil",vbX,y,vbW,rowH,"vbienestar",{
    group:"cultura-bienestar",
    style:"sublevel"
  });
  y += rowH + gap;

  add("servicios-salud","Coordinación de Servicios Integrales\nde Salud y Desarrollo",40,y,260,52,"bienestar",{
    group:"cultura-bienestar",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 60;

  add("alimentacion","Coordinación de Servicios\nde Alimentación",40,y,260,47,"bienestar",{
    group:"cultura-bienestar",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });

  // =========================
  // Vicerrectoría Académica
  // =========================
  y = 460;
  const vaX = 745, vaW = 300;
  [
    ["posgrados","Dirección de Posgrados"],
    ["calidad","Coordinación de Evaluación\nde la Calidad"],
    ["admisiones","Dirección de Admisiones\ny Registro Académico"],
    ["biblioteca","Biblioteca"],
    ["cededuis","CEDEDUIS"]
  ].forEach(([id,label]) => { add(id,label,vaX,y,vaW,rowH,"vacad",{group:"vacademica"}); y += rowH+gap; });

  // Trasladado desde Investigación y renombrado.
  add("centro-tecnico","Escuela de Estudios\nTécnicos y Tecnológicos",vaX,y,vaW,52,"vacad",{
    group:"vacademica",
    style:"new"
  });
  y += 60;

  add("consejo-sedes","Consejo de Sedes",vaX,y,vaW,43,"vacad",{group:"vacademica",style:"new"}); y += 53;

  // ---------------------------------------------------------
  // Barrancabermeja
  // ---------------------------------------------------------
  add("barranca","Escuela de Formación y Desarrollo\nTerritorial Barrancabermeja",vaX+20,y,260,45,"consejo-sedes",{
    group:"vacademica",
    style:"new"
  });
  y += 53;

  add("inteligencia-artificial","Ingeniería en Inteligencia Artificial",vaX+40,y,220,46,"barranca",{
    group:"vacademica",
    style:"new",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 54;

  add("tecnico-fotovoltaico","Técnico en Fotovoltaico",vaX+40,y,220,42,"barranca",{
    group:"vacademica",
    style:"new",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 54;

  // ---------------------------------------------------------
  // Málaga: recibe la estructura que dependía de Ciencias Agrarias.
  // ---------------------------------------------------------
  add("malaga","Escuela de Formación y Desarrollo\nTerritorial Málaga",vaX+20,y,260,45,"consejo-sedes",{
    group:"vacademica",
    style:"new"
  });
  y += 53;

  [
    ["ing-forestal","Ing. Forestal",40],
    ["zootecnia","Zootecnia",40],
    ["med-veterinaria","Medicina Veterinaria",40],
    ["ing-agronomica","Ing. Agronómica",40]
  ].forEach(([id,label,h]) => {
    add(id,label,vaX+40,y,220,h,"malaga",{
      group:"vacademica",
      style:"sublevel",
      sourceSide:"bottom",
      targetSide:"top"
    });
    y += h + 8;
  });

  add("programas-agroindustrial","Programas del área Agroindustrial\npor ciclos propedéuticos",vaX+40,y,220,58,"malaga",{
    group:"vacademica",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 66;

  add("tecnico-produccion-agropecuaria","Técnico profesional en\nproducción agropecuaria",vaX+60,y,200,54,"programas-agroindustrial",{
    group:"vacademica",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 62;

  add("tecnologia-agroindustrial","Tecnología Agroindustrial",vaX+60,y,200,42,"programas-agroindustrial",{
    group:"vacademica",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 50;

  add("administracion-agroindustrial","Administración Agroindustrial",vaX+60,y,200,42,"programas-agroindustrial",{
    group:"vacademica",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 54;

  // ---------------------------------------------------------
  // Socorro: recibe Construcción, Arquitectura y Turismo.
  // ---------------------------------------------------------
  add("socorro","Escuela de Formación y Desarrollo\nTerritorial Socorro",vaX+20,y,260,45,"consejo-sedes",{
    group:"vacademica",
    style:"new"
  });
  y += 53;

  add("ing-construccion","Ing. Construcción",vaX+40,y,220,40,"socorro",{
    group:"vacademica",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 48;

  add("arquitectura","Arquitectura",vaX+40,y,220,40,"socorro",{
    group:"vacademica",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 48;

  add("admin-turistica-hotelera","Administración de Empresas\nTurísticas y Hoteleras",vaX+40,y,220,58,"socorro",{
    group:"vacademica",
    style:"sublevel",
    sourceSide:"bottom",
    targetSide:"top"
  });
  y += 66;

  // ---------------------------------------------------------
  // Barbosa: recibe Ingeniería en Alimentos.
  // ---------------------------------------------------------
  add("barbosa","Escuela de Formación y Desarrollo\nTerritorial Barbosa",vaX+20,y,260,45,"consejo-sedes",{
    group:"vacademica",
    style:"new"
  });
  y += 53;

  add("alimentos","Ing. en Alimentos",vaX+40,y,220,40,"barbosa",{
    group:"vacademica",
    style:"new",
    sourceSide:"bottom",
    targetSide:"top"
  });

  // =========================
  // Vicerrectoría Administrativa
  // =========================
  y = 460;
  const adX = 1090, adW = 360;
  add("financiera","División Financiera",adX,y,adW,43,"vadmin",{group:"administrativa"}); y += 51;
  [
    ["inventarios","Sección de Inventarios"],
    ["recaudos","Sección de Recaudos"],
    ["presupuesto","Sección de Presupuesto"],
    ["tesoreria","Sección de Tesorería"],
    ["contabilidad","Sección de Contabilidad"]
  ].forEach(([id,label]) => { add(id,label,1110,y,320,35,"financiera",{group:"administrativa",style:"sublevel"}); y += 42; });
  [
    ["talento","División de Gestión de Talento Humano",43],
    ["contratacion","División de Contratación",43],
    ["tic","División de Tecnologías de la Información\ny la Comunicación",50],
    ["publicaciones","División de Publicaciones",43],
    ["mantenimiento","División de Mantenimiento Tecnológico",43],
    ["planta","División de Planta Física",43]
  ].forEach(([id,label,h]) => { add(id,label,adX,y,adW,h,"vadmin",{group:"administrativa"}); y += h+8; });
  add("seguridad","Sección de Seguridad",1110,y,320,35,"planta",{group:"administrativa",style:"sublevel"});

  // =========================
  // Instituto de Desarrollo Regional
  // =========================
  // Sus dependencias se despliegan hacia la izquierda.
  // Se usa una columna separada para que UIAES pueda abrirse sin superposición.
  add(
    "comite-proyeccion",
    "Comité de Proyección Social\ny Territorio",
    10, 42, 210, 56, "idr",
    {group:"rectoria", style:"sublevel", sourceSide:"left", targetSide:"right"}
  );

  add(
    "educacion-buen-vivir",
    "Educación y Buen Vivir",
    10, 110, 210, 46, "idr",
    {group:"rectoria", style:"sublevel", sourceSide:"left", targetSide:"right"}
  );

  add(
    "extension-regionalizacion",
    "Extensión y Proyección Social\nde Regionalización",
    10, 168, 210, 64, "idr",
    {group:"rectoria", style:"sublevel", sourceSide:"left", targetSide:"right"}
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
    ["gestion-judicial","Tecnología en Gestión Judicial\ne Investigación Criminal",54,"new","derecho"],
    ["economia","Escuela de Economía\ny Administración",46],
    ["educacion","Escuela de Educación"],
    ["historia","Escuela de Historia"],
    ["idiomas","Escuela de Idiomas"],
    ["trabajo-social","Escuela de Trabajo Social"],
    ["filosofia","Escuela de Filosofía"],
    ["deportes","Departamento de Educación\nFísica y Deportes",46],
    ["admin-finanzas","Escuela de Administración\ny Finanzas",46,"new"],
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
    ["tecnologia-empresarial","Tecnología Empresarial",40,"new","industriales"],
    ["gestion-empresarial","Gestión Empresarial",40,"new","industriales"],
    ["mecanica","Escuela de Ingeniería\nMecánica",44],
    ["sistemas","Escuela de Ingeniería de\nSistemas e Informática",50],
    ["geologia","Escuela de Geología"],
    ["metalurgica","Escuela de Ingeniería Metalúrgica\ny Ciencia de los Materiales",54],
    ["petroleos","Escuela de Ingeniería de Petróleos",44],
    ["ing-quimica","Escuela de Ingeniería Química",44]
  ]);

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
  add("regencia","Tecnología en Regencia de Farmacia",1880 + FACULTY_SHIFT,1215,205,40,"medicina",{group:"facultades",style:"new",sourceSide:"bottom",targetSide:"top"});


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
    // UIAES permanece oculto hasta abrir manualmente Planeación.
    collapsedNodes: { planeacion: true },
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
  const exportBtn = $("#exportBtn");

  const editBar = $("#editBar");
  const addBtn = $("#addBtn");
  const renameBtn = $("#renameBtn");
  const parentBtn = $("#parentBtn");
  const linkBtn = $("#linkBtn");
  const deleteBtn = $("#deleteBtn");
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
  const editMode = true;
  let selectedId = null;
  let selectedLinkChildId = null;
  let dialogMode = "add";
  let drag = null;

  const PROTECTED_NODES = new Set([
    "superior","rectoria","academico","vbienestar","vie","vacad","vadmin","facultades"
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

    const get = id => parsed.nodes.find(n => n.id === id);

    // V21: nueva Vicerrectoría de Cultura y Bienestar.
    // Los movimientos anteriores de las otras ramas se preservan como traslación,
    // pero la nueva estructura interna se fija según la reorganización institucional.
    if(fromSchema < 21){
      const moveExistingGroup = (rootId, groupName, dx, dy=0) => {
        parsed.nodes.forEach(n => {
          if(n.id === rootId || n.group === groupName){
            n.x += dx;
            n.y += dy;
          }
        });
      };

      // Redistribuir ramas existentes para hacer espacio a la nueva Vicerrectoría.
      moveExistingGroup("vie", "investigacion", 250);
      moveExistingGroup("vacad", "vacademica", 245);
      moveExistingGroup("vadmin", "administrativa", 225);
      moveExistingGroup("facultades", "facultades", 50);

      // Cultural y Bienestar pasan a la nueva Vicerrectoría.
      const vb = get("vbienestar");
      if(vb){
        vb.x = 20; vb.y = 355; vb.w = 300; vb.h = 72;
        vb.parent = "academico";
        vb.group = "core";
        vb.kind = "main";
        vb.style = "new";
        vb.sourceSide = "bottom";
        vb.targetSide = "top";
      }

      const culturalNode = get("cultural");
      if(culturalNode){
        culturalNode.parent = "vbienestar";
        culturalNode.group = "cultura-bienestar";
        culturalNode.style = "sublevel";
        culturalNode.x = 20;
        culturalNode.y = 460;
        culturalNode.w = 300;
        culturalNode.h = 45;
      }

      const bienestarNode = get("bienestar");
      if(bienestarNode){
        bienestarNode.parent = "vbienestar";
        bienestarNode.group = "cultura-bienestar";
        bienestarNode.style = "sublevel";
        bienestarNode.x = 20;
        bienestarNode.y = 513;
        bienestarNode.w = 300;
        bienestarNode.h = 45;
      }

      const serviciosNode = get("servicios-salud");
      if(serviciosNode){
        serviciosNode.parent = "bienestar";
        serviciosNode.group = "cultura-bienestar";
        serviciosNode.style = "sublevel";
        serviciosNode.x = 40;
        serviciosNode.y = 566;
        serviciosNode.w = 260;
        serviciosNode.h = 52;
        serviciosNode.sourceSide = "bottom";
        serviciosNode.targetSide = "top";
      }

      const alimentacionNode = get("alimentacion");
      if(alimentacionNode){
        alimentacionNode.parent = "bienestar";
        alimentacionNode.group = "cultura-bienestar";
        alimentacionNode.style = "sublevel";
        alimentacionNode.x = 40;
        alimentacionNode.y = 626;
        alimentacionNode.w = 260;
        alimentacionNode.h = 47;
        alimentacionNode.sourceSide = "bottom";
        alimentacionNode.targetSide = "top";
      }

      // Escuela de Estudios Técnicos y Tecnológicos pasa a Vicerrectoría Académica.
      const escuelaTecnicos = get("centro-tecnico");
      if(escuelaTecnicos){
        escuelaTecnicos.label = "Escuela de Estudios\nTécnicos y Tecnológicos";
        escuelaTecnicos.parent = "vacad";
        escuelaTecnicos.group = "vacademica";
        escuelaTecnicos.style = "new";
        escuelaTecnicos.x = 745;
        escuelaTecnicos.y = 725;
        escuelaTecnicos.w = 300;
        escuelaTecnicos.h = 52;
      }

      // Reorganizar verticalmente la rama académica sin Cultural/Bienestar.
      const academicLayout = [
        ["posgrados",460,45],
        ["calidad",513,45],
        ["admisiones",566,45],
        ["biblioteca",619,45],
        ["cededuis",672,45],
        ["centro-tecnico",725,52],
        ["consejo-sedes",785,43],
        ["barranca",838,45],
        ["malaga",891,45],
        ["socorro",944,45],
        ["barbosa",997,45]
      ];

      academicLayout.forEach(([id,y,h]) => {
        const n = get(id);
        if(!n) return;
        n.group = "vacademica";
        n.x = ["barranca","malaga","socorro","barbosa"].includes(id) ? 765 : 745;
        n.y = y;
        n.w = ["barranca","malaga","socorro","barbosa"].includes(id) ? 260 : 300;
        n.h = h;
        if(id === "centro-tecnico"){
          n.parent = "vacad";
          n.style = "new";
        }
      });

      // Las cuatro sedes siguen dependiendo de Consejo de Sedes.
      ["barranca","malaga","socorro","barbosa"].forEach(id => {
        const n = get(id);
        if(n){
          n.parent = "consejo-sedes";
          n.style = "new";
        }
      });

      // Centro técnico ya no debe quedar dentro de Investigación.
      const researchIds = ["cie","ieia","transferencia","direcciones-ie","comite-ie","programas"];
      researchIds.forEach((id,index) => {
        const n = get(id);
        if(!n) return;
        n.parent = "vie";
        n.group = "investigacion";
        n.x = 370;
        n.y = 460 + index*53;
        n.w = 315;
        n.h = 45;
      });

      // Asegurar los enlaces principales desde Consejo Académico.
      ["vbienestar","vie","vacad","vadmin","facultades"].forEach(id => {
        const n = get(id);
        if(n){
          n.parent = "academico";
          n.sourceSide = "bottom";
          n.targetSide = "top";
        }
      });
    }

    // V19: unificar el nombre de las sedes con Barrancabermeja.
    const sedeLabels = {
      malaga: "Escuela de Formación y Desarrollo\nTerritorial Málaga",
      socorro: "Escuela de Formación y Desarrollo\nTerritorial Socorro",
      barbosa: "Escuela de Formación y Desarrollo\nTerritorial Barbosa"
    };

    Object.entries(sedeLabels).forEach(([id, label]) => {
      const n = get(id);
      if(n) n.label = label;
    });

    // V16: mover Facultades 50 px a la derecha respecto de V15,
    // conservando toda la distribución interna y movimientos de la rama.
    if(fromSchema < 16){
      parsed.nodes.forEach(n => {
        if(n.id === "facultades" || n.group === "facultades"){
          n.x += 50;
        }
      });
    }

    // V14: acercar toda la rama de Facultades a Vicerrectoría Administrativa.
    // Se desplaza el conjunto completo 520 px a la izquierda, conservando
    // la distribución relativa que ya tuviera el usuario.
    if(fromSchema < 14){
      parsed.nodes.forEach(n => {
        if(n.id === "facultades" || n.group === "facultades"){
          n.x -= 520;
        }
      });
    }

    // Corrección institucional: Certificación y Gestión Documental depende de Secretaría General.
    const cert = get("certificacion");
    if(cert){
      cert.parent = "secretaria";
      cert.group = "rectoria";
      cert.sourceSide = "bottom";
      cert.targetSide = "top";
    }

    // Las cuatro ramas principales salen ordenadamente desde abajo de Consejo Académico.
    ["vbienestar","vie","vacad","vadmin","facultades"].forEach(id => {
      const n = get(id);
      if(n){
        n.parent = "academico";
        n.sourceSide = "bottom";
        n.targetSide = "top";
      }
    });

    // Las cuatro facultades salen desde abajo de la casilla FACULTADES.
    ["fac-ciencias","fac-humanas","fac-ingenierias","fac-salud"].forEach(id => {
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
    if(regencia && fromSchema < 13){
      // Se conserva debajo de los departamentos de Medicina.
      const baseRegencia = baseNodes.find(n => n.id === "regencia");
      if(baseRegencia){
        regencia.x = baseRegencia.x;
        regencia.y = baseRegencia.y;
      }
      regencia.parent = "medicina";
      regencia.group = "facultades";
      regencia.style = "new";
      regencia.sourceSide = "bottom";
      regencia.targetSide = "top";
    }

    // Estilos de los nuevos bloques:
    // encabezados nuevos = amarillo; dependencias = blanco.
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

    // V13: desaparece la Vicerrectoría de Proyección Social y Territorio.
    // Se eliminan el nodo superior y AMOVI de la estructura guardada.
    ["vproyeccion","amovi"].forEach(id => {
      const index = parsed.nodes.findIndex(n => n.id === id);
      if(index >= 0) parsed.nodes.splice(index, 1);
    });

    // V16: IDR alineado con la columna de Planeación / Control / UISALUD.
    // Sus dependencias quedan a la izquierda.
    const idrNode = get("idr");
    if(idrNode){
      idrNode.x = 500;
      idrNode.y = 42;
      idrNode.w = 230;
      idrNode.h = 40;
      idrNode.parent = "rectoria";
      idrNode.group = "rectoria";
      idrNode.relation = "advisory";
      idrNode.style = "new";
      idrNode.sourceSide = "auto";
      idrNode.targetSide = "auto";
    }

    const idrChildren = [
      ["comite-proyeccion", 10, 42, 210, 56],
      ["educacion-buen-vivir", 10, 110, 210, 46],
      ["extension-regionalizacion", 10, 168, 210, 64]
    ];

    idrChildren.forEach(([id,x,y,w,h]) => {
      const n = get(id);
      if(!n) return;
      n.parent = "idr";
      n.group = "rectoria";
      n.style = "sublevel";
      n.sourceSide = "left";
      n.targetSide = "right";
      n.x = x;
      n.y = y;
      n.w = w;
      n.h = h;
    });

    // V16: UIAES debe iniciar oculto hasta abrir Planeación.
    // Solo se fuerza al migrar; después el usuario puede abrir/cerrar normalmente.
    if(fromSchema < 16){
      parsed.collapsedNodes.planeacion = true;
    }

    // V14: Sedes Regionales se elimina completamente.
    const sedesIndex = parsed.nodes.findIndex(n => n.id === "sedes-regionales");
    if(sedesIndex >= 0) parsed.nodes.splice(sedesIndex, 1);

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
        "sistemas","geologia","metalurgica",
        "petroleos","ing-quimica"
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
      regenciaV10.style = "new";
      regenciaV10.w = 205;
      regenciaV10.h = 40;
      // V13: depende de Escuela de Medicina para que se oculte al contraer Medicina.
      regenciaV10.parent = "medicina";
      regenciaV10.group = "facultades";
      regenciaV10.sourceSide = "bottom";
      regenciaV10.targetSide = "top";
    }

    [
      "ing-forestal","zootecnia","med-veterinaria","ing-agronomica",
      "programas-agroindustrial","tecnico-produccion-agropecuaria",
      "tecnologia-agroindustrial","administracion-agroindustrial",
      "ing-construccion","arquitectura",
      "admin-turistica-hotelera","carrera-musica","artes-plasticas"
    ].forEach(id => {
      const n = get(id);
      if(n) n.style = "sublevel";
    });

    // V13: estos elementos nuevos deben mostrarse siempre en amarillo.
    [
      "admin-finanzas","regencia","alimentos","gestion-judicial",
      "tecnologia-empresarial","gestion-empresarial","inteligencia-artificial"
    ].forEach(id => {
      const n = get(id);
      if(n) n.style = "new";
    });

    // V23: mover toda la rama de Facultades 80 px a la derecha.
    if(fromSchema < 23){
      parsed.nodes.forEach(n => {
        if(n.id === "facultades" || n.group === "facultades"){
          n.x += 80;
        }
      });
    }

    // =====================================================
    // V22 — Reorganización definitiva de Facultades y Sedes
    // =====================================================
    if(fromSchema < 22){
      // Facultades se corre 60 px a la derecha como bloque completo.
      parsed.nodes.forEach(n => {
        if(n.id === "facultades" || n.group === "facultades"){
          n.x += 60;
        }
      });
    }

    // Eliminar unidades que dejan de existir en esta propuesta.
    ["fac-agrarias","habitat-territorio"].forEach(id => {
      const index = parsed.nodes.findIndex(n => n.id === id);
      if(index >= 0) parsed.nodes.splice(index, 1);
    });

    // Seccional Arauca: nueva dependencia de Rectoría.
    const arauca = get("seccional-arauca");
    if(arauca){
      arauca.label = "Seccional Arauca";
      arauca.parent = "rectoria";
      arauca.group = "rectoria";
      arauca.style = "new";
      arauca.x = 1285;
      arauca.y = 42;
      arauca.w = 235;
      arauca.h = 40;
    }

    // Layout definitivo de Consejo de Sedes y sus programas.
    const academicNodes = {
      "consejo-sedes": [745,785,300,43,"vacad","new"],
      "barranca": [765,838,260,45,"consejo-sedes","new"],
      "inteligencia-artificial": [785,891,220,46,"barranca","new"],
      "tecnico-fotovoltaico": [785,945,220,42,"barranca","new"],

      "malaga": [765,999,260,45,"consejo-sedes","new"],
      "ing-forestal": [785,1052,220,40,"malaga","sublevel"],
      "zootecnia": [785,1100,220,40,"malaga","sublevel"],
      "med-veterinaria": [785,1148,220,40,"malaga","sublevel"],
      "ing-agronomica": [785,1196,220,40,"malaga","sublevel"],
      "programas-agroindustrial": [785,1244,220,58,"malaga","sublevel"],
      "tecnico-produccion-agropecuaria": [805,1310,200,54,"programas-agroindustrial","sublevel"],
      "tecnologia-agroindustrial": [805,1372,200,42,"programas-agroindustrial","sublevel"],
      "administracion-agroindustrial": [805,1422,200,42,"programas-agroindustrial","sublevel"],

      "socorro": [765,1476,260,45,"consejo-sedes","new"],
      "ing-construccion": [785,1529,220,40,"socorro","sublevel"],
      "arquitectura": [785,1577,220,40,"socorro","sublevel"],
      "admin-turistica-hotelera": [785,1625,220,58,"socorro","sublevel"],

      "barbosa": [765,1691,260,45,"consejo-sedes","new"],
      "alimentos": [785,1744,220,40,"barbosa","new"]
    };

    Object.entries(academicNodes).forEach(([id,values]) => {
      const n = get(id);
      if(!n) return;

      const [x,y,w,h,parent,style] = values;
      n.x = x;
      n.y = y;
      n.w = w;
      n.h = h;
      n.parent = parent;
      n.group = "vacademica";
      n.style = style;
      n.sourceSide = "bottom";
      n.targetSide = "top";
    });

    // Los programas trasladados ya no pertenecen a la rama Facultades.
    [
      "inteligencia-artificial","tecnico-fotovoltaico",
      "ing-forestal","zootecnia","med-veterinaria","ing-agronomica",
      "programas-agroindustrial","tecnico-produccion-agropecuaria",
      "tecnologia-agroindustrial","administracion-agroindustrial",
      "ing-construccion","arquitectura","admin-turistica-hotelera","alimentos"
    ].forEach(id => {
      const n = get(id);
      if(n) n.group = "vacademica";
    });

    // UIAES inicia siempre oculto.
    parsed.collapsedNodes.planeacion = true;

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
            migrated.collapsedNodes.planeacion = true;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            return migrated;
          }

          // UIAES siempre inicia oculto. Solo se muestra si el usuario
          // abre Planeación manualmente durante esta sesión.
          normalized.collapsedNodes.planeacion = true;
          return normalized;
        }
      }

      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if(legacyRaw){
        const legacy = JSON.parse(legacyRaw);
        if(Array.isArray(legacy.nodes) && legacy.expanded){
          const migrated = migrateLegacyState(legacy);
          migrated.collapsedNodes.planeacion = true;
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
    if(node.id === "vbienestar") return "cultura-bienestar";
    if(node.id === "vie") return "investigacion";
    if(node.id === "vacad") return "vacademica";
    if(node.id === "vadmin") return "administrativa";
    if(node.id === "facultades") return "facultades";
    if(node.id === "rectoria") return "rectoria";
    return "core";
  }

  function render(){
    nodesLayer.innerHTML = "";
    canvas.classList.add("editing");

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
      el.classList.add("editable");

      const span = document.createElement("span");
      span.className = "label";
      node.label.split("\n").forEach((part,i) => {
        if(i) span.appendChild(document.createElement("br"));
        span.appendChild(document.createTextNode(part));
      });
      el.appendChild(span);

      if(hasExpandableContent(node)){
        const badge = document.createElement("span");
        badge.className = "toggle-badge";
        badge.textContent = isExpandedForNode(node) ? "−" : "+";
        badge.title = isExpandedForNode(node) ? "Contraer" : "Desplegar";

        // El +/− controla el despliegue incluso mientras la edición está activa.
        badge.addEventListener("pointerdown", ev => {
          ev.stopPropagation();
        });

        badge.addEventListener("click", ev => {
          ev.preventDefault();
          ev.stopPropagation();
          toggleNodeExpansion(node);
        });

        el.appendChild(badge);
      }

      el.addEventListener("click", ev => onNodeClick(ev,node));
      el.addEventListener("dblclick", ev => {
        ev.preventDefault();
        selectNode(node.id);
        openRename();
      });

      el.addEventListener("pointerdown", ev => startDrag(ev,node,el));

      nodesLayer.appendChild(el);
    });

    resizeCanvas();
    requestAnimationFrame(drawConnections);
    updateEditButtons();
  }

  const AUTO_LAYOUT_GAP = 8;

  function visibleChildrenSorted(parentId){
    return childrenOf(parentId)
      .filter(isVisible)
      .sort((a,b) => {
        if(a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      });
  }

  function layoutLinearChildren(parentId, startY, gap=AUTO_LAYOUT_GAP){
    let cursorY = startY;
    const children = visibleChildrenSorted(parentId);

    children.forEach(child => {
      child.y = Math.round(cursorY);
      cursorY += child.h + gap;

      // Si el hijo está desplegado, sus descendientes visibles ocupan
      // inmediatamente el espacio siguiente. De esta forma no quedan huecos.
      if(!state.collapsedNodes[child.id]){
        const visibleGrandchildren = visibleChildrenSorted(child.id);
        if(visibleGrandchildren.length){
          cursorY = layoutLinearChildren(child.id, cursorY, gap);
        }
      }
    });

    return cursorY;
  }

  function topFacultyAncestor(node){
    let current = node;

    while(current?.parent){
      const parent = byId(current.parent);
      if(!parent) return null;
      if(parent.id === "facultades") return current;
      current = parent;
    }

    return null;
  }

  function compactFacultyColumn(faculty){
    if(!faculty) return;
    // Los encabezados de Facultad están en y=460 y tienen 60px.
    // 15px conserva el aire visual del organigrama original.
    layoutLinearChildren(faculty.id, faculty.y + faculty.h + 15, 7);
  }

  function compactGroup(groupName){
    if(!state.expanded[groupName]) return;

    const rootId = Object.keys(GROUP_BY_CORE)
      .find(id => GROUP_BY_CORE[id] === groupName);

    const root = rootId ? byId(rootId) : null;
    if(!root) return;

    if(groupName === "facultades"){
      childrenOf("facultades")
        .filter(isVisible)
        .forEach(compactFacultyColumn);
      return;
    }

    // Rectoría conserva una composición lateral, no una lista vertical.
    // Por eso no se fuerza su distribución automática.
    if(groupName === "rectoria") return;

    layoutLinearChildren(root.id, root.y + root.h + 33, AUTO_LAYOUT_GAP);
  }

  function compactAfterToggle(node){
    const group = GROUP_BY_CORE[node.id] || node.group || nodeBranch(node);

    if(group === "facultades"){
      if(node.id === "facultades"){
        compactGroup("facultades");
      }else{
        compactFacultyColumn(topFacultyAncestor(node));
      }
      return;
    }

    if(["cultura-bienestar","investigacion","vacademica","administrativa"].includes(group)){
      compactGroup(group);
    }
  }

  function compactAllExpandedGroups(){
    ["cultura-bienestar","investigacion","vacademica","administrativa","facultades"]
      .forEach(compactGroup);
  }

  function toggleNodeExpansion(node){
    const group = GROUP_BY_CORE[node.id];

    if(group){
      state.expanded[group] = !state.expanded[group];

      // Cuando se abre una rama completa, se compacta antes de dibujarla.
      if(state.expanded[group]) compactAfterToggle(node);

      saveState();
      render();
      return;
    }

    if(childrenOf(node.id).length){
      state.collapsedNodes[node.id] = !state.collapsedNodes[node.id];

      // Tanto al abrir como al cerrar, los elementos que siguen se corren
      // automáticamente hacia arriba/abajo para ocupar el espacio correcto.
      compactAfterToggle(node);

      saveState();
      render();
    }
  }

  function onNodeClick(ev,node){
    ev.stopPropagation();
    // La edición está siempre disponible. Un clic selecciona la casilla;
    // el botón +/− se encarga de desplegar/contraer sin desactivar el arrastre.
    selectNode(node.id);
  }

  function selectNode(id){
    selectedId = id;
    selectedLinkChildId = null;
    render();
  }

  function selectLink(childId){
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
    if(ev.button !== 0) return;
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
    canvas.style.height=Math.min(Math.max(maxY,650),2200)+"px";
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

  function rgbaOrFallback(value, fallback){
    if(!value || value === "none" || value === "transparent" || value === "rgba(0, 0, 0, 0)"){
      return fallback;
    }
    return value;
  }

  function roundedRectPath(ctx, x, y, w, h, radius){
    const r = Math.max(0, Math.min(Number(radius) || 0, w/2, h/2));

    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  function wrapTextForCanvas(ctx, text, maxWidth){
    const paragraphs = String(text || "").split("\n");
    const lines = [];

    paragraphs.forEach(paragraph => {
      const clean = paragraph.trim();

      if(!clean){
        lines.push("");
        return;
      }

      const words = clean.split(/\s+/);
      let current = "";

      words.forEach(word => {
        const test = current ? current + " " + word : word;

        if(current && ctx.measureText(test).width > maxWidth){
          lines.push(current);
          current = word;
        }else{
          current = test;
        }
      });

      if(current) lines.push(current);
    });

    return lines;
  }

  function drawConnectorToExport(ctx, path){
    const d = path.getAttribute("d");
    if(!d) return;

    const style = getComputedStyle(path);
    const stroke = rgbaOrFallback(style.stroke, "#2c7a45");
    const width = parseFloat(style.strokeWidth) || 1.6;

    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    const dash = style.strokeDasharray;
    if(dash && dash !== "none"){
      const values = dash
        .split(/[ ,]+/)
        .map(Number)
        .filter(Number.isFinite);

      if(values.length) ctx.setLineDash(values);
    }

    try{
      ctx.stroke(new Path2D(d));
    }catch(error){
      console.warn("No se pudo dibujar un enlace en el PNG:", error);
    }

    ctx.restore();
  }

  function drawModelFrameToExport(ctx, frame){
    const style = getComputedStyle(frame);
    const x = parseFloat(frame.style.left) || frame.offsetLeft;
    const y = parseFloat(frame.style.top) || frame.offsetTop;
    const w = parseFloat(frame.style.width) || frame.offsetWidth;
    const h = parseFloat(frame.style.height) || frame.offsetHeight;

    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    const borderWidth = parseFloat(style.borderTopWidth) || 1;
    const fill = rgbaOrFallback(style.backgroundColor, "#f4f4f4");
    const border = rgbaOrFallback(style.borderTopColor, "#b9b9b9");

    roundedRectPath(ctx, x, y, w, h, radius);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = border;
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = rgbaOrFallback(style.color, "#5b5b5b");
    ctx.font = `${style.fontWeight || "700"} ${style.fontSize || "18px"} ${style.fontFamily || "Arial"}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(frame.textContent || "", x+w/2, y+14);
    ctx.restore();
  }

  function drawNodeToExport(ctx, el){
    const style = getComputedStyle(el);
    const node = byId(el.dataset.id);

    const x = parseFloat(el.style.left) || el.offsetLeft;
    const y = parseFloat(el.style.top) || el.offsetTop;
    const w = parseFloat(el.style.width) || el.offsetWidth;
    const h = parseFloat(el.style.height) || el.offsetHeight;

    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    const borderWidth = parseFloat(style.borderTopWidth) || 0;
    const fill = rgbaOrFallback(style.backgroundColor, "#ffffff");
    const border = rgbaOrFallback(style.borderTopColor, "#9abb9f");

    ctx.save();

    roundedRectPath(ctx, x, y, w, h, radius);
    ctx.fillStyle = fill;
    ctx.fill();

    if(borderWidth > 0 && style.borderTopStyle !== "none"){
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = border;

      if(style.borderTopStyle === "dashed"){
        ctx.setLineDash([5,4]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    }

    const fontSize = parseFloat(style.fontSize) || 14;
    const fontWeight = style.fontWeight || "680";
    const fontFamily = style.fontFamily || 'Arial, sans-serif';
    const lineHeightRaw = parseFloat(style.lineHeight);
    const lineHeight = Number.isFinite(lineHeightRaw) ? lineHeightRaw : fontSize * 1.12;

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = rgbaOrFallback(style.color, "#263028");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const label = node ? node.label : (el.querySelector(".label")?.textContent || el.textContent || "");
    const maxTextWidth = Math.max(20, w - 18);
    const lines = wrapTextForCanvas(ctx, label, maxTextWidth);

    const totalHeight = Math.max(lineHeight, lines.length * lineHeight);
    let firstY = y + h/2 - totalHeight/2 + lineHeight/2;

    lines.forEach((line, index) => {
      ctx.fillText(line, x+w/2, firstY + index*lineHeight);
    });

    ctx.restore();
  }

  function createOrganigramPngBlob(){
    return new Promise((resolve, reject) => {
      try{
        // Nos aseguramos de que el DOM y las líneas correspondan al estado actual.
        render();

        const logicalHeight = Math.round(
          parseFloat(canvas.style.height) || canvas.offsetHeight || 650
        );

        const scale = 2;
        const output = document.createElement("canvas");
        output.width = Math.round(CANVAS_WIDTH * scale);
        output.height = Math.round(logicalHeight * scale);

        const ctx = output.getContext("2d");
        if(!ctx){
          reject(new Error("El navegador no pudo crear el lienzo PNG."));
          return;
        }

        ctx.scale(scale, scale);

        // Fondo blanco.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, CANVAS_WIDTH, logicalHeight);

        // 1. Líneas reales visibles.
        svg.querySelectorAll("path.connector").forEach(path => {
          drawConnectorToExport(ctx, path);
        });

        // 2. Recuadros informativos.
        nodesLayer.querySelectorAll(".model-frame").forEach(frame => {
          drawModelFrameToExport(ctx, frame);
        });

        // 3. Casillas visibles.
        nodesLayer.querySelectorAll(".org-node").forEach(el => {
          drawNodeToExport(ctx, el);
        });

        output.toBlob(blob => {
          if(blob){
            resolve(blob);
          }else{
            reject(new Error("El navegador no pudo convertir el organigrama a PNG."));
          }
        }, "image/png");
      }catch(error){
        reject(error);
      }
    });
  }

  async function fallbackDownload(blob, filename){
    const url = URL.createObjectURL(blob);

    try{
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.rel = "noopener";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 15000);
    }catch(error){
      URL.revokeObjectURL(url);
      throw error;
    }
  }

  async function exportAsPng(){
    const originalLabel = exportBtn ? exportBtn.textContent : "";
    const timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
    const filename = `organigrama-uis-${timestamp}.png`;

    let fileHandle = null;

    // El selector se abre directamente desde el clic del usuario.
    // Esto funciona especialmente bien en Chrome/Edge sobre GitHub Pages (HTTPS).
    if(window.isSecureContext && "showSaveFilePicker" in window){
      try{
        fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: "Imagen PNG",
            accept: {"image/png": [".png"]}
          }]
        });
      }catch(error){
        if(error?.name === "AbortError") return;
        console.warn("No se pudo usar Guardar como; se intentará descarga directa:", error);
      }
    }

    if(exportBtn){
      exportBtn.disabled = true;
      exportBtn.textContent = "⏳ Generando PNG...";
    }

    const prevSelectedId = selectedId;
    const prevSelectedLinkChildId = selectedLinkChildId;

    // La imagen no debe mostrar selección activa.
    selectedId = null;
    selectedLinkChildId = null;

    try{
      const pngBlob = await createOrganigramPngBlob();

      if(fileHandle){
        const writable = await fileHandle.createWritable();
        await writable.write(pngBlob);
        await writable.close();
      }else{
        await fallbackDownload(pngBlob, filename);
      }
    }catch(error){
      console.error("ERROR EXPORTANDO PNG:", error);

      // El mensaje incluye el error real para poder detectar cualquier caso de navegador.
      alert(
        "No fue posible guardar el PNG.\n\n" +
        (error?.message || String(error))
      );
    }finally{
      selectedId = prevSelectedId;
      selectedLinkChildId = prevSelectedLinkChildId;
      render();
      updateZoomStage();

      if(exportBtn){
        exportBtn.disabled = false;
        exportBtn.textContent = originalLabel || "💾 Guardar PNG";
      }
    }
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
  exportBtn?.addEventListener("click", exportAsPng);

  addBtn.addEventListener("click",openAdd);
  renameBtn.addEventListener("click",openRename);
  parentBtn.addEventListener("click",openChangeParent);
  linkBtn.addEventListener("click",openEditLink);
  deleteBtn.addEventListener("click",deleteSelected);
  saveDialogBtn.addEventListener("click",saveDialog);

  expandBtn.addEventListener("click",()=>{
    GROUPS.forEach(g=>state.expanded[g]=true);
    // UIAES no se abre con "Desplegar todo"; Planeación debe abrirse manualmente.
    state.collapsedNodes={planeacion:true};
    compactAllExpandedGroups();
    saveState();
    render();
  });

  collapseBtn.addEventListener("click",()=>{
    GROUPS.forEach(g=>state.expanded[g]=false);
    state.collapsedNodes={planeacion:true};
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
    compactAllExpandedGroups();
    render();
  });

  canvas.addEventListener("click",()=>{
    selectedId=null;
    selectedLinkChildId=null;
    render();
  });

  window.addEventListener("resize",()=>{ updateZoomStage(); drawConnections(); });

  // Mover con flechas del teclado mientras se edita.
  window.addEventListener("keydown",ev=>{
    if(
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
