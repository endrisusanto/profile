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
  "basics": {
    "name": "Endri Susanto",
    "label": "Senior Automation Engineer | Software Quality Assurance | Product Engineering",
    "email": "gmail@endrisusanto.my.id",
    "phone": "+62 851-7697-0180",
    "url": "https://github.com/endrisusanto",
    "summary": "Automation-focused Software Quality Assurance Engineer with 10+ years of experience at Samsung Electronics Indonesia specializing in Google Build Approval, Android software validation, process automation, engineering productivity solutions, and internal tool development. Experienced in automation platform development, browser extension development, API integration, application analysis, software modernization, self-hosted infrastructure, and cross-platform desktop application development using Rust/Tauri.",
    "location": {
      "city": "Karawang",
      "countryCode": "ID"
    },
    "relExp": "10+ Years",
    "totalExp": "10+ Years",
    "objective": "Seeking a challenging Automation Engineer role where I can apply my expertise in software quality assurance, process automation, application modernization, infrastructure management, and engineering tool development to build scalable solutions that improve productivity, reliability, and operational efficiency.",
    "profiles": [
      {
        "network": "LinkedIn",
        "username": "endrisusanto",
        "url": "https://www.linkedin.com/in/endrisusanto/"
      },
      {
        "network": "GitHub",
        "username": "endrisusanto",
        "url": "https://github.com/endrisusanto"
      }
    ]
  },
  "skills": {
    "programming": [
      { "name": "Python", "level": 5 },
      { "name": "PHP", "level": 5 },
      { "name": "JavaScript", "level": 4 },
      { "name": "TypeScript", "level": 4 },
      { "name": "Rust", "level": 3 },
      { "name": "SQL", "level": 5 }
    ],
    "automation": [
      { "name": "Power Automate", "level": 5 },
      { "name": "AutoHotkey", "level": 5 },
      { "name": "Python Automation", "level": 5 },
      { "name": "RPA", "level": 5 },
      { "name": "Browser Automation", "level": 4 },
      { "name": "Workflow Automation", "level": 5 }
    ],
    "qa": [
      { "name": "CTS", "level": 5 },
      { "name": "GTS", "level": 5 },
      { "name": "CTS Verifier", "level": 5 },
      { "name": "Google Build Approval", "level": 5 },
      { "name": "Android Validation", "level": 5 },
      { "name": "Software Validation", "level": 5 },
      { "name": "Root Cause Analysis", "level": 4 }
    ],
    "android_engineering": [
      { "name": "ADB", "level": 5 },
      { "name": "Tradefed", "level": 5 },
      { "name": "Firmware Flashing", "level": 5 },
      { "name": "Device Provisioning", "level": 4 },
      { "name": "ODIN Process", "level": 5 },
      { "name": "Android APK Analysis", "level": 4 }
    ],
    "application_analysis": [
      { "name": "Android APK Analysis", "level": 4 },
      { "name": "Windows Desktop Application Analysis", "level": 4 },
      { "name": "Linux Desktop Application Analysis", "level": 4 },
      { "name": "Legacy Application Modernization", "level": 4 },
      { "name": "Rust/Tauri Migration", "level": 3 },
      { "name": "Cross-Platform Desktop Application Development", "level": 3 }
    ],
    "browser_api_integration": [
      { "name": "Browser Extension Development", "level": 4 },
      { "name": "Chrome Extension Development", "level": 4 },
      { "name": "Fetch API", "level": 4 },
      { "name": "REST API Integration", "level": 4 },
      { "name": "WebSocket Integration", "level": 4 }
    ],
    "cybersecurity_testing": [
      { "name": "Application Security Assessment", "level": 3 },
      { "name": "OWASP Principles", "level": 3 },
      { "name": "API Security Testing", "level": 3 },
      { "name": "Apache JMeter", "level": 4 },
      { "name": "Performance Testing", "level": 4 },
      { "name": "Vulnerability Analysis", "level": 3 }
    ],
    "industrial_automation": [
      { "name": "PLC Programming", "level": 3 },
      { "name": "SCADA Systems", "level": 3 },
      { "name": "Industrial Control Systems", "level": 3 },
      { "name": "Electrical Control Panels", "level": 3 },
      { "name": "Commercial Wiring", "level": 4 },
      { "name": "Industrial Instrumentation", "level": 3 }
    ],
    "embedded_iot": [
      { "name": "Microcontroller Programming", "level": 4 },
      { "name": "ESP32", "level": 4 },
      { "name": "Arduino", "level": 4 },
      { "name": "MQTT", "level": 3 },
      { "name": "Sensor Integration", "level": 4 },
      { "name": "IoT Systems", "level": 4 }
    ],
    "infrastructure": [
      { "name": "Linux", "level": 5 },
      { "name": "Ubuntu", "level": 5 },
      { "name": "Fedora", "level": 5 },
      { "name": "Docker", "level": 4 },
      { "name": "Cloudflare Tunnel", "level": 4 },
      { "name": "KVM Virtualization", "level": 4 },
      { "name": "Self Hosted Services", "level": 4 },
      { "name": "Git", "level": 5 },
      { "name": "GitHub", "level": 5 }
    ],
    "smart_systems": [
      { "name": "Home Assistant", "level": 4 },
      { "name": "Frigate NVR", "level": 4 },
      { "name": "Smart Home Automation", "level": 4 },
      { "name": "Edge Computing", "level": 3 }
    ]
  },
  "work": [
    {
      "id": "1",
      "name": "Samsung Electronics Indonesia",
      "position": "Software Quality Assurance Engineer",
      "department": "Product Engineering",
      "startDate": "Jan 2016",
      "endDate": null,
      "isWorkingHere": true,
      "location": "Cikarang, Indonesia",
      "years": "10+ Years",
      "summary": "Software QA Engineer under Product Engineering Department focusing on Android software validation, Google Build Approval processes, automation development, productivity improvement, and engineering workflow optimization.",
      "highlights": [
        "Performed Google Build Approval testing including CTS, GTS, CTS Verifier, and Android software validation.",
        "Developed automation tools and internal web applications that reduced manual effort and improved engineering productivity.",
        "Managed multi-device Android validation environments using ADB, Tradefed, Linux, and automation frameworks.",
        "Designed workflow automation solutions using Power Automate, AutoHotkey, Python, PHP, JavaScript, and SQL.",
        "Built browser extensions and API integration tools to automate repetitive engineering workflows.",
        "Performed application analysis for Android APK, Windows desktop applications, and Linux desktop applications to support automation and modernization initiatives.",
        "Rebuilt and modernized desktop tools using Rust/Tauri for cross-platform automation workflows.",
        "Implemented self-hosted engineering solutions using Linux, Docker, Cloudflare Tunnel, and internal web services.",
        "Used Apache JMeter and API testing approaches for performance testing and system validation.",
        "Collaborated with Product Engineering teams to improve software quality, release readiness, and process efficiency."
      ]
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "Universitas Diponegoro",
      "studyType": "Diploma 3 (D3)",
      "area": "Electrical Engineering",
      "startDate": "2012",
      "endDate": "2015",
      "location": "Semarang, Indonesia",
      "highlights": [
        "Electrical and Electronics Engineering",
        "Industrial Automation Fundamentals",
        "PLC and SCADA Systems",
        "Industrial Control Systems",
        "Instrumentation and Electrical Systems"
      ]
    }
  ],
  "certifications": [
    {
      "name": "Google Build Approval AOSP",
      "issuer": "Samsung Electronics Vietnam"
    },
    {
      "name": "Commercial Wiring",
      "issuer": "BLKI Semarang"
    },
    {
      "name": "QEHS and ISO Training",
      "issuer": "Bina Profesi Institute - Konstan Group"
    },
    {
      "name": "Rust Programming From Beginner to Advanced",
      "issuer": "Udemy"
    }
  ],
  "projects": [
    {
      "name": "FlashKit",
      "url": "https://github.com/endrisusanto/FlashKit",
      "description": "Fully automated firmware flashing and Android device provisioning platform.",
      "technologies": ["TypeScript", "ADB", "Android", "Automation"]
    },
    {
      "name": "ATM Launcher",
      "url": "https://github.com/endrisusanto/ATM-Launcher",
      "description": "Rust-based desktop automation dashboard for workflow execution and monitoring.",
      "technologies": ["Rust", "Tauri", "Desktop App", "Automation"]
    },
    {
      "name": "Auto Fill Extension",
      "url": "https://github.com/endrisusanto/auto-fill-extension",
      "description": "Browser extension for automating Samsung Build Approval Server form submission.",
      "technologies": ["JavaScript", "Chrome Extension", "Fetch API", "Browser Automation"]
    },
    {
      "name": "Companion Release Cheatsheet",
      "url": "https://github.com/endrisusanto/companion-release-cheatsheet",
      "description": "PHP-based release management and reference tracking web application.",
      "technologies": ["PHP", "MySQL", "Web Application"]
    },
    {
      "name": "GBA Task Manager",
      "url": "https://github.com/endrisusanto/project_manager",
      "description": "Web-based project and task management system for Google Build Approval workflows.",
      "technologies": ["PHP", "MySQL", "Bootstrap", "Workflow Management"]
    },
    {
      "name": "Warga Ambyar",
      "url": "https://github.com/endrisusanto/warga_ambyar",
      "description": "Full-stack Node.js application for community resident and contribution management.",
      "technologies": ["Node.js", "EJS", "JavaScript"]
    }
  ],
  "awards": [
    {
      "title": "Best Employee 2025",
      "awarder": "Samsung Electronics Indonesia",
      "date": "2025"
    },
    {
      "title": "10 Years Long Service Recognition",
      "awarder": "Samsung Electronics Indonesia",
      "date": "2026"
    },
    {
      "title": "Best Improvement - Air Quality Monitoring Network Implementation",
      "awarder": "Samsung Electronics Indonesia / EHS Department",
      "date": ""
    }
  ],
  "innovations": [
    {
      "title": "Automated Rebuild and Retrieval System for Binary in Quickbuild",
      "classification": "Class 5",
      "status": "Adopt",
      "impact": "49,896 Hours Saved"
    },
    {
      "title": "Streamlining File Organization with Automated Sorting Solutions",
      "classification": "Class 5",
      "status": "Adopt",
      "impact": "17,846 Hours Saved"
    },
    {
      "title": "Implementing Ethernet Standardization for Optimizing Network Performance",
      "classification": "Class 4",
      "status": "Adopt",
      "impact": "14,932 USD"
    },
    {
      "title": "Web-Based Companion Release Reference Sheet",
      "classification": "Class 5",
      "status": "Adopt",
      "impact": "1,393 USD"
    },
    {
      "title": "Standardization USB 3.0 on Flashing ODIN Process",
      "classification": "Class 5",
      "status": "Adopt",
      "impact": "696 USD"
    },
    {
      "title": "Standardization SSD/NVMe M.2 for ODIN Binary Flashing Efficiency",
      "classification": "Class 5",
      "status": "Adopt",
      "impact": "410 USD"
    },
    {
      "title": "Productivity Improvement through Web-Based Boot Images Companion",
      "classification": "Non Adopt",
      "status": "Non Adopt",
      "impact": "720 USD"
    },
    {
      "title": "U2Net AI Model for Background Removal in Image Processing",
      "classification": "Non Adopt",
      "status": "Non Adopt",
      "impact": "275 USD"
    },
    {
      "title": "Web Application for Image Cropping and Compression",
      "classification": "Non Adopt",
      "status": "Non Adopt",
      "impact": "275 USD"
    }
  ],
  "languages": [
    {
      "language": "Indonesian",
      "fluency": "Native"
    },
    {
      "language": "English",
      "fluency": "Full Professional Proficiency"
    }
  ],
  "technicalInterests": [
    "AI Agents",
    "Local LLM Deployment",
    "Application Modernization",
    "Android APK Analysis",
    "Windows Desktop Application Analysis",
    "Rust/Tauri Desktop Applications",
    "Browser Extension Development",
    "Cybersecurity",
    "API Security Testing",
    "JMeter Performance Testing",
    "Home Assistant",
    "Frigate NVR",
    "Self Hosted Infrastructure",
    "Cloudflare Tunnel",
    "Docker",
    "KVM Virtualization",
    "IoT Automation",
    "Industrial Automation",
    "Smart Manufacturing"
  ]
}

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
