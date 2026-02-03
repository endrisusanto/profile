import './style.css'
import * as THREE from 'three'

const app = document.querySelector('#app')

const profile = {
  name: 'Endri Susanto',
  role: 'Software Quality Engineer | Product Engineer',
  location: 'North Cikarang, West Java, Indonesia',
  quote: '"Choose a job you love, and you will never have to work a day in your life."',
  bio: 'Innovative and experienced Software Quality Assurance Engineer with a consistent track record in the electrical and electronic manufacturing industry. Proficient in Computer Science, IT, Automation, Office Administration, and Web Applications. I am a tech-savvy engineering professional focused on implementing cutting-edge technology, holding an Associate Degree in Electrical and Electronics Engineering from Universitas Diponegoro.',
  skills: [
    { category: 'Core Skills', items: ['Testing', 'SQL', 'Creative Problem Solving (Pemecahan Masalah Kreatif)', 'Automation'] },
    { category: 'Development', items: ['Modern JavaScript', 'Vite', 'Node.js', 'PHP', 'Python', 'Web Applications'] },
    { category: 'Languages', items: ['English (Professional Working)', 'Bahasa Korea (Elementary)', 'Bahasa Indonesia (Native)'] }
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com/endrisusanto', icon: 'Code' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/endrisusanto/', icon: 'Link' },
    { name: 'Email', url: 'mailto:gmail@endrisusanto.my.id', icon: 'Mail' }
  ],
  experience: [
    {
      company: 'Samsung Electronics',
      role: 'Software Quality Engineer | Product Engineer',
      period: 'January 2016 - Present (10 years 2 months)',
      description: 'A Software Quality Assurance (SQA) Engineer’s role in the AOSP Compatibility Test Suite involves ensuring that the software adheres to quality standards and specifications set by the AOSP. This includes designing and executing test cases, identifying and documenting software defects, and collaborating with the development team to resolve issues. SQA Engineers also play a crucial role in maintaining and improving testing processes to ensure the overall quality and compatibility of the Android platform across various devices.'
    }
  ],
  education: [
    {
      school: 'Diponegoro University',
      degree: 'Associate\'s degree, Electrical and Electronics Engineering',
      period: '2012 - 2015'
    },
    {
      school: 'SMK Negeri 2 Pati',
      degree: 'High School Diploma, Automation Engineer Technology/Technician',
      period: 'May 2009 - July 2012'
    }
  ],
  certifications: [
    'Leading with Vision',
    'Talent Management',
    'Developing Managers in Organizations'
  ]
}

const projects = [
  {
    name: 'Gang Ambyar Super App',
    description: 'All-in-one community platform featuring digital Ronda scheduling with attendance tracking, Iuran financial management with WhatsApp reminders, and a real-time Flood Monitoring system (Pantau Banjir) with interactive water level charts.',
    tags: ['Full Stack', 'Community', 'Data Visualization', 'Automation'],
    link: '#'
  },
  {
    name: 'YouTube Heatmap Clipper',
    description: 'Intelligent video processing tool utilizing AI to detect and automatically clip high-engagement segments from YouTube videos using heatmap data and scene detection.',
    tags: ['AI', 'FFmpeg', 'Python', 'Automation'],
    link: '#'
  },
  {
    name: 'QRIS Donation System',
    description: 'Dynamic payment solution generating secure QRIS codes with auto-expiration blurring, session-based donation tracking, and real-time validation logic.',
    tags: ['Fintech', 'Payment Gateway', 'Security', 'UX'],
    link: '#'
  },
  {
    name: 'Companion Release Cheatsheet',
    description: 'Streamlined release management workflow specifically designed for tracking system builds (QB CSC) and coordinating deployment checklists.',
    tags: ['DevOps', 'Internal Tools', 'React', 'Productivity'],
    link: '#'
  },
  {
    name: 'Personal Developer Portfolio',
    description: 'Modern, high-performance portfolio website built with Vite and Vanilla JS. Features a glassmorphism aesthetic, responsive grid layouts, and smooth CSS animations.',
    tags: ['Vite', 'Modern CSS', 'Performance', 'Design'],
    link: '#'
  }
]

// Initialize 3D Background
function initThreeJS() {
  const canvasContainer = document.createElement('div');
  canvasContainer.id = 'canvas-bg';
  document.body.prepend(canvasContainer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 2;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // Animate
  const clock = new THREE.Clock();

  const tick = () => {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y = .1 * elapsedTime;
    particlesMesh.rotation.x += .05 * (targetY - particlesMesh.rotation.x);
    particlesMesh.rotation.y += .05 * (targetX - particlesMesh.rotation.y);

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

initThreeJS();

// Render Content
app.innerHTML = `
  <!-- Section 1: Hero -->
  <section class="snap-section">
      <div class="container fade-in-up">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <span style="display: inline-block; padding: 0.5rem 1rem; border-radius: 50px; background: rgba(56, 189, 248, 0.1); color: var(--accent-color); font-weight: 500; font-size: 0.875rem; margin-bottom: 1.5rem;">
            ${profile.role}
            </span>
            <h1 class="text-gradient" style="font-size: clamp(3rem, 5vw, 4.5rem); margin-bottom: 1.5rem; letter-spacing: -0.02em;">
            ${profile.name}
            </h1>
            <p style="color: var(--text-secondary); font-size: 1.125rem; margin-bottom: 2rem;">
            <span style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1.25rem; height: 1.25rem;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                ${profile.location}
            </span>
            </p>
            <p style="color: var(--text-secondary); font-size: 1.25rem; line-height: 1.8; margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            ${profile.bio}
            </p>
            <blockquote style="font-style: italic; color: var(--text-secondary); opacity: 0.8; margin-bottom: 3rem; font-size: 1.1rem; border-left: 3px solid var(--accent-color); padding-left: 1rem; display: inline-block;">
            ${profile.quote}
            </blockquote>
            <div style="display: flex; gap: 1rem; justify-content: center;">
            <a href="#projects" class="btn btn-primary" onclick="document.querySelector('#projects').scrollIntoView({behavior: 'smooth'})">View Projects</a>
            <a href="${profile.socials.find(s => s.name === 'Email').url}" class="btn btn-secondary">Contact Me</a>
            </div>
        </div>
      </div>
  </section>

  <!-- Section 2: Experience -->
  <section class="snap-section">
      <div class="container">
        <div class="glass-card fade-in-up" style="padding: 2.5rem; max-width: 900px; margin: 0 auto;">
            <h2 style="margin-bottom: 2rem; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; text-align: center;">Professional Experience</h2>
            ${profile.experience.map(exp => `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">${exp.role}</h3>
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                    <div style="color: var(--accent-color); font-weight: 500; font-size: 1.1rem;">${exp.company}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem; opacity: 0.8; background: rgba(255,255,255,0.05); padding: 0.25rem 0.75rem; border-radius: 12px;">${exp.period}</div>
                </div>
                <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">${exp.description}</p>
            </div>
            `).join('')}
        </div>
      </div>
  </section>

  <!-- Section 3: Education & Certs -->
  <section class="snap-section">
      <div class="container">
         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            <div class="glass-card fade-in-up" style="padding: 2.5rem;">
                <h2 style="margin-bottom: 2rem; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">Education</h2>
                ${profile.education.map(edu => `
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.25rem;">${edu.school}</h3>
                    <div style="color: var(--accent-color); font-weight: 500; margin-bottom: 0.5rem;">${edu.degree}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem; opacity: 0.8;">${edu.period}</div>
                </div>
                `).join('')}
            </div>
            
            <div class="glass-card fade-in-up delay-100" style="padding: 2.5rem;">
                <h2 style="margin-bottom: 2rem; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">Certifications</h2>
                <ul style="list-style: none; padding: 0;">
                ${profile.certifications.map(cert => `
                    <li style="margin-bottom: 1rem; color: var(--text-secondary); display: flex; align-items: center; background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 8px;">
                    <span style="color: var(--accent-color); margin-right: 0.75rem; font-weight: bold;">✓</span>
                    ${cert}
                    </li>
                `).join('')}
                </ul>
            </div>
         </div>
      </div>
  </section>

  <!-- Section 4: Skills -->
  <section class="snap-section">
      <div class="container">
        <div class="glass-card fade-in-up" style="padding: 3rem;">
            <h2 style="margin-bottom: 3rem; text-align: center;">Technical Skills</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 3rem;">
                ${profile.skills.map(skillGroup => `
                    <div>
                        <h3 style="color: var(--accent-color); margin-bottom: 1.5rem; font-size: 1.4rem; border-left: 3px solid var(--accent-color); padding-left: 1rem;">${skillGroup.category}</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${skillGroup.items.map(item => `
                                <li style="margin-bottom: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; font-size: 1.1rem;">
                                    <span style="display: inline-block; width: 6px; height: 6px; background: var(--text-primary); border-radius: 50%; margin-right: 1rem; opacity: 0.5;"></span>
                                    ${item}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
      </div>
  </section>

  <!-- Section 5: Projects -->
  <section class="snap-section" id="projects">
      <div class="container">
        <h2 style="margin-bottom: 3rem; font-size: 2.5rem; text-align: center;">Featured Projects</h2>
        <div class="fade-in-up" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; max-height: 80vh; overflow-y: auto; padding-right: 0.5rem; scrollbar-width: thin;">
        ${projects.map(project => `
            <div class="glass-card" style="display: flex; flex-direction: column;">
            <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${project.tags.map(tag => `
                <span style="font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 20px; background: rgba(255,255,255,0.05); color: var(--accent-color);">
                    ${tag}
                </span>
                `).join('')}
            </div>
            <h3 style="margin-bottom: 0.75rem; font-size: 1.25rem;">${project.name}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.5;">${project.description}</p>
            <a href="${project.link}" style="margin-top: auto; display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent-color); font-weight: 500; font-size: 0.9rem;">
                View Details <span>&rarr;</span>
            </a>
            </div>
        `).join('')}
        </div>
      </div>
  </section>

  <!-- Section 6: Footer -->
  <section class="snap-section" style="min-height: 20vh; justify-content: flex-end;">
    <footer style="text-align: center; padding: 4rem 0 2rem; color: var(--text-secondary);">
        <div class="container">
            <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem;">
                ${profile.socials.map(social => `
                    <a href="${social.url}" target="_blank" style="color: var(--text-primary); opacity: 0.8; transition: opacity 0.2s; font-size: 1.2rem;">
                        ${social.name}
                    </a>
                `).join('')}
            </div>
            <p>&copy; ${new Date().getFullYear()} ${profile.name}. All rights reserved.</p>
        </div>
    </footer>
  </section>
`
