let usersDB = {};
let currentUserKey = null;

try {
  usersDB = JSON.parse(localStorage.getItem('utc_users_db')) || {};
} catch (e) {
  usersDB = {};
  try {
    localStorage.removeItem('utc_users_db');
  } catch (err) {}
}

function createDefaultUserProfile(name, email) {
  return {
    nombre: name,
    correo: email,
    telefono: "",
    acta: "Registrada (.PDF)",
    ine: "Carga Validada",
    curp: "",
    prepa: "",
    prepaCarrera: "",
    prepaPeriodo: "",
    uniInstitucion: "",
    uniCarrera: "",
    uniPeriodo: "",
    cursos: "",
    experiencia: "",
    proyectos: "",
    habilidades: "",
    intereses: ""
  };
}

function saveDB() {
  try {
    localStorage.setItem('utc_users_db', JSON.stringify(usersDB));
  } catch (e) {}
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
}

function login() {
  const userInputEl = document.getElementById('login-user');
  const rawInput = userInputEl ? userInputEl.value.trim() : "";
  const userKey = rawInput.toLowerCase();

  if (!userKey) {
    alert("Ingresa un usuario o correo.");
    return;
  }

  if (!usersDB[userKey]) {
    usersDB[userKey] = createDefaultUserProfile(rawInput, userKey);
    saveDB();
  }

  currentUserKey = userKey;

  const modeLabel = document.getElementById('user-mode-label');
  if (modeLabel) {
    modeLabel.innerText = "Usuario: " + usersDB[currentUserKey].nombre;
  }

  showScreen('screen-dashboard');
  goToModule('2');
}

function guestLogin() {
  currentUserKey = 'invitado';
  if (!usersDB['invitado']) {
    usersDB['invitado'] = createDefaultUserProfile("Invitado UTC", "invitado@utc.edu.mx");
    saveDB();
  }

  const modeLabel = document.getElementById('user-mode-label');
  if (modeLabel) {
    modeLabel.innerText = "Modo: Invitado";
  }

  showScreen('screen-dashboard');
  goToModule('2');
}

function logout() {
  currentUserKey = null;
  const userEl = document.getElementById('login-user');
  const passEl = document.getElementById('login-pass');
  if (userEl) userEl.value = "";
  if (passEl) passEl.value = "";
  showScreen('screen-login');
}

function openRegister() {
  const nameEl = document.getElementById('reg-name');
  const emailEl = document.getElementById('reg-email');
  const passEl = document.getElementById('reg-pass');
  if (nameEl) nameEl.value = "";
  if (emailEl) emailEl.value = "";
  if (passEl) passEl.value = "";
  const modal = document.getElementById('modal-register');
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function openUMLModal() {
  const modal = document.getElementById('modal-uml');
  if (modal) modal.classList.add('active');
}

function submitRegister() {
  const nameEl = document.getElementById('reg-name');
  const emailEl = document.getElementById('reg-email');
  const name = nameEl ? nameEl.value.trim() : "";
  const email = emailEl ? emailEl.value.trim().toLowerCase() : "";

  if (!name || !email) {
    alert("Completa el nombre y el correo.");
    return;
  }

  usersDB[email] = createDefaultUserProfile(name, email);
  saveDB();
  currentUserKey = email;

  const modeLabel = document.getElementById('user-mode-label');
  if (modeLabel) {
    modeLabel.innerText = "Usuario: " + name;
  }

  closeModal('modal-register');
  showScreen('screen-dashboard');
  goToModule('2');
}

function goToModule(moduleNum) {
  const select = document.getElementById('module-select');
  if (select) {
    select.value = moduleNum;
  }
  renderModule(moduleNum);
}

function collectCurrentInputs(u) {
  if (document.getElementById('edit-nombre')) u.nombre = document.getElementById('edit-nombre').value;
  if (document.getElementById('edit-telefono')) u.telefono = document.getElementById('edit-telefono').value;
  if (document.getElementById('edit-curp')) u.curp = document.getElementById('edit-curp').value;
  if (document.getElementById('edit-correo')) u.correo = document.getElementById('edit-correo').value;
  if (document.getElementById('edit-prepa')) u.prepa = document.getElementById('edit-prepa').value;
  if (document.getElementById('edit-prepa-carrera')) u.prepaCarrera = document.getElementById('edit-prepa-carrera').value;
  if (document.getElementById('edit-prepa-periodo')) u.prepaPeriodo = document.getElementById('edit-prepa-periodo').value;
  if (document.getElementById('edit-uni-inst')) u.uniInstitucion = document.getElementById('edit-uni-inst').value;
  if (document.getElementById('edit-uni-carrera')) u.uniCarrera = document.getElementById('edit-uni-carrera').value;
  if (document.getElementById('edit-uni-periodo')) u.uniPeriodo = document.getElementById('edit-uni-periodo').value;
  if (document.getElementById('edit-cursos')) u.cursos = document.getElementById('edit-cursos').value;
  if (document.getElementById('edit-experiencia')) u.experiencia = document.getElementById('edit-experiencia').value;
  if (document.getElementById('edit-proyectos')) u.proyectos = document.getElementById('edit-proyectos').value;
  if (document.getElementById('edit-habilidades')) u.habilidades = document.getElementById('edit-habilidades').value;
  if (document.getElementById('edit-intereses')) u.intereses = document.getElementById('edit-intereses').value;
}

function saveModuleData(moduleNum) {
  if (!currentUserKey || !usersDB[currentUserKey]) return;
  const u = usersDB[currentUserKey];
  collectCurrentInputs(u);

  const modeLabel = document.getElementById('user-mode-label');
  if (modeLabel && u.nombre) {
    modeLabel.innerText = "Usuario: " + u.nombre;
  }

  saveDB();

  const nextModule = String(Number(moduleNum) + 1);
  if (Number(moduleNum) < 8) {
    goToModule(nextModule);
  } else {
    renderModule('8');
  }
}

function buildCVDocument(u) {
  const nombre = u.nombre || 'Sin nombre';
  const correo = u.correo || 'No especificado';
  const telefono = u.telefono || 'No especificado';
  const curp = u.curp || 'No especificado';
  const prepa = u.prepa || 'No especificado';
  const prepaCarrera = u.prepaCarrera || 'No especificado';
  const prepaPeriodo = u.prepaPeriodo || 'No especificado';
  const uniInstitucion = u.uniInstitucion || 'No especificado';
  const uniCarrera = u.uniCarrera || 'No especificado';
  const uniPeriodo = u.uniPeriodo || 'No especificado';
  const cursos = u.cursos || 'No especificado';
  const experiencia = u.experiencia || 'No especificado';
  const proyectos = u.proyectos || 'No especificado';
  const habilidades = u.habilidades || 'No especificado';
  const intereses = u.intereses || 'No especificado';

  return [
    '<!DOCTYPE html>',
    '<html lang="es"><head><meta charset="UTF-8"><title>CV - ' + nombre + '</title>',
    '<style>',
    'body{font-family:Arial,sans-serif;padding:32px;color:#0f172a;line-height:1.5;max-width:800px;margin:auto}',
    'h1{margin-bottom:4px;color:#0066cc}',
    '.sub{color:#475569;margin-bottom:20px;border-bottom:2px solid #0066cc;padding-bottom:10px}',
    'h2{font-size:15px;color:#0066cc;margin-top:18px;margin-bottom:6px;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:3px}',
    'p{margin:4px 0}',
    '.btn-bar{margin-top:24px;display:flex;gap:12px}',
    '.btn-print{padding:10px 18px;border:none;border-radius:8px;background:#0066cc;color:#fff;font-weight:bold;cursor:pointer}',
    '@media print{.btn-bar{display:none}}',
    '</style></head><body>',
    '<h1>' + nombre + '</h1>',
    '<div class="sub">Correo: ' + correo + ' | Teléfono: ' + telefono + ' | CURP: ' + curp + '</div>',
    '<h2>Formación Académica</h2>',
    '<p><strong>Preparatoria:</strong> ' + prepa + '</p>',
    '<p><strong>Carrera / Especialidad en Prepa:</strong> ' + prepaCarrera + '</p>',
    '<p><strong>Periodo de Preparatoria:</strong> ' + prepaPeriodo + '</p>',
    '<p><strong>Universidad:</strong> ' + uniInstitucion + '</p>',
    '<p><strong>Carrera Universitaria Actual:</strong> ' + uniCarrera + '</p>',
    '<p><strong>Periodo Universitario:</strong> ' + uniPeriodo + '</p>',
    '<h2>Formación Extracurricular</h2><p>' + cursos + '</p>',
    '<h2>Experiencia Laboral</h2><p>' + experiencia + '</p>',
    '<h2>Proyectos y Prácticas</h2><p>' + proyectos + '</p>',
    '<h2>Habilidades</h2><p>' + habilidades + '</p>',
    '<h2>Intereses</h2><p>' + intereses + '</p>',
    '<div class="btn-bar">',
    '<button class="btn-print" onclick="window.print()">Imprimir</button>',
    '</div>',
    '</body></html>'
  ].join('');
}

function triggerCVAction(mode) {
  if (!currentUserKey) {
    currentUserKey = 'invitado';
    if (!usersDB['invitado']) {
      usersDB['invitado'] = createDefaultUserProfile("Invitado UTC", "invitado@utc.edu.mx");
    }
  }

  const u = usersDB[currentUserKey];
  collectCurrentInputs(u);
  saveDB();

  const safeFileName = (u.nombre || 'usuario').trim().replace(/\s+/g, '_');
  const cvHtml = buildCVDocument(u);
  const blob = new Blob([cvHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  if (mode === 'pdf') {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CV_' + safeFileName + '.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  const cvWindow = window.open(url, '_blank');
  if (cvWindow) {
    cvWindow.onload = function() {
      setTimeout(function() {
        try { cvWindow.print(); } catch (e) {}
      }, 250);
    };
  } else {
    window.print();
  }
}

function printCV() {
  triggerCVAction('print');
}

function renderModule(moduleNum) {
  const card = document.getElementById('module-card');
  if (!card) return;
  const u = usersDB[currentUserKey] || createDefaultUserProfile("Usuario", "");
  let html = '';

  switch (moduleNum) {
    case '2':
      html =
        '<div class="card-header"><span class="material-icons-outlined card-icon">badge</span><h3 class="card-title">2. Perfil de Usuario</h3></div>' +
        '<div class="card-body">' +
          '<div class="field-edit"><label>Nombre:</label><input type="text" id="edit-nombre" value="' + u.nombre + '"></div>' +
          '<div class="field-edit"><label>Teléfono:</label><input type="text" id="edit-telefono" value="' + u.telefono + '"></div>' +
          '<div class="field-item"><strong>Acta Nacimiento:</strong> ' + u.acta + '</div>' +
          '<div class="field-item"><strong>INE:</strong> ' + u.ine + '</div>' +
          '<div class="field-edit"><label>CURP:</label><input type="text" id="edit-curp" value="' + u.curp + '"></div>' +
          '<div class="field-edit"><label>Correo Elec:</label><input type="email" id="edit-correo" value="' + u.correo + '"></div>' +
          '<button class="btn btn-save" onclick="saveModuleData(\'2\')">Guardar y Continuar</button>' +
        '</div>';
      break;
    case '3':
      html =
        '<div class="card-header"><span class="material-icons-outlined card-icon">school</span><h3 class="card-title">3. Formación Académica</h3></div>' +
        '<div class="card-body">' +
          '<div class="field-edit"><label>Preparatoria:</label><input type="text" id="edit-prepa" value="' + u.prepa + '" placeholder="Nombre de la preparatoria"></div>' +
          '<div class="field-edit"><label>Carrera / Especialidad (Prepa):</label><input type="text" id="edit-prepa-carrera" value="' + u.prepaCarrera + '" placeholder="Ej. Programación o Bachillerato General"></div>' +
          '<div class="field-edit"><label>Periodo (Prepa):</label><input type="text" id="edit-prepa-periodo" value="' + u.prepaPeriodo + '" placeholder="Ej. 2019 - 2022"></div>' +
          '<div class="field-edit"><label>Universidad Actual:</label><input type="text" id="edit-uni-inst" value="' + u.uniInstitucion + '" placeholder="Ej. UTC"></div>' +
          '<div class="field-edit"><label>Carrera que Estudias (Universidad):</label><input type="text" id="edit-uni-carrera" value="' + u.uniCarrera + '" placeholder="Ej. Ing. en Tecnologías de la Información"></div>' +
          '<div class="field-edit"><label>Periodo Actual (Universidad):</label><input type="text" id="edit-uni-periodo" value="' + u.uniPeriodo + '" placeholder="Ej. 2024 - 2026 / 7° Cuatrimestre"></div>' +
          '<button class="btn btn-save" onclick="saveModuleData(\'3\')">Guardar y Continuar</button>' +
        '</div>';
      break;
    case '4':
      html =
        '<div class="card-header"><span class="material-icons-outlined card-icon">workspace_premium</span><h3 class="card-title">4. Formación Extracurricular</h3></div>' +
        '<div class="card-body">' +
          '<div class="field-edit"><label>Cursos / Certificaciones:</label><input type="text" id="edit-cursos" value="' + u.cursos + '" placeholder="Cursos, talleres o certificaciones"></div>' +
          '<button class="btn btn-save" onclick="saveModuleData(\'4\')">Guardar y Continuar</button>' +
        '</div>';
      break;
    case '5':
      html =
        '<div class="card-header"><span class="material-icons-outlined card-icon">work</span><h3 class="card-title">5. Experiencia Laboral</h3></div>' +
        '<div class="card-body">' +
          '<div class="field-edit"><label>Empresa y Puesto:</label><input type="text" id="edit-experiencia" value="' + u.experiencia + '" placeholder="Empresa / Rol"></div>' +
          '<button class="btn btn-save" onclick="saveModuleData(\'5\')">Guardar y Continuar</button>' +
        '</div>';
      break;
    case '6':
      html =
        '<div class="card-header"><span class="material-icons-outlined card-icon">folder_special</span><h3 class="card-title">6. Proyectos y Prácticas</h3></div>' +
        '<div class="card-body">' +
          '<div class="field-edit"><label>Proyectos / Prácticas:</label><input type="text" id="edit-proyectos" value="' + u.proyectos + '" placeholder="Descripción de proyectos"></div>' +
          '<button class="btn btn-save" onclick="saveModuleData(\'6\')">Guardar y Continuar</button>' +
        '</div>';
      break;
    case '7':
      html =
        '<div class="card-header"><span class="material-icons-outlined card-icon">psychology</span><h3 class="card-title">7. Habilidades</h3></div>' +
        '<div class="card-body">' +
          '<div class="field-edit"><label>Habilidades:</label><input type="text" id="edit-habilidades" value="' + u.habilidades + '" placeholder="Ej. SQL, JavaScript, Liderazgo"></div>' +
          '<button class="btn btn-save" onclick="saveModuleData(\'7\')">Guardar y Continuar</button>' +
        '</div>';
      break;
    case '8':
      html =
        '<div class="card-header"><span class="material-icons-outlined card-icon">print</span><h3 class="card-title">8. Intereses e Imprimir CV</h3></div>' +
        '<div class="card-body">' +
          '<div class="field-edit" style="margin-bottom: 16px;"><label>Intereses:</label><input type="text" id="edit-intereses" value="' + u.intereses + '" placeholder="Tus intereses profesionales"></div>' +
          '<button class="btn btn-print" onclick="triggerCVAction(\'print\')" style="margin-bottom: 10px;"><span class="material-icons-outlined" style="margin-right: 8px;">print</span> Imprimir CV</button>' +
          '<button class="btn btn-save" onclick="triggerCVAction(\'pdf\')"><span class="material-icons-outlined" style="margin-right: 8px;">picture_as_pdf</span> Descargar PDF</button>' +
        '</div>';
      break;
  }
  card.innerHTML = html;
}