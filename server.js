import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 80;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROFILE_DATA_PATH = path.join(UPLOADS_DIR, 'profile_data.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial Data
const initialProfileData = {
  profile: {
    name: 'Endri Susanto',
    role: 'Software Quality Engineer | Product Engineer',
    location: 'North Cikarang, West Java, Indonesia',
    photo: '/assets/profile.jpeg',
    quote: '"Choose a job you love, and you will never have to work a day in your life."',
    bio: 'Innovative and experienced Software Quality Assurance Engineer with a consistent track record in the electrical and electronic manufacturing industry. Proficient in Computer Science, IT, Automation, Office Administration, and Web Applications. I am a tech-savvy engineering professional focused on implementing cutting-edge technology, holding an Associate Degree in Electrical and Electronics Engineering from Universitas Diponegoro.',
    skills: [
      { category: 'Core Skills', items: ['Testing', 'SQL', 'Creative Problem Solving', 'Automation'] },
      { category: 'Development', items: ['Modern JavaScript', 'Vite', 'Node.js', 'PHP', 'Python', 'Web Applications'] },
      { category: 'Languages', items: ['English (Professional)', 'Korean (Elementary)', 'Bahasa Indonesia (Native)'] }
    ],
    socials: [
      { name: 'GitHub',   url: 'https://github.com/endrisusanto' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/endrisusanto/' },
      { name: 'Email',    url: 'mailto:gmail@endrisusanto.my.id' }
    ],
    experience: [
      {
        company: 'Samsung Electronics',
        role: 'Software Quality Engineer | Product Engineer',
        period: 'January 2016 – Present · 10 yrs 2 mos',
        description: 'SQA Engineer on the AOSP Compatibility Test Suite — designing and executing test cases, documenting defects, and collaborating with development teams to ensure Android platform quality and compatibility across various devices.'
      }
    ],
    education: [
      { school: 'Diponegoro University', degree: "Associate's Degree, Electrical & Electronics Engineering", period: '2012 – 2015' },
      { school: 'SMK Negeri 2 Pati',     degree: 'High School Diploma, Automation Engineering',            period: 'May 2009 – Jul 2012' }
    ],
    certifications: ['Leading with Vision', 'Talent Management', 'Developing Managers in Organizations']
  },
  projects: [
    { name: 'Gang Ambyar Super App',       description: 'Community platform: Ronda scheduling, Iuran management, real-time Flood Monitoring with interactive charts.',    tags: ['Full Stack','Community','Data Viz','Automation'], link: '#' },
    { name: 'YouTube Heatmap Clipper',     description: 'AI-powered tool to auto-clip high-engagement YouTube segments using heatmap data and scene detection.',           tags: ['AI','FFmpeg','Python','Automation'],             link: '#' },
    { name: 'QRIS Donation System',        description: 'Generates secure QRIS codes with auto-expiry blurring, session-based tracking, and real-time validation.',       tags: ['Fintech','Payment','Security','UX'],             link: '#' },
    { name: 'Companion Release Cheatsheet',description: 'Release management workflow for tracking QB CSC system builds and coordinating deployment checklists.',          tags: ['DevOps','Internal Tools','Productivity'],        link: '#' },
    { name: 'Personal Developer Portfolio',description: 'High-performance portfolio built with Vite + Vanilla JS. LinkedIn-style layout with smooth animations.',         tags: ['Vite','Modern CSS','Performance','Design'],      link: '#' }
  ]
};

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_'));
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Serve uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple password verification middleware
const verifyPassword = (req, res, next) => {
  const password = req.headers['authorization'];
  if (password === 'endri123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Profile Data Endpoints
app.get('/api/profile', (req, res) => {
  if (fs.existsSync(PROFILE_DATA_PATH)) {
    const data = fs.readFileSync(PROFILE_DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
  } else {
    res.json(initialProfileData);
  }
});

app.post('/api/profile', verifyPassword, (req, res) => {
  const data = req.body;
  fs.writeFileSync(PROFILE_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  res.json({ success: true });
});

// File upload endpoint
app.post('/api/upload', verifyPassword, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ success: true, filename: req.file.filename });
});

// Delete endpoint
app.delete('/api/files/:filename', verifyPassword, (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(UPLOADS_DIR, filename);
  
  if (filepath.indexOf(UPLOADS_DIR) !== 0) {
    return res.status(403).send("Forbidden");
  }

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// List files endpoint
app.get('/api/files', (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Could not list files' });
    }
    
    const sortedFiles = files
      .filter(f => f !== 'profile_data.json') // Exclude profile data file from public list
      .map(filename => {
        const stats = fs.statSync(path.join(UPLOADS_DIR, filename));
        const parts = filename.split('-');
        const timestamp = parseInt(parts[0]);
        const friendlyName = parts.slice(1).join('-');
        return {
          filename: filename,
          friendlyName: friendlyName || filename,
          url: `/uploads/${filename}`,
          mtime: stats.mtimeMs,
          size: stats.size
        };
      })
      .sort((a, b) => b.mtime - a.mtime);

    res.json(sortedFiles);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
