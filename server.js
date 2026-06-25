import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config(); // ponytail: load .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 80;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROFILE_DATA_PATH = path.join(UPLOADS_DIR, 'profile_data.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial data: single source for Docker and local dev
const defaultProfilePath = fs.existsSync(path.join(__dirname, 'public', 'profile.json'))
  ? path.join(__dirname, 'public', 'profile.json')
  : path.join(__dirname, 'dist', 'profile.json');
const initialProfileData = JSON.parse(fs.readFileSync(defaultProfilePath, 'utf8'));

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
  if (password === process.env.ADMIN_PASSWORD) {
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
