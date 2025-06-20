// 🚀 JOB AUTOFILL MAGIC SERVER
// Dockerized API for the ultimate job application speed hack

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const { SecureProfileManager } = require('./src/secure-profiles');
const { CostOptimizer } = require('./src/cost-optimizer');

const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 🔐 Initialize secure components
const profileManager = new SecureProfileManager(process.env.ENCRYPTION_KEY);
const costOptimizer = new CostOptimizer();

// 📊 Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// 🔥 Main autofill script endpoint
app.get('/autofill-script', async (req, res) => {
  try {
    const script = await fs.readFile('./autofill-magic.js', 'utf8');
    res.setHeader('Content-Type', 'application/javascript');
    res.send(script);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load autofill script' });
  }
});

// 👤 Profile management endpoints
app.get('/api/profiles', async (req, res) => {
  try {
    const profilesDir = './profiles';
    const files = await fs.readdir(profilesDir);
    const profiles = files
      .filter(f => f.endsWith('-encrypted.json'))
      .map(f => f.replace('-encrypted.json', ''));
    
    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list profiles' });
  }
});

app.get('/api/profiles/:name', async (req, res) => {
  try {
    const profile = await profileManager.loadProfile(req.params.name);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Remove sensitive data before sending
    const safeProfile = { ...profile };
    delete safeProfile.personal?.ssn;
    delete safeProfile.auth?.passwords;
    
    res.json(safeProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

app.post('/api/profiles/:name', async (req, res) => {
  try {
    await profileManager.saveProfile(req.params.name, req.body);
    res.json({ message: 'Profile saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// ⚡ Autofill generation endpoint
app.post('/api/generate-autofill', async (req, res) => {
  try {
    const { profileName, jobData } = req.body;
    
    // Load profile
    const baseProfile = await profileManager.loadProfile(profileName);
    if (!baseProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Create job-specific profile
    const jobProfile = await profileManager.createJobSpecificProfile(baseProfile, jobData);
    
    // Generate customized autofill script
    const autofillScript = generateCustomAutofillScript(jobProfile);
    
    res.json({
      script: autofillScript,
      profile: jobProfile.target_company,
      estimatedTime: '< 1 second'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate autofill script' });
  }
});

// 💰 Cost estimation endpoint
app.post('/api/estimate-costs', async (req, res) => {
  try {
    const { jobCount, strategy } = req.body;
    const estimates = costOptimizer.estimateCosts(jobCount);
    
    res.json({
      jobCount,
      strategy,
      estimates,
      savings: '$' + (29 - estimates.totalEstimate).toFixed(2) + ' vs manual'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to estimate costs' });
  }
});

// 🎯 Batch processing endpoint
app.post('/api/batch-apply', async (req, res) => {
  try {
    const { jobs, profileName, strategy } = req.body;
    
    // Load profile
    const profile = await profileManager.loadProfile(profileName);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Optimize job application strategy
    const optimizedJobs = await costOptimizer.optimizeApplications(jobs);
    
    // Process in batches for cost efficiency
    const results = await costOptimizer.batchProcess(optimizedJobs.tier3);
    
    res.json({
      processed: results.length,
      strategy: 'cost-optimized',
      estimatedCost: '$' + (results.length * 0.02).toFixed(2),
      timeToComplete: '< 5 minutes'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process batch applications' });
  }
});

// 🔧 Utility: Generate custom autofill script
function generateCustomAutofillScript(profile) {
  return `
// 🔥 CUSTOM AUTOFILL SCRIPT FOR ${profile.target_company}
(function() {
  console.log('🚀 Starting custom autofill for ${profile.target_company}...');
  
  const profile = ${JSON.stringify({
    name: profile.personal?.name,
    email: profile.personal?.email,
    phone: profile.personal?.phone,
    location: profile.personal?.location,
    linkedin: profile.professional?.linkedin,
    github: profile.professional?.github,
    portfolio: profile.professional?.portfolio
  }, null, 2)};
  
  // Smart autofill logic
  const inputs = document.querySelectorAll('input, textarea');
  let filled = 0;
  
  inputs.forEach(input => {
    const fieldName = (input.name + ' ' + input.placeholder + ' ' + input.id).toLowerCase();
    
    if (fieldName.includes('name') && !input.value) {
      input.value = profile.name;
      filled++;
    }
    else if (fieldName.includes('email') && !input.value) {
      input.value = profile.email;
      filled++;
    }
    else if (fieldName.includes('phone') && !input.value) {
      input.value = profile.phone;
      filled++;
    }
    else if (fieldName.includes('location') && !input.value) {
      input.value = profile.location;
      filled++;
    }
    else if (fieldName.includes('linkedin') && !input.value) {
      input.value = profile.linkedin;
      filled++;
    }
    else if (fieldName.includes('github') && !input.value) {
      input.value = profile.github;
      filled++;
    }
    else if (fieldName.includes('portfolio') && !input.value) {
      input.value = profile.portfolio;
      filled++;
    }
    
    // Trigger events
    input.dispatchEvent(new Event('input', {bubbles: true}));
    input.dispatchEvent(new Event('change', {bubbles: true}));
  });
  
  console.log(\`🎊 SUCCESS! Auto-filled \${filled} fields for ${profile.target_company}!\`);
  return \`Filled \${filled} fields\`;
})();
`;
}

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🔥 Job Autofill Magic Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Autofill script: http://localhost:${PORT}/autofill-script`);
});

module.exports = app;