// 🔐 ENCRYPTED PROFILE MANAGER
// Secure storage for sensitive job application data

const crypto = require('crypto');
const fs = require('fs').promises;

class SecureProfileManager {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto.scryptSync(encryptionKey, 'salt', 32);
    this.profilesPath = '/app/profiles';
  }
  
  // 🔒 Encrypt Profile Data
  encrypt(profileData) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('job-profile', 'utf8'));
    
    let encrypted = cipher.update(JSON.stringify(profileData), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  // 🔓 Decrypt Profile Data  
  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('job-profile', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
  
  // 💾 Save Encrypted Profile
  async saveProfile(profileName, profileData) {
    const encrypted = this.encrypt(profileData);
    const filePath = `${this.profilesPath}/${profileName}-encrypted.json`;
    
    await fs.writeFile(filePath, JSON.stringify(encrypted, null, 2));
    console.log(`🔐 Profile '${profileName}' saved securely`);
  }
  
  // 📂 Load Encrypted Profile
  async loadProfile(profileName) {
    const filePath = `${this.profilesPath}/${profileName}-encrypted.json`;
    
    try {
      const encryptedData = JSON.parse(await fs.readFile(filePath, 'utf8'));
      const profileData = this.decrypt(encryptedData);
      console.log(`🔓 Profile '${profileName}' loaded successfully`);
      return profileData;
    } catch (error) {
      console.error(`❌ Failed to load profile '${profileName}':`, error.message);
      return null;
    }
  }
  
  // 🎭 Multiple Profile Support
  async createJobSpecificProfile(baseProfile, jobData) {
    const jobProfile = {
      ...baseProfile,
      
      // Job-specific customizations
      cover_letter: await this.generateJobSpecificCoverLetter(baseProfile, jobData),
      target_company: jobData.company,
      target_role: jobData.title,
      
      // Tailored skills emphasis
      emphasized_skills: this.matchSkillsToJob(baseProfile.skills, jobData.requirements),
      
      // Custom messaging
      why_this_company: await this.generateWhyThisCompany(jobData),
      
      // Application metadata
      application_date: new Date().toISOString(),
      job_url: jobData.url,
      match_score: jobData.matchScore || 0
    };
    
    return jobProfile;
  }
  
  // 🎯 Smart Skill Matching
  matchSkillsToJob(candidateSkills, jobRequirements) {
    if (!jobRequirements) return candidateSkills;
    
    const requirements = jobRequirements.toLowerCase();
    const emphasized = candidateSkills.filter(skill => 
      requirements.includes(skill.toLowerCase())
    );
    
    // Reorder to put matching skills first
    const nonMatching = candidateSkills.filter(skill => 
      !requirements.includes(skill.toLowerCase())
    );
    
    return [...emphasized, ...nonMatching];
  }
  
  // 📝 Template System for Cover Letters
  async generateJobSpecificCoverLetter(profile, jobData) {
    const templates = {
      startup: this.getStartupTemplate(),
      enterprise: this.getEnterpriseTemplate(), 
      ai_company: this.getAICompanyTemplate(),
      generic: this.getGenericTemplate()
    };
    
    // Smart template selection
    const companyType = this.detectCompanyType(jobData);
    const template = templates[companyType] || templates.generic;
    
    // Fill template with profile data
    return this.fillTemplate(template, profile, jobData);
  }
  
  // 🏢 Company Type Detection
  detectCompanyType(jobData) {
    const company = jobData.company?.toLowerCase() || '';
    const description = jobData.description?.toLowerCase() || '';
    
    if (description.includes('startup') || description.includes('series a')) {
      return 'startup';
    }
    
    if (description.includes('ai') || description.includes('machine learning')) {
      return 'ai_company';
    }
    
    if (company.includes('microsoft') || company.includes('google') || 
        company.includes('amazon') || company.includes('apple')) {
      return 'enterprise';
    }
    
    return 'generic';
  }
  
  // 📄 Quick Deploy Script
  getDeployScript() {
    return `#!/bin/bash
# 🚀 Quick Deploy Script

echo "🔐 Setting up secure job application automation..."

# Generate encryption key
ENCRYPTION_KEY=$(openssl rand -hex 32)
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env

# Create secure directories
mkdir -p profiles logs cache
chmod 700 profiles

# Start services
docker-compose up -d

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Copy your profile data to profiles/"
echo "2. Test with: curl http://localhost:3000/health"
echo "3. Start applying: curl -X POST http://localhost:3000/apply"
`;
  }
}

// 🎯 Profile Templates
const profileTemplates = {
  ai_engineer: {
    name: "AI Engineer Profile",
    template: {
      personal: {
        name: "{{name}}",
        email: "{{email}}",
        phone: "{{phone}}",
        location: "{{location}}"
      },
      professional: {
        current_title: "AI Engineer",
        current_company: "{{current_company}}",
        experience_years: "{{experience}}",
        specializations: ["Machine Learning", "Deep Learning", "MLOps"]
      },
      cover_letter_template: `
Dear {{hiring_manager}},

I'm excited to apply for the {{job_title}} position at {{company}}. 
With {{experience}} years of experience in AI/ML, I've {{achievement}}.

My expertise in {{top_skills}} aligns perfectly with your needs for {{job_requirements}}.

Best regards,
{{name}}
      `
    }
  }
};

module.exports = { SecureProfileManager, profileTemplates };