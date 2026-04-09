import './style.css'

const app = document.querySelector('#app')

// ─── Global State ───────────────────────────────────────────────────────────
let appData = {
  profile: {},
  projects: []
}
const ADMIN_PASSWORD = 'endri123'
let sessionAuth = false

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const icons = {
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`,
  trash:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
  upload:   `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>`,
  lock:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
  save:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>`
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatBytes(b) {
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / (1024 * 1024)).toFixed(1) + ' MB'
}

function getExt(name) {
  return (name.split('.').pop() || 'file').toUpperCase().slice(0, 4)
}

function extColor(ext) {
  const map = { PDF: '#cc1016', DOC: '#185abd', DOCX: '#185abd', JPG: '#e67e22', PNG: '#27ae60', ZIP: '#8e44ad' }
  return map[ext] || '#0a66c2'
}

function showToast(msg, type = '') {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.className = 'toast' + (type ? ' ' + type : '')
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2800)
}

// ─── API calls ────────────────────────────────────────────────────────────────
async function fetchProfileData() {
  try {
    const r = await fetch('/api/profile')
    appData = await r.json()
    renderPage()
  } catch (err) {
    console.error('Failed to fetch profile data', err)
  }
}

async function saveProfileData(newData) {
  try {
    const r = await fetch('/api/profile', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': ADMIN_PASSWORD 
      },
      body: JSON.stringify(newData)
    })
    const res = await r.json()
    if (res.success) {
      appData = newData
      showToast('Data berhasil disimpan!', 'success')
      renderPage()
    } else {
      showToast('Gagal menyimpan data.', 'error')
    }
  } catch (err) {
    showToast('Error saat menyimpan.', 'error')
  }
}

async function fetchFiles() {
  try {
    const r = await fetch('/api/files')
    if (!r.ok) return []
    return await r.json()
  } catch { return [] }
}

async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'authorization': ADMIN_PASSWORD },
    body: fd
  })
  return r.json()
}

async function deleteFile(filename) {
  const r = await fetch(`/api/files/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers: { 'authorization': ADMIN_PASSWORD }
  })
  return r.json()
}

// ─── Render components ────────────────────────────────────────────────────────
async function renderPublicDocs() {
  const files = await fetchFiles()
  const container = document.getElementById('docs-list')
  if (!container) return

  if (!files.length) {
    container.innerHTML = '<p class="no-docs">Belum ada lampiran yang tersedia.</p>'
    return
  }

  container.innerHTML = files.map(f => {
    const ext = getExt(f.friendlyName)
    const color = extColor(ext)
    return `
      <div class="doc-item">
        <div class="doc-icon" style="background:${color}">${ext}</div>
        <div class="doc-info">
          <div class="doc-name" title="${f.friendlyName}">${f.friendlyName}</div>
          <div class="doc-size">${formatBytes(f.size)}</div>
        </div>
        <div class="doc-actions">
          <a href="${f.url}" download="${f.friendlyName}" class="btn btn-primary btn-sm" title="Download">
            ${icons.download} Download
          </a>
        </div>
      </div>
    `
  }).join('')
}

async function renderAdminFiles() {
  const files = await fetchFiles()
  const container = document.getElementById('admin-file-list')
  if (!container) return

  if (!files.length) {
    container.innerHTML = '<p class="no-docs">Belum ada file terupload.</p>'
    return
  }

  container.innerHTML = files.map(f => {
    const ext = getExt(f.friendlyName)
    const color = extColor(ext)
    return `
      <div class="admin-doc-item" id="admin-item-${f.filename}">
        <div class="doc-icon" style="background:${color};width:32px;height:32px;font-size:0.65rem;">${ext}</div>
        <div class="doc-info">
          <div class="doc-name" title="${f.friendlyName}">${f.friendlyName}</div>
          <div class="doc-size">${formatBytes(f.size)}</div>
        </div>
        <button class="btn btn-danger" onclick="handleDelete('${f.filename}')">
          ${icons.trash}
        </button>
      </div>
    `
  }).join('')
}

// ─── Modal Logic ──────────────────────────────────────────────────────────────
window.openSettingsModal = function () {
  document.getElementById('settings-modal').classList.add('open')
  if (!sessionAuth) showAuthPanel()
  else showSettingsPanel()
}

window.closeSettingsModal = function () {
  document.getElementById('settings-modal').classList.remove('open')
}

window.switchTab = function(tabName) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active')
  
  document.getElementById('tab-files').style.display = tabName === 'files' ? 'block' : 'none'
  document.getElementById('tab-content').style.display = tabName === 'content' ? 'block' : 'none'
  
  if (tabName === 'content') {
    document.getElementById('json-editor').value = JSON.stringify(appData, null, 2)
  } else {
    renderAdminFiles()
  }
}

window.handleSaveContent = async function() {
  try {
    const newData = JSON.parse(document.getElementById('json-editor').value)
    await saveProfileData(newData)
  } catch (err) {
    showToast('Format JSON tidak valid!', 'error')
  }
}

window.handleDelete = async function (filename) {
  if (!confirm('Hapus file ini?')) return
  const res = await deleteFile(filename)
  if (res.success) {
    showToast('File dihapus.', 'success')
    renderAdminFiles()
    renderPublicDocs()
  } else {
    showToast('Gagal menghapus.', 'error')
  }
}

function showAuthPanel() {
  document.getElementById('auth-panel').style.display = 'block'
  document.getElementById('settings-panel').style.display = 'none'
}

function showSettingsPanel() {
  document.getElementById('auth-panel').style.display = 'none'
  document.getElementById('settings-panel').style.display = 'block'
  switchTab('files')
}

window.checkPassword = function () {
  const val = document.getElementById('pwd-input').value
  if (val === ADMIN_PASSWORD) {
    sessionAuth = true
    document.getElementById('auth-error').textContent = ''
    showSettingsPanel()
  } else {
    document.getElementById('auth-error').textContent = 'Password salah, coba lagi.'
    document.getElementById('pwd-input').value = ''
    document.getElementById('pwd-input').focus()
  }
}

window.triggerFileInput = function () {
  document.getElementById('file-input').click()
}

window.handleFileChange = async function (e) {
  const file = e.target.files[0]
  if (!file) return
  await doUpload(file)
  e.target.value = ''
}

async function doUpload(file) {
  const progressWrap = document.getElementById('upload-progress')
  progressWrap.style.display = 'block'
  const res = await uploadFile(file)
  progressWrap.style.display = 'none'
  if (res.success) {
    showToast('File berhasil diupload!', 'success')
    renderAdminFiles()
    renderPublicDocs()
  } else {
    showToast('Upload gagal: ' + (res.error || 'Unknown error'), 'error')
  }
}

// ─── Main Render ──────────────────────────────────────────────────────────────
function renderPage() {
  const { profile, projects } = appData
  
  app.innerHTML = `
    <div class="container">
      <div class="main-grid">
        <!-- ── Left Column ── -->
        <div>
          <!-- Profile Card -->
          <section class="card profile-card">
            <div class="banner"></div>
            <div class="profile-pic-container">
              <div class="profile-pic">
                <img src="${profile.photo || '/assets/profile.jpeg'}" alt="${profile.name}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            </div>
            <div class="profile-info">
              <h1>${profile.name}</h1>
              <p style="font-size:1rem;margin-top:4px;">${profile.role}</p>
              <p class="text-secondary" style="margin-top:4px;">${profile.location}</p>
              <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
                ${profile.socials.map(s => `
                  <a href="${s.url}" target="_blank" class="btn ${s.name === 'Email' ? 'btn-primary' : 'btn-secondary'}">${s.name}</a>
                `).join('')}
              </div>
            </div>
          </section>

          <!-- About -->
          <section class="card">
            <h2>About</h2>
            <p style="font-size:0.875rem;">${profile.bio}</p>
            <blockquote style="margin-top:12px;font-style:italic;color:var(--text-secondary);border-left:3px solid var(--border-color);padding-left:12px;font-size:0.875rem;">
              ${profile.quote}
            </blockquote>
          </section>

          <!-- Experience -->
          <section class="card">
            <h2>Experience</h2>
            ${profile.experience.map(exp => `
              <div class="list-item">
                <h3>${exp.role}</h3>
                <p style="font-weight:600;font-size:0.875rem;">${exp.company}</p>
                <p class="text-secondary" style="margin-bottom:8px;">${exp.period}</p>
                <p style="font-size:0.875rem;">${exp.description}</p>
              </div>
            `).join('')}
          </section>

          <!-- Projects -->
          <section class="card">
            <h2>Projects</h2>
            <div class="project-grid">
              ${projects.map(p => `
                <div class="project-card">
                  <h3 style="margin-bottom:6px;">${p.name}</h3>
                  <p style="font-size:0.8rem;flex-grow:1;margin-bottom:10px;color:var(--text-secondary);">${p.description}</p>
                  <div>${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Education -->
          <section class="card">
            <h2>Education</h2>
            ${profile.education.map(e => `
              <div class="list-item">
                <h3>${e.school}</h3>
                <p style="font-size:0.875rem;">${e.degree}</p>
                <p class="text-secondary">${e.period}</p>
              </div>
            `).join('')}
          </section>

          <!-- Documents (public) -->
          <section class="card">
            <h2>📎 Lampiran &amp; Dokumen</h2>
            <div id="docs-list" class="docs-list">
              <p class="no-docs">Memuat dokumen…</p>
            </div>
          </section>
        </div>

        <!-- ── Right Column ── -->
        <div>
          <!-- Skills -->
          <section class="card">
            <h2>Skills</h2>
            ${profile.skills.map(g => `
              <div style="margin-bottom:14px;">
                <h3 style="font-size:0.825rem;margin-bottom:6px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;">${g.category}</h3>
                <div>${g.items.map(i => `<span class="tag">${i}</span>`).join('')}</div>
              </div>
            `).join('')}
          </section>

          <!-- Certifications -->
          <section class="card">
            <h2>Licenses &amp; Certifications</h2>
            ${profile.certifications.map(c => `
              <div class="list-item">
                <p style="font-size:0.875rem;font-weight:600;">${c}</p>
              </div>
            `).join('')}
          </section>
        </div>
      </div>
    </div>

    <!-- ── Floating Settings Button ── -->
    <button class="fab-settings" id="fab-btn" onclick="openSettingsModal()" title="Settings">
      ${icons.settings}
    </button>

    <!-- ── Settings Modal ── -->
    <div class="modal-overlay" id="settings-modal" onclick="if(event.target===this) closeSettingsModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>⚙️ Settings</h3>
          <button class="modal-close" onclick="closeSettingsModal()">✕</button>
        </div>
        <div class="modal-body">

          <!-- Auth Panel -->
          <div id="auth-panel">
            <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:16px;">
              Panel dilindungi password.
            </p>
            <div class="auth-form">
              <label for="pwd-input">${icons.lock} Password</label>
              <input type="password" id="pwd-input" placeholder="Masukkan password…"
                onkeydown="if(event.key==='Enter') checkPassword()">
              <p class="auth-error" id="auth-error"></p>
              <button class="btn btn-primary" onclick="checkPassword()">Masuk</button>
            </div>
          </div>

          <!-- Settings Panel -->
          <div id="settings-panel" style="display:none;">
            <div class="tabs">
              <button class="tab-btn active" onclick="switchTab('files')">Files</button>
              <button class="tab-btn" onclick="switchTab('content')">Content JSON</button>
            </div>

            <div id="tab-files">
              <div class="upload-area" id="upload-area" onclick="triggerFileInput()"
                ondragover="event.preventDefault();this.classList.add('dragover')"
                ondragleave="this.classList.remove('dragover')"
                ondrop="event.preventDefault();this.classList.remove('dragover');handleFileChange({target:{files:event.dataTransfer.files}})">
                ${icons.upload}
                <p><strong>Klik untuk pilih file</strong> atau drag &amp; drop</p>
                <input type="file" id="file-input" onchange="handleFileChange(event)">
              </div>
              <div class="upload-progress" id="upload-progress">
                <p style="font-size:0.8rem;margin-bottom:4px;">Mengupload…</p>
                <progress></progress>
              </div>
              <div class="admin-file-list">
                <h4>📂 File Terupload</h4>
                <div id="admin-file-list"><p class="no-docs">Memuat…</p></div>
              </div>
            </div>

            <div id="tab-content" style="display:none;">
              <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:10px;">
                Edit raw JSON data untuk mengubah seluruh konten halaman secara instan.
              </p>
              <textarea id="json-editor" spellcheck="false" style="width:100%;height:350px;font-family:monospace;font-size:0.8rem;padding:12px;border:1px solid var(--border-color);border-radius:8px;outline:none;background:#f8f9fa;resize:vertical;"></textarea>
              <div style="margin-top:16px;display:flex;justify-content:flex-end;">
                <button class="btn btn-primary" onclick="handleSaveContent()">
                  ${icons.save} Simpan Perubahan
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" id="toast"></div>
  `
  renderPublicDocs()
}

// Initial fetch
fetchProfileData()
