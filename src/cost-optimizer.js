// 💰 COST OPTIMIZATION ENGINE
// Smart token management & API cost control

class CostOptimizer {
  constructor() {
    this.skyvern = {
      // Skyvern pricing: ~$0.10 per navigation step
      costPerStep: 0.10,
      maxDailyCost: 50.00,
      dailyUsage: 0,
      
      // Rate limiting
      maxCallsPerHour: 20,
      callsThisHour: 0,
      hourlyReset: new Date()
    };
    
    this.claude = {
      // Claude Sonnet 4 pricing
      inputTokenCost: 0.000003,   // $3 per 1M tokens
      outputTokenCost: 0.000015,  // $15 per 1M tokens
      maxDailyTokens: 100000,
      tokensUsedToday: 0,
      
      // Smart caching
      coverLetterCache: new Map(),
      templateCache: new Map()
    };
  }
  
  // 🎯 Smart Application Strategy
  async optimizeApplications(jobList) {
    console.log('🧠 Optimizing application strategy...');
    
    // Tier jobs by priority
    const tiers = this.tierJobs(jobList);
    
    // Tier 1: High priority (use Skyvern + custom cover letters)
    const tier1 = tiers.high.slice(0, 20);
    
    // Tier 2: Medium priority (use autofill + templated letters)  
    const tier2 = tiers.medium.slice(0, 50);
    
    // Tier 3: Bulk applications (autofill only)
    const tier3 = tiers.low.slice(0, 100);
    
    return { tier1, tier2, tier3 };
  }
  
  // 💡 Smart Cover Letter Generation
  async generateCoverLetter(jobData, useCache = true) {
    const cacheKey = this.getCoverLetterCacheKey(jobData);
    
    // Check cache first (saves ~90% on costs!)
    if (useCache && this.claude.coverLetterCache.has(cacheKey)) {
      console.log('📋 Using cached cover letter template');
      return this.claude.coverLetterCache.get(cacheKey);
    }
    
    // Smart token budgeting
    if (this.claude.tokensUsedToday > this.claude.maxDailyTokens) {
      console.log('⚠️ Daily token limit reached, using template');
      return this.getGenericCoverLetter(jobData);
    }
    
    // Generate new cover letter
    const prompt = this.buildCoverLetterPrompt(jobData);
    const result = await this.callClaude(prompt, 500); // Limit tokens
    
    // Cache for similar jobs
    this.claude.coverLetterCache.set(cacheKey, result);
    
    return result;
  }
  
  // 🔄 Batch Processing for Cost Efficiency
  async batchProcess(jobs, batchSize = 10) {
    const batches = [];
    
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    // Process batches with delays to respect rate limits
    const results = [];
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(job => this.processJob(job))
      );
      results.push(...batchResults);
      
      // Rate limiting delay
      await this.sleep(2000);
    }
    
    return results;
  }
  
  // 📊 Cost Tracking & Alerts
  trackCosts(service, amount) {
    if (service === 'skyvern') {
      this.skyvern.dailyUsage += amount;
      
      if (this.skyvern.dailyUsage > this.skyvern.maxDailyCost) {
        this.sendCostAlert('Skyvern daily budget exceeded!');
        return false; // Stop processing
      }
    }
    
    if (service === 'claude') {
      this.claude.tokensUsedToday += amount;
      
      if (this.claude.tokensUsedToday > this.claude.maxDailyTokens) {
        this.sendCostAlert('Claude token limit reached!');
        return false;
      }
    }
    
    return true;
  }
  
  // 🎯 Job Prioritization Algorithm
  tierJobs(jobs) {
    return {
      high: jobs.filter(job => 
        job.priority === 'high' || 
        job.matchScore > 0.8 ||
        job.company === 'dream_company'
      ),
      medium: jobs.filter(job => 
        job.matchScore > 0.6 && job.matchScore <= 0.8
      ),
      low: jobs.filter(job => 
        job.matchScore <= 0.6
      )
    };
  }
  
  // 🔑 Smart Cache Key Generation  
  getCoverLetterCacheKey(jobData) {
    const key = [
      jobData.company?.toLowerCase(),
      jobData.role?.toLowerCase().replace(/[^a-z0-9]/g, ''),
      jobData.tech_stack?.sort().join('') || '',
      jobData.seniority || 'mid'
    ].join('-');
    
    return key;
  }
  
  // 💸 Cost Estimation
  estimateCosts(jobCount) {
    const estimates = {
      // Tier 1: Full Skyvern + Custom Cover Letters
      tier1Cost: (jobCount * 0.10) + (jobCount * 0.05), // $0.15 per job
      
      // Tier 2: Autofill + Template Letters  
      tier2Cost: jobCount * 0.02, // $0.02 per job
      
      // Tier 3: Autofill Only
      tier3Cost: jobCount * 0.00, // Free!
      
      // Total for 100 mixed applications
      totalEstimate: (20 * 0.15) + (50 * 0.02) + (30 * 0.00) // ~$4.00
    };
    
    return estimates;
  }
  
  // ⚡ Quick Deploy Commands
  getDeployCommands() {
    return `
# 🚀 One-Command Deploy
git clone https://github.com/anix-lynch/job-application-autofill-magic.git
cd job-application-autofill-magic
cp .env.example .env
# Edit .env with your API keys
docker-compose up -d

# 🔐 Secure Setup
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)" >> .env
echo "JWT_SECRET=$(openssl rand -hex 64)" >> .env

# 💰 Cost Monitoring
docker-compose logs -f job-autofill | grep "COST"
`;
  }
}

module.exports = { CostOptimizer };