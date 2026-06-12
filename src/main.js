import './style.css'

const app = document.querySelector('#app')

// ─── Global State ───────────────────────────────────────────────────────────
let appData = {
  basics: {
    name: '',
    label: '',
    image: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: {},
    profiles: []
  },
  skills: {},
  work: [],
  education: [],
  certifications: [],
  projects: [],
  awards: [],
  innovations: [],
  languages: [],
  technicalInterests: []
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
function normalizeProfileData(data) {
  if (!data) return data
  if (data.basics) {
    // Ensure all optional arrays are initialized to avoid undefined errors
    data.projects = data.projects || []
    data.work = data.work || []
    data.education = data.education || []
    data.certifications = data.certifications || []
    data.awards = data.awards || []
    data.innovations = data.innovations || []
    data.languages = data.languages || []
    data.technicalInterests = data.technicalInterests || []
    return data
  }
  
  const oldProfile = data.profile || {}
  const oldProjects = data.projects || []
  
  const profiles = []
  let email = ''
  if (Array.isArray(oldProfile.socials)) {
    oldProfile.socials.forEach(s => {
      if (s.name === 'Email') {
        email = s.url.replace('mailto:', '')
      } else {
        profiles.push({
          network: (s.name || '').toLowerCase(),
          username: (s.url || '').split('/').pop() || '',
          url: s.url || ''
        })
      }
    })
  }
  
  const skills = {}
  if (Array.isArray(oldProfile.skills)) {
    oldProfile.skills.forEach(g => {
      const categoryKey = (g.category || '').toLowerCase().replace(/[^a-z0-9]/g, '_') || 'skills'
      skills[categoryKey] = (g.items || []).map(item => {
        let level = 4
        if (categoryKey.includes('languages') || categoryKey.includes('development') || categoryKey.includes('frameworks')) {
          level = 80
        }
        return { name: item, level: level }
      })
    })
  }
  
  const work = []
  if (Array.isArray(oldProfile.experience)) {
    oldProfile.experience.forEach((exp, idx) => {
      const parts = (exp.period || '').split(' – ')
      const startDate = parts[0] || ''
      const endPart = parts[1] || ''
      const isWorkingHere = endPart.toLowerCase().includes('present')
      const endDate = isWorkingHere ? null : endPart.split(' · ')[0]
      const years = (exp.period || '').includes('·') ? (exp.period || '').split(' · ')[1] : ''
      
      work.push({
        id: String(idx + 1),
        name: exp.company || '',
        position: exp.role || '',
        url: '',
        startDate: startDate,
        isWorkingHere: isWorkingHere,
        endDate: endDate,
        highlights: [exp.description || ''],
        summary: `<p>${exp.description || ''}</p>`,
        years: years
      })
    })
  }
  
  const education = []
  if (Array.isArray(oldProfile.education)) {
    oldProfile.education.forEach((edu, idx) => {
      const parts = (edu.period || '').split(' – ')
      const startDate = parts[0] || ''
      const endDate = parts[1] || ''
      education.push({
        id: String(idx + 1),
        institution: edu.school || '',
        url: '',
        studyType: edu.degree || '',
        area: '',
        startDate: startDate,
        isStudyingHere: false,
        endDate: endDate,
        score: '',
        courses: []
      })
    })
  }
  
  let involvements = ''
  if (oldProjects.length) {
    involvements = '<ul>' + oldProjects.map(p => `<li><strong>${p.name || ''}</strong>: ${p.description || ''} <em>(${Array.isArray(p.tags) ? p.tags.join(', ') : ''})</em></li>`).join('') + '</ul>'
  }
  
  const awards = []
  if (Array.isArray(oldProfile.certifications)) {
    oldProfile.certifications.forEach((c, idx) => {
      awards.push({
        id: String(idx + 1),
        title: c || '',
        date: '',
        awarder: '',
        summary: ''
      })
    })
  }
  
  return {
    basics: {
      name: oldProfile.name || '',
      label: oldProfile.role || '',
      image: oldProfile.photo || '',
      email: email,
      phone: '',
      url: '',
      summary: oldProfile.bio || '',
      location: {
        address: '',
        postalCode: '',
        city: oldProfile.location || '',
        countryCode: '',
        region: ''
      },
      objective: oldProfile.quote || '',
      profiles: profiles
    },
    skills: skills,
    work: work,
    education: education,
    activities: {
      involvements: involvements,
      achievements: ''
    },
    volunteer: [],
    awards: awards
  }
}

async function fetchProfileData() {
  try {
    const r = await fetch('/api/profile')
    const rawData = await r.json()
    appData = normalizeProfileData(rawData)
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
      appData = normalizeProfileData(newData)
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
// ─── Helper Renderers for New JSON Structure ──────────────────────────────────
function renderSkillLevel(name, level) {
  if (level > 5) {
    // Percentage format (0-100)
    return `
      <div class="skill-item-bar">
        <div class="skill-info-row">
          <span class="skill-name">${name}</span>
          <span class="skill-percentage">${level}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${level}%"></div>
        </div>
      </div>
    `
  } else {
    // Scale format (1-5)
    let dots = ''
    for (let i = 1; i <= 5; i++) {
      dots += `<span class="rating-dot ${i <= level ? 'active' : ''}"></span>`
    }
    return `
      <div class="skill-item-dot">
        <span class="skill-name">${name}</span>
        <div class="rating-dots-container">${dots}</div>
      </div>
    `
  }
}

function renderSkillsSection() {
  const skillsObj = appData.skills || {}
  const categories = Object.keys(skillsObj)
  if (!categories.length) return ''

  const categoryNames = {
    programming: 'Programming Languages',
    automation: 'Process & Workflow Automation',
    qa: 'Quality Assurance & Validation',
    android_engineering: 'Android & Device Engineering',
    application_analysis: 'Application Analysis & Modernization',
    browser_api_integration: 'Browser API & Integration',
    cybersecurity_testing: 'Cybersecurity & Performance Testing',
    industrial_automation: 'Industrial Automation',
    embedded_iot: 'Embedded Systems & IoT',
    infrastructure: 'Infrastructure & DevOps',
    smart_systems: 'Smart Home & Edge Systems',
    languages: 'Programming Languages',
    frameworks: 'Frameworks & Runtimes',
    technologies: 'Technologies & Ecosystems',
    libraries: 'Libraries',
    databases: 'Databases',
    practices: 'Methodologies & Practices',
    tools: 'Developer Tools'
  }

  return `
    <section class="card">
      <h2>Skills &amp; Expertise</h2>
      <div class="skills-main-grid">
        ${categories.map(cat => {
          const list = skillsObj[cat] || []
          if (!list.length) return ''
          const title = categoryNames[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))
          return `
            <div class="skill-category-group" style="margin-bottom:0;">
              <h3 class="skill-category-title">${title}</h3>
              <div class="skill-items-list">
                ${list.map(s => renderSkillLevel(s.name, s.level)).join('')}
              </div>
            </div>
          `
        }).join('')}
      </div>
    </section>
  `
}

function renderWork(work) {
  const dateStr = `${work.startDate} – ${work.isWorkingHere ? 'Present' : (work.endDate || '')}`
  const periodStr = work.years ? `${dateStr} · ${work.years}` : dateStr
  const descContent = work.summary || (work.highlights && work.highlights.length ? `<ul>${work.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : '')
  
  return `
    <div class="list-item">
      <h3>${work.position}</h3>
      <p style="font-weight:600;font-size:0.875rem;margin-top:2px;">${work.name}</p>
      <p class="text-secondary" style="margin-top:2px;margin-bottom:8px;">${periodStr}</p>
      <div class="markdown-content">${descContent}</div>
    </div>
  `
}

function renderProjectsSection() {
  const projects = appData.projects || []
  if (!projects.length) return ''
  
  return `
    <section class="card">
      <h2>Projects</h2>
      <div class="project-grid">
        ${projects.map(p => `
          <div class="project-card">
            <h3 style="margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
              <span>${p.name}</span>
              ${p.url ? `<a href="${p.url}" target="_blank" style="font-size: 0.8rem; font-weight: 500;">Link</a>` : ''}
            </h3>
            <p style="font-size:0.825rem;flex-grow:1;margin-bottom:12px;color:var(--text-secondary);line-height:1.5;">${p.description}</p>
            <div style="margin-top:auto; display:flex; flex-wrap:wrap; gap:4px;">
              ${(p.technologies || []).map(t => `<span class="tag" style="margin:0;">${t}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `
}

function renderInnovationsSection() {
  const innovations = appData.innovations || []
  if (!innovations.length) return ''
  
  return `
    <section class="card">
      <h2>Innovations &amp; Productivity Improvements</h2>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${innovations.map(inv => {
          const isAdopted = (inv.status || '').toLowerCase().includes('adopt') && !(inv.status || '').toLowerCase().includes('non')
          const statusColor = isAdopted ? 'var(--success-color)' : 'var(--text-secondary)'
          const statusBg = isAdopted ? 'rgba(5, 118, 66, 0.08)' : '#dee2e6'
          return `
            <div style="border: 1px solid var(--border-color); padding: 12px 14px; border-radius: var(--border-radius); transition: all 0.2s;">
              <h3 style="font-size: 0.95rem; line-height: 1.4; margin-bottom: 6px;">${inv.title}</h3>
              <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; font-size:0.75rem; font-weight:600;">
                ${inv.classification ? `<span style="background:var(--accent-light); color:var(--accent-color); padding: 2px 8px; border-radius: 4px;">${inv.classification}</span>` : ''}
                ${inv.status ? `<span style="background:${statusBg}; color:${statusColor}; padding: 2px 8px; border-radius: 4px;">${inv.status}</span>` : ''}
                ${inv.impact ? `<span style="background:rgba(230, 126, 34, 0.1); color:#e67e22; padding: 2px 8px; border-radius: 4px; border: 1px dashed #e67e22;">★ ${inv.impact}</span>` : ''}
              </div>
            </div>
          `
        }).join('')}
      </div>
    </section>
  `
}

function renderCertificationsSection() {
  const certs = appData.certifications || []
  if (!certs.length) return ''
  
  return `
    <section class="card">
      <h2>Licenses &amp; Certifications</h2>
      ${certs.map(c => `
        <div class="list-item">
          <h3>${c.name}</h3>
          <p class="text-secondary" style="margin-top:2px; font-size:0.8rem;">${c.issuer || ''}</p>
        </div>
      `).join('')}
    </section>
  `
}

function renderAwardsSection() {
  const awards = appData.awards || []
  if (!awards.length) return ''
  
  return `
    <section class="card">
      <h2>Awards &amp; Recognition</h2>
      ${awards.map(a => `
        <div class="list-item">
          <h3>${a.title}</h3>
          <p style="font-weight:600;font-size:0.875rem;margin-top:2px;">${a.awarder}</p>
          ${a.date ? `<p class="text-secondary" style="margin-top:2px; font-size:0.8rem;">${a.date}</p>` : ''}
        </div>
      `).join('')}
    </section>
  `
}

function renderLanguagesSection() {
  const langs = appData.languages || []
  if (!langs.length) return ''
  
  return `
    <section class="card">
      <h2>Languages</h2>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${langs.map((l, index) => `
          <div style="display:flex; flex-direction:column; gap:2px; font-size:0.875rem; ${index < langs.length - 1 ? 'border-bottom: 1px solid var(--border-color); padding-bottom: 8px;' : ''}">
            <span style="font-weight:600; color: var(--text-primary);">${l.language}</span>
            <span class="text-secondary" style="font-size:0.8rem;">${l.fluency}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `
}

function renderInterestsSection() {
  const interests = appData.technicalInterests || []
  if (!interests.length) return ''
  
  return `
    <section class="card">
      <h2>Technical Interests</h2>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        ${interests.map(interest => `<span class="tag" style="background-color: var(--accent-light); color: var(--accent-color); font-weight: 550; font-size:0.75rem; padding:4px 8px; margin:0;">${interest}</span>`).join('')}
      </div>
    </section>
  `
}

// ─── Main Render ──────────────────────────────────────────────────────────────
function renderPage() {
  const basics = appData.basics || {}
  const name = basics.name || ''
  const label = basics.label || ''
  const photo = basics.image || '/assets/profile.jpeg'
  const loc = basics.location || {}
  const locationStr = [loc.city, loc.region, loc.countryCode].filter(Boolean).join(', ')

  const email = basics.email ? { name: 'Email', url: `mailto:${basics.email}` } : null
  const phone = basics.phone ? { name: 'Phone', url: `tel:${basics.phone.replace(/\s+/g, '')}` } : null
  const website = basics.url ? { name: 'Website', url: basics.url } : null
  const socialProfiles = (basics.profiles || []).map(p => {
    const net = p.network || ''
    return {
      name: net ? net.charAt(0).toUpperCase() + net.slice(1) : 'Social',
      url: p.url || '#'
    }
  })
  const allContacts = [email, phone, website, ...socialProfiles].filter(Boolean)

  const workList = appData.work || []
  const educationList = appData.education || []

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
                <img src="${photo}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            </div>
            <div class="profile-info">
              <h1>${name}</h1>
              <p style="font-size:1rem;margin-top:4px;">${label}</p>
              <p class="text-secondary" style="margin-top:4px;">${locationStr}</p>
              <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
                ${allContacts.map(c => `
                  <a href="${c.url}" target="_blank" class="btn ${c.name === 'Email' ? 'btn-primary' : 'btn-secondary'}">${c.name}</a>
                `).join('')}
              </div>
            </div>
          </section>

          <!-- About & Objective -->
          <section class="card">
            <h2>About</h2>
            <p style="font-size:0.875rem;line-height:1.6;color:var(--text-primary);">${basics.summary || ''}</p>
            ${basics.objective ? `
              <div style="margin-top:16px;padding:14px;background:var(--accent-light);border-left:4px solid var(--accent-color);border-radius:0 var(--border-radius) var(--border-radius) 0;">
                <h4 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-color);margin-bottom:6px;">Career Objective</h4>
                <p style="font-size:0.875rem;font-style:italic;color:var(--text-primary);line-height:1.5;margin:0;">${basics.objective}</p>
              </div>
            ` : ''}
          </section>

          <!-- Experience -->
          <section class="card">
            <h2>Experience</h2>
            ${workList.map(w => renderWork(w)).join('')}
          </section>

          <!-- Skills & Expertise -->
          ${renderSkillsSection()}

          <!-- Innovations -->
          ${renderInnovationsSection()}

          <!-- Projects -->
          ${renderProjectsSection()}

          <!-- Legacy Involvements (Fallback) -->
          ${appData.activities && appData.activities.involvements ? `
            <section class="card">
              <h2>Projects &amp; Involvements (Legacy)</h2>
              <div class="markdown-content">
                ${appData.activities.involvements}
              </div>
            </section>
          ` : ''}

          <!-- Legacy Achievements (Fallback) -->
          ${appData.activities && appData.activities.achievements ? `
            <section class="card">
              <h2>Achievements &amp; Milestones (Legacy)</h2>
              <div class="markdown-content">
                ${appData.activities.achievements}
              </div>
            </section>
          ` : ''}

          <!-- Education -->
          <section class="card">
            <h2>Education</h2>
            ${educationList.map(e => `
              <div class="list-item">
                <h3>${e.institution}</h3>
                <p style="font-size:0.875rem;margin-top:2px;">${e.studyType}${e.area ? ' in ' + e.area : ''}</p>
                <p class="text-secondary" style="margin-top:2px;">${e.startDate} – ${e.endDate || 'Present'}</p>
                ${e.location ? `<p class="text-secondary" style="font-size:0.8rem;margin-top:2px;">📍 ${e.location}</p>` : ''}
                ${e.highlights && e.highlights.length ? `
                  <div class="markdown-content" style="margin-top:8px;">
                    <ul>
                      ${e.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
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
          <!-- Certifications -->
          ${renderCertificationsSection()}

          <!-- Awards -->
          ${renderAwardsSection()}

          <!-- Languages -->
          ${renderLanguagesSection()}

          <!-- Technical Interests -->
          ${renderInterestsSection()}
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
