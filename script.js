(() => {
  const STORAGE_KEY = "uis-organigrama-interactivo-v1";

  const DEFAULT_STATE = {
    roots: {
      superior: {
        label: "CONSEJO SUPERIOR",
        color: "superior",
        children: []
      },
      rectoria: {
        label: "RECTORÍA",
        color: "rectoria",
        children: [
          { id: "idr", label: "Instituto de Desarrollo Regional", style: "highlight", relation: "advisory", children: [] },
          { id: "uiaes", label: "Unidad de Información y Análisis Estadístico - UIAES", relation: "advisory", children: [] },
          { id: "planeacion", label: "Planeación", relation: "advisory", children: [] },
          { id: "control-gestion", label: "Dirección de Control Interno y Evaluación de Gestión", relation: "advisory", children: [] },
          { id: "control-disciplinario", label: "Oficina de Control Interno Disciplinario", relation: "advisory", children: [] },
          { id: "uisalud", label: "Unidad Especializada en Salud - UISALUD", relation: "advisory", children: [] },
          { id: "rel-ext", label: "Relaciones Exteriores", relation: "hierarchical", children: [] },
          { id: "sec-general", label: "Secretaría General", relation: "hierarchical", children: [] },
          { id: "cert-documental", label: "Dirección de Certificación y Gestión Documental", relation: "hierarchical", children: [] },
          { id: "comunicaciones", label: "Dirección de Comunicaciones", relation: "advisory", children: [] }
        ]
      },
      academico: {
        label: "CONSEJO ACADÉMICO",
        color: "academico",
        children: []
      },
      investigacion: {
        label: "VICERRECTORÍA DE INVESTIGACIÓN Y EXTENSIÓN",
        color: "investigacion",
        children: [
          { id: "cie", label: "Consejo de Investigación y Extensión", children: [] },
          { id: "ieia", label: "Instituto de Estudios Interdisciplinarios y Acción", children: [] },
          { id: "transferencia", label: "Estrategia para la Dirección de Transferencia de Conocimiento", children: [] },
          { id: "direcciones-ie", label: "Direcciones de Investigación y Extensión de las Facultades", children: [] },
          { id: "comite-ie", label: "Comité Operativo de Investigación y Extensión", children: [] },
          { id: "programas-proyectos", label: "Coordinación de Programas y Proyectos", children: [] },
          { id: "centro-tecnico", label: "Centro Administrativo de Estudios Técnicos y Tecnológicos", style: "highlight", children: [] }
        ]
      },
      vacademica: {
        label: "VICERRECTORÍA ACADÉMICA",
        color: "vacademica",
        children: [
          { id: "posgrados", label: "Dirección de Posgrados", children: [] },
          { id: "calidad", label: "Coordinación de Evaluación de la Calidad", children: [] },
          { id: "cultural", label: "Dirección Cultural", children: [] },
          { id: "admisiones", label: "Dirección de Admisiones y Registro Académico", children: [] },
          { id: "biblioteca", label: "Biblioteca", children: [] },
          { id: "cededuis", label: "CEDEDUIS", children: [] },
          {
            id: "bienestar",
            label: "Bienestar Estudiantil",
            children: [
              { id: "servicios-salud", label: "Coordinación de Servicios Integrales de Salud y Desarrollo", children: [] },
              { id: "alimentacion", label: "Coordinación de Servicios de Alimentación", children: [] }
            ]
          },
          {
            id: "consejo-sedes",
            label: "Consejo de Sedes",
            style: "highlight",
            children: [
              { id: "barranca", label: "Escuela de Formación y Desarrollo Territorial Barrancabermeja", style: "highlight", children: [] },
              { id: "malaga", label: "Sede Málaga", style: "highlight", children: [] },
              { id: "socorro", label: "Sede Socorro", style: "highlight", children: [] },
              { id: "barbosa", label: "Sede Barbosa", style: "highlight", children: [] }
            ]
          }
        ]
      },
      administrativa: {
        label: "VICERRECTORÍA ADMINISTRATIVA",
        color: "administrativa",
        children: [
          {
            id: "financiera",
            label: "División Financiera",
            children: [
              { id: "inventarios", label: "Sección de Inventarios", children: [] },
              { id: "recaudos", label: "Sección de Recaudos", children: [] },
              { id: "presupuesto", label: "Sección de Presupuesto", children: [] },
              { id: "tesoreria", label: "Sección de Tesorería", children: [] },
              { id: "contabilidad", label: "Sección de Contabilidad", children: [] }
            ]
          },
          { id: "talento", label: "División de Gestión de Talento Humano", children: [] },
          { id: "contratacion", label: "División de Contratación", children: [] },
          { id: "tic", label: "División de Tecnologías de la Información y la Comunicación", children: [] },
          { id: "publicaciones", label: "División de Publicaciones", children: [] },
          { id: "mantenimiento", label: "División de Mantenimiento Tecnológico", children: [] },
          {
            id: "planta-fisica",
            label: "División de Planta Física",
            children: [
              { id: "seguridad", label: "Sección de Seguridad", children: [] }
            ]
          }
        ]
      },
      facultades: {
        label: "FACULTADES",
        color: "facultades",
        children: [
          {
            id: "fac-ciencias",
            label: "FACULTAD DE CIENCIAS",
            children: [
              { id: "fc-consejo", label: "Consejo de Facultad", children: [] },
              { id: "biologia", label: "Escuela de Biología", children: [] },
              { id: "fisica", label: "Escuela de Física", children: [] },
              { id: "matematicas", label: "Escuela de Matemáticas", children: [] },
              { id: "quimica", label: "Escuela de Química", children: [] }
            ]
          },
          {
            id: "fac-humanas",
            label: "FACULTAD DE CIENCIAS HUMANAS",
            children: [
              { id: "fch-consejo", label: "Consejo de Facultad", children: [] },
              { id: "lenguas", label: "Instituto de Lenguas", children: [] },
              { id: "artes", label: "Escuela de Artes", children: [] },
              { id: "derecho", label: "Escuela de Derecho y Ciencia Política", children: [] },
              { id: "economia", label: "Escuela de Economía y Administración", children: [] },
              { id: "educacion", label: "Escuela de Educación", children: [] },
              { id: "historia", label: "Escuela de Historia", children: [] },
              { id: "idiomas", label: "Escuela de Idiomas", children: [] },
              { id: "trabajo-social", label: "Escuela de Trabajo Social", children: [] },
              { id: "filosofia", label: "Escuela de Filosofía", children: [] },
              { id: "deportes", label: "Departamento de Educación Física y Deportes", children: [] },
              { id: "admin-finanzas", label: "Escuela de Administración y Finanzas", children: [] }
            ]
          },
          {
            id: "fac-ingenierias",
            label: "FACULTAD DE INGENIERÍAS",
            children: [
              { id: "fi-consejo", label: "Consejo de Facultad", children: [] },
              { id: "diseno", label: "Escuela de Diseño Industrial", children: [] },
              { id: "civil", label: "Escuela de Ingeniería Civil", children: [] },
              { id: "electrica", label: "Escuela de Ingeniería Eléctrica, Electrónica y Telecomunicaciones", children: [] },
              { id: "industriales", label: "Escuela de Estudios Industriales y Empresariales", children: [] },
              { id: "mecanica", label: "Escuela de Ingeniería Mecánica", children: [] },
              { id: "sistemas", label: "Escuela de Ingeniería de Sistemas e Informática", children: [] },
              { id: "geologia", label: "Escuela de Geología", children: [] },
              { id: "metalurgica", label: "Escuela de Ingeniería Metalúrgica y Ciencia de los Materiales", children: [] },
              { id: "petroleos", label: "Escuela de Ingeniería de Petróleos", children: [] },
              { id: "ing-quimica", label: "Escuela de Ingeniería Química", children: [] }
            ]
          },
          {
            id: "fac-salud",
            label: "FACULTAD DE SALUD",
            children: [
              { id: "fs-consejo", label: "Consejo de Facultad", children: [] },
              { id: "proinapsa", label: "PROINAPSA", children: [] },
              { id: "microbiologia", label: "Escuela de Microbiología", children: [] },
              { id: "enfermeria", label: "Escuela de Enfermería", children: [] },
              { id: "fisioterapia", label: "Escuela de Fisioterapia", children: [] },
              { id: "nutricion", label: "Escuela de Nutrición", children: [] },
              {
                id: "medicina",
                label: "Escuela de Medicina",
                children: [
                  { id: "ciencias-basicas", label: "Departamento de Ciencias Básicas", children: [] },
                  { id: "cirugia", label: "Departamento de Cirugía", children: [] },
                  { id: "gineco", label: "Departamento de Ginecobstetricia", children: [] },
                  { id: "med-interna", label: "Departamento de Medicina Interna", children: [] },
                  { id: "patologia", label: "Departamento de Patología", children: [] },
                  { id: "pediatria", label: "Departamento de Pediatría", children: [] },
                  { id: "salud-mental", label: "Departamento de Salud Mental", children: [] },
                  { id: "salud-publica", label: "Departamento de Salud Pública", children: [] }
                ]
              },
              { id: "regencia", label: "Regencia de farmacia", style: "highlight", children: [] }
            ]
          }
        ]
      }
    },
    collapsed: {},
    custom: true
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const detailPanel = $("#detailPanel");
  const detailTitle = $("#detailTitle");
  const detailHint = $("#detailHint");
  const treeArea = $("#treeArea");
  const editToggle = $("#editToggle");
  const editToolbar = $("#editToolbar");
  const addNodeBtn = $("#addNodeBtn");
  const renameNodeBtn = $("#renameNodeBtn");
  const moveNodeBtn = $("#moveNodeBtn");
  const moveUpBtn = $("#moveUpBtn");
  const moveDownBtn = $("#moveDownBtn");
  const deleteNodeBtn = $("#deleteNodeBtn");
  const resetBtn = $("#resetBtn");
  const expandAllBtn = $("#expandAllBtn");
  const collapseAllBtn = $("#collapseAllBtn");

  const nodeDialog = $("#nodeDialog");
  const nodeForm = $("#nodeForm");
  const dialogTitle = $("#dialogTitle");
  const nodeId = $("#nodeId");
  const nodeLabel = $("#nodeLabel");
  const nodeParent = $("#nodeParent");
  const nodeRelation = $("#nodeRelation");
  const nodeStyle = $("#nodeStyle");
  const parentField = $("#parentField");
  const saveNodeBtn = $("#saveNodeBtn");

  let state = loadState();
  let activeRootKey = null;
  let editMode = false;
  let selectedNodeId = null;
  let dialogMode = "add";

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function normalizeNode(node) {
    if (!node.id) node.id = makeId();
    if (!node.children) node.children = [];
    if (!node.relation) node.relation = "hierarchical";
    if (!node.style) node.style = "normal";
    node.children.forEach(normalizeNode);
  }

  function normalizeState(s) {
    Object.values(s.roots).forEach(root => root.children.forEach(normalizeNode));
    s.collapsed = s.collapsed || {};
    return s;
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return normalizeState(saved ? JSON.parse(saved) : clone(DEFAULT_STATE));
    } catch {
      return normalizeState(clone(DEFAULT_STATE));
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function makeId() {
    return "n-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function allNodesInRoot(rootKey) {
    const out = [];
    const walk = (nodes, parentId = null) => {
      nodes.forEach((n, index) => {
        out.push({ node: n, parentId, index });
        walk(n.children || [], n.id);
      });
    };
    walk(state.roots[rootKey]?.children || []);
    return out;
  }

  function findNode(rootKey, id) {
    return allNodesInRoot(rootKey).find(item => item.node.id === id) || null;
  }

  function getChildrenContainer(rootKey, parentId) {
    if (!parentId) return state.roots[rootKey].children;
    const found = findNode(rootKey, parentId);
    return found ? found.node.children : null;
  }

  function findParentId(rootKey, nodeId) {
    const found = findNode(rootKey, nodeId);
    return found?.parentId ?? null;
  }

  function removeNode(rootKey, nodeId) {
    const found = findNode(rootKey, nodeId);
    if (!found) return null;
    const container = getChildrenContainer(rootKey, found.parentId);
    const [removed] = container.splice(found.index, 1);
    return removed;
  }

  function isDescendant(rootKey, possibleAncestorId, possibleDescendantId) {
    const ancestor = findNode(rootKey, possibleAncestorId)?.node;
    if (!ancestor) return false;
    let yes = false;
    const walk = (nodes) => {
      for (const n of nodes) {
        if (n.id === possibleDescendantId) { yes = true; return; }
        walk(n.children || []);
        if (yes) return;
      }
    };
    walk(ancestor.children || []);
    return yes;
  }

  function selectMainButton(rootKey) {
    $$(".major-button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.root === rootKey);
      btn.setAttribute("aria-expanded", btn.dataset.root === rootKey ? "true" : "false");
    });
  }

  function openRoot(rootKey) {
    activeRootKey = rootKey;
    selectedNodeId = null;
    selectMainButton(rootKey);
    detailPanel.classList.remove("hidden");
    detailTitle.textContent = state.roots[rootKey].label;
    updateToolbarButtons();
    renderTree();
    detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function branchClass() {
    return "branch-" + activeRootKey;
  }

  function gridClass(count) {
    if (count <= 1) return "one";
    if (count === 2) return "two";
    if (count === 3) return "three";
    return "four";
  }

  function renderTree() {
    if (!activeRootKey) return;
    const root = state.roots[activeRootKey];
    treeArea.innerHTML = "";
    treeArea.className = "tree-area " + branchClass() + (editMode ? " editing" : "");

    if (!root.children.length) {
      treeArea.innerHTML = `
        <div class="empty-state">
          <strong>${escapeHtml(root.label)}</strong><br>
          No hay dependencias cargadas para este nivel.
          ${editMode ? "<br>Usa <b>Agregar casilla</b> para crear la primera." : ""}
        </div>`;
      return;
    }

    // Facultades are intentionally shown as four parallel columns, matching the reference.
    // Other roots use one or more columns according to the number of top-level items.
    const columns = activeRootKey === "facultades"
      ? root.children.map(node => [node])
      : chunkForColumns(root.children);

    const grid = document.createElement("div");
    grid.className = `root-grid ${gridClass(columns.length)}`;

    columns.forEach(group => {
      const col = document.createElement("div");
      col.className = "tree-column";

      group.forEach((node, index) => {
        if (activeRootKey === "facultades" && node.children?.length) {
          const title = document.createElement("div");
          title.className = "column-title";
          title.textContent = node.label;
          col.appendChild(title);

          // In edit mode the faculty title itself becomes selectable/movable.
          if (editMode) {
            title.style.cursor = "pointer";
            title.dataset.nodeId = node.id;
            title.addEventListener("click", () => selectNode(node.id));
            title.addEventListener("dblclick", () => {
              selectNode(node.id);
              openRenameDialog();
            });
          }

          const collapsed = !!state.collapsed[node.id];
          if (!collapsed) {
            node.children.forEach(child => col.appendChild(renderNode(child, 0)));
          }
          if (!editMode) {
            title.title = "Clic para desplegar / contraer";
            title.addEventListener("click", () => {
              state.collapsed[node.id] = !state.collapsed[node.id];
              saveState();
              renderTree();
            });
          }
        } else {
          col.appendChild(renderNode(node, 0));
        }
      });
      grid.appendChild(col);
    });

    treeArea.appendChild(grid);
  }

  function chunkForColumns(nodes) {
    if (nodes.length <= 7) return [nodes];
    if (nodes.length <= 14) {
      const split = Math.ceil(nodes.length / 2);
      return [nodes.slice(0, split), nodes.slice(split)];
    }
    const size = Math.ceil(nodes.length / 3);
    return [nodes.slice(0, size), nodes.slice(size, size * 2), nodes.slice(size * 2)];
  }

  function renderNode(node, depth) {
    const block = document.createElement("div");
    block.className = `node-block depth-${Math.min(depth, 3)}`;
    block.dataset.nodeId = node.id;

    const row = document.createElement("div");
    row.className = "node-row";

    const card = document.createElement("button");
    card.type = "button";
    card.className = "node-card" + (node.style === "highlight" ? " highlight" : "");
    card.dataset.nodeId = node.id;
    card.dataset.relation = node.relation || "hierarchical";
    card.innerHTML = `<span class="edit-mark">⋮⋮</span><span class="node-label">${escapeHtml(node.label)}</span>`;

    if (node.children?.length) {
      const mark = document.createElement("span");
      mark.className = "toggle-mark";
      mark.textContent = state.collapsed[node.id] ? "+" : "−";
      card.appendChild(mark);
    }

    if (selectedNodeId === node.id) card.classList.add("selected");

    card.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (editMode) {
        selectNode(node.id);
      } else if (node.children?.length) {
        state.collapsed[node.id] = !state.collapsed[node.id];
        saveState();
        renderTree();
      }
    });

    card.addEventListener("dblclick", (ev) => {
      if (!editMode) return;
      ev.preventDefault();
      selectNode(node.id);
      openRenameDialog();
    });

    if (editMode) {
      card.draggable = true;
      card.addEventListener("dragstart", (ev) => {
        selectNode(node.id);
        ev.dataTransfer.effectAllowed = "move";
        ev.dataTransfer.setData("text/plain", node.id);
      });
      card.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        if (selectedNodeId && selectedNodeId !== node.id && !isDescendant(activeRootKey, selectedNodeId, node.id)) {
          card.classList.add("drop-target");
        }
      });
      card.addEventListener("dragleave", () => card.classList.remove("drop-target"));
      card.addEventListener("drop", (ev) => {
        ev.preventDefault();
        card.classList.remove("drop-target");
        const draggedId = ev.dataTransfer.getData("text/plain");
        if (!draggedId || draggedId === node.id) return;
        if (isDescendant(activeRootKey, draggedId, node.id)) return;
        moveNode(draggedId, node.id);
      });
    }

    row.appendChild(card);
    block.appendChild(row);

    if (node.children?.length) {
      const children = document.createElement("div");
      children.className = "children-wrap" + (state.collapsed[node.id] ? " collapsed" : "");
      node.children.forEach(child => children.appendChild(renderNode(child, depth + 1)));
      block.appendChild(children);
    }

    return block;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function selectNode(id) {
    selectedNodeId = id;
    renderTree();
    updateToolbarButtons();
  }

  function updateToolbarButtons() {
    const hasSelection = !!selectedNodeId;
    [renameNodeBtn, moveNodeBtn, moveUpBtn, moveDownBtn, deleteNodeBtn].forEach(btn => {
      btn.disabled = !hasSelection;
    });
  }

  function setEditMode(on) {
    editMode = on;
    editToggle.classList.toggle("on", on);
    editToggle.textContent = on ? "✓ Terminar edición" : "✎ Modo editar";
    editToolbar.classList.toggle("hidden", !on);
    detailHint.textContent = on
      ? "Selecciona una casilla. Puedes renombrarla, cambiarla de dependencia, reordenarla o arrastrarla encima de otra casilla."
      : "Haz clic sobre las casillas con el símbolo + para desplegar u ocultar sus niveles.";
    if (!on) selectedNodeId = null;
    updateToolbarButtons();
    if (activeRootKey) renderTree();
  }

  function fillParentOptions(excludeId = null) {
    nodeParent.innerHTML = "";
    const rootOpt = document.createElement("option");
    rootOpt.value = "";
    rootOpt.textContent = "— Directamente bajo " + state.roots[activeRootKey].label + " —";
    nodeParent.appendChild(rootOpt);

    allNodesInRoot(activeRootKey).forEach(({ node }) => {
      if (node.id === excludeId) return;
      if (excludeId && isDescendant(activeRootKey, excludeId, node.id)) return;
      const opt = document.createElement("option");
      opt.value = node.id;
      opt.textContent = node.label;
      nodeParent.appendChild(opt);
    });
  }

  function openAddDialog() {
    if (!activeRootKey) return;
    dialogMode = "add";
    dialogTitle.textContent = "Agregar casilla";
    nodeId.value = "";
    nodeLabel.value = "";
    nodeRelation.value = "hierarchical";
    nodeStyle.value = "normal";
    parentField.classList.remove("hidden");
    fillParentOptions();
    nodeParent.value = selectedNodeId || "";
    nodeDialog.showModal();
    setTimeout(() => nodeLabel.focus(), 50);
  }

  function openRenameDialog() {
    if (!selectedNodeId) return;
    const found = findNode(activeRootKey, selectedNodeId);
    if (!found) return;
    dialogMode = "rename";
    dialogTitle.textContent = "Renombrar casilla";
    nodeId.value = selectedNodeId;
    nodeLabel.value = found.node.label;
    nodeRelation.value = found.node.relation || "hierarchical";
    nodeStyle.value = found.node.style || "normal";
    parentField.classList.add("hidden");
    nodeDialog.showModal();
    setTimeout(() => nodeLabel.select(), 50);
  }

  function openMoveDialog() {
    if (!selectedNodeId) return;
    const found = findNode(activeRootKey, selectedNodeId);
    if (!found) return;
    dialogMode = "move";
    dialogTitle.textContent = "Mover casilla";
    nodeId.value = selectedNodeId;
    nodeLabel.value = found.node.label;
    nodeRelation.value = found.node.relation || "hierarchical";
    nodeStyle.value = found.node.style || "normal";
    parentField.classList.remove("hidden");
    fillParentOptions(selectedNodeId);
    nodeParent.value = found.parentId || "";
    nodeDialog.showModal();
  }

  function saveDialog() {
    const label = nodeLabel.value.trim();
    if (!label) {
      nodeLabel.focus();
      return;
    }

    if (dialogMode === "add") {
      const newNode = {
        id: makeId(),
        label,
        relation: nodeRelation.value,
        style: nodeStyle.value,
        children: []
      };
      const container = getChildrenContainer(activeRootKey, nodeParent.value || null);
      if (!container) return;
      container.push(newNode);
      selectedNodeId = newNode.id;
    } else if (dialogMode === "rename") {
      const found = findNode(activeRootKey, selectedNodeId);
      if (!found) return;
      found.node.label = label;
      found.node.relation = nodeRelation.value;
      found.node.style = nodeStyle.value;
    } else if (dialogMode === "move") {
      const current = findNode(activeRootKey, selectedNodeId);
      if (!current) return;
      current.node.label = label;
      current.node.relation = nodeRelation.value;
      current.node.style = nodeStyle.value;
      moveNode(selectedNodeId, nodeParent.value || null, false);
    }

    saveState();
    nodeDialog.close();
    renderTree();
    updateToolbarButtons();
  }

  function moveNode(nodeIdToMove, newParentId, rerender = true) {
    if (newParentId === nodeIdToMove) return;
    if (newParentId && isDescendant(activeRootKey, nodeIdToMove, newParentId)) return;

    const removed = removeNode(activeRootKey, nodeIdToMove);
    if (!removed) return;
    const target = getChildrenContainer(activeRootKey, newParentId || null);
    if (!target) return;
    target.push(removed);
    state.collapsed[newParentId] = false;
    saveState();
    if (rerender) {
      selectedNodeId = nodeIdToMove;
      renderTree();
      updateToolbarButtons();
    }
  }

  function reorderSelected(delta) {
    if (!selectedNodeId) return;
    const found = findNode(activeRootKey, selectedNodeId);
    if (!found) return;
    const container = getChildrenContainer(activeRootKey, found.parentId);
    const newIndex = found.index + delta;
    if (newIndex < 0 || newIndex >= container.length) return;
    [container[found.index], container[newIndex]] = [container[newIndex], container[found.index]];
    saveState();
    renderTree();
  }

  function deleteSelected() {
    if (!selectedNodeId) return;
    const found = findNode(activeRootKey, selectedNodeId);
    if (!found) return;
    const suffix = found.node.children?.length
      ? `\n\nTambién se eliminarán ${found.node.children.length} subdependencia(s) directa(s).`
      : "";
    if (!confirm(`¿Eliminar "${found.node.label}"?${suffix}`)) return;
    removeNode(activeRootKey, selectedNodeId);
    selectedNodeId = null;
    saveState();
    renderTree();
    updateToolbarButtons();
  }

  function setAllCollapsed(collapsed) {
    if (!activeRootKey) return;
    allNodesInRoot(activeRootKey).forEach(({ node }) => {
      if (node.children?.length) state.collapsed[node.id] = collapsed;
    });
    saveState();
    renderTree();
  }

  $$(".major-button").forEach(btn => {
    btn.addEventListener("click", () => openRoot(btn.dataset.root));
  });

  editToggle.addEventListener("click", () => {
    if (!activeRootKey) openRoot("rectoria");
    setEditMode(!editMode);
  });

  addNodeBtn.addEventListener("click", openAddDialog);
  renameNodeBtn.addEventListener("click", openRenameDialog);
  moveNodeBtn.addEventListener("click", openMoveDialog);
  moveUpBtn.addEventListener("click", () => reorderSelected(-1));
  moveDownBtn.addEventListener("click", () => reorderSelected(1));
  deleteNodeBtn.addEventListener("click", deleteSelected);

  expandAllBtn.addEventListener("click", () => setAllCollapsed(false));
  collapseAllBtn.addEventListener("click", () => setAllCollapsed(true));

  saveNodeBtn.addEventListener("click", saveDialog);

  nodeForm.addEventListener("submit", (ev) => {
    // "X" and Cancel close normally. Save is handled by the explicit button.
    if (ev.submitter?.value !== "cancel") ev.preventDefault();
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("¿Restablecer el organigrama original? Se perderán los cambios guardados en este navegador.")) return;
    state = normalizeState(clone(DEFAULT_STATE));
    localStorage.removeItem(STORAGE_KEY);
    selectedNodeId = null;
    saveState();
    if (activeRootKey) renderTree();
  });

  // Open the main detailed branch initially so the page demonstrates the interaction.
  // The overview still remains the first visual level.
  selectMainButton(null);
})();
