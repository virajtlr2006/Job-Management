const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobmanagement';

const jobsData = [
  {
    title: 'Frontend Developer',
    company: 'BrightWave Solutions',
    location: 'Remote',
    description: 'Build responsive React applications and collaborate with design teams to deliver engaging UI experiences.',
    requirements: ['2+ years React experience', 'HTML/CSS skills', 'REST API integration'],
    salary: '$60,000 - $80,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Backend Developer',
    company: 'DataForge Labs',
    location: 'Austin, TX',
    description: 'Design and implement backend services using Node.js and MongoDB.',
    requirements: ['Node.js experience', 'MongoDB knowledge', 'RESTful API development'],
    salary: '$75,000 - $95,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Full Stack Engineer',
    company: 'LaunchPad Camp',
    location: 'San Francisco, CA',
    description: 'Own the full software lifecycle from frontend to backend in a fast-paced startup.',
    requirements: ['React', 'Node.js', 'Cloud deployment experience'],
    salary: '$95,000 - $120,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'UI/UX Designer',
    company: 'PixelCraft Studio',
    location: 'New York, NY',
    description: 'Create intuitive product interfaces and help define the product visual system.',
    requirements: ['Figma', 'Design systems', 'User research'],
    salary: '$70,000 - $90,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Mobile App Developer',
    company: 'AppGenius',
    location: 'Remote',
    description: 'Develop mobile apps using React Native and collaborate closely with product owners.',
    requirements: ['React Native', 'API integration', 'App store deployment'],
    salary: '$80,000 - $100,000',
    type: 'contract',
    status: 'open',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudRise',
    location: 'Seattle, WA',
    description: 'Implement CI/CD pipelines and manage infrastructure automation.',
    requirements: ['AWS', 'Docker', 'Kubernetes'],
    salary: '$95,000 - $115,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'QA Automation Engineer',
    company: 'QualityNest',
    location: 'Boston, MA',
    description: 'Build automation frameworks and ensure product quality with end-to-end tests.',
    requirements: ['Test automation', 'Selenium or Cypress', 'Bug tracking'],
    salary: '$65,000 - $85,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Product Manager',
    company: 'MarketMuse',
    location: 'Chicago, IL',
    description: 'Define product strategy and work with engineering teams to ship customer-focused features.',
    requirements: ['Roadmap planning', 'Stakeholder communication', 'Agile experience'],
    salary: '$90,000 - $110,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Technical Writer',
    company: 'DocuStream',
    location: 'Remote',
    description: 'Create clear, concise documentation for software products and APIs.',
    requirements: ['Writing skills', 'Developer tools knowledge', 'Attention to detail'],
    salary: '$55,000 - $70,000',
    type: 'freelance',
    status: 'open',
  },
  {
    title: 'Data Analyst',
    company: 'InsightWorks',
    location: 'Denver, CO',
    description: 'Analyze business data and produce actionable reports to support decision-making.',
    requirements: ['SQL', 'Data visualization', 'Excel or Tableau'],
    salary: '$65,000 - $85,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Customer Success Manager',
    company: 'ClientBridge',
    location: 'Remote',
    description: 'Manage customer relationships and help clients get the most value from our software.',
    requirements: ['Customer support', 'SaaS experience', 'Strong communication'],
    salary: '$60,000 - $75,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Sales Engineer',
    company: 'GrowthSphere',
    location: 'Austin, TX',
    description: 'Support sales with technical expertise and help close strategic enterprise deals.',
    requirements: ['Technical demos', 'Sales support', 'Solution architecture'],
    salary: '$85,000 - $105,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'SEO Specialist',
    company: 'RankRocket',
    location: 'Los Angeles, CA',
    description: 'Optimize website content and campaigns to improve search engine rankings.',
    requirements: ['SEO tools', 'Content strategy', 'Analytics'],
    salary: '$60,000 - $80,000',
    type: 'part-time',
    status: 'open',
  },
  {
    title: 'HR Coordinator',
    company: 'TalentFirst',
    location: 'Houston, TX',
    description: 'Support HR operations and help coordinate recruiting and onboarding.',
    requirements: ['HR administration', 'Candidate coordination', 'Communication'],
    salary: '$50,000 - $65,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Business Analyst',
    company: 'StrategyGrid',
    location: 'Remote',
    description: 'Work with stakeholders to document requirements and identify process improvements.',
    requirements: ['Business analysis', 'Stakeholder interviews', 'Documentation'],
    salary: '$70,000 - $90,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Graphic Designer',
    company: 'BrandForge',
    location: 'Miami, FL',
    description: 'Design visual marketing materials for digital and print campaigns.',
    requirements: ['Adobe Creative Suite', 'Brand design', 'Visual storytelling'],
    salary: '$55,000 - $72,000',
    type: 'contract',
    status: 'open',
  },
  {
    title: 'IT Support Specialist',
    company: 'HelpDesk Pro',
    location: 'Phoenix, AZ',
    description: 'Troubleshoot user issues and maintain desktop and network support.',
    requirements: ['Technical support', 'Ticketing systems', 'Customer service'],
    salary: '$45,000 - $60,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Social Media Coordinator',
    company: 'SocialPulse',
    location: 'Remote',
    description: 'Manage social media campaigns and help grow our brand audience.',
    requirements: ['Social platforms', 'Content planning', 'Analytics knowledge'],
    salary: '$50,000 - $65,000',
    type: 'part-time',
    status: 'open',
  },
  {
    title: 'Cybersecurity Analyst',
    company: 'SecurePath',
    location: 'Washington, D.C.',
    description: 'Monitor security systems and help protect the organization from cyber threats.',
    requirements: ['Security monitoring', 'Incident response', 'Risk assessment'],
    salary: '$90,000 - $110,000',
    type: 'full-time',
    status: 'open',
  },
  {
    title: 'Content Strategist',
    company: 'NarrativeFlow',
    location: 'Remote',
    description: 'Plan and execute content strategies that align with brand messaging and growth goals.',
    requirements: ['Content planning', 'SEO', 'Editorial workflows'],
    salary: '$65,000 - $85,000',
    type: 'freelance',
    status: 'open',
  },
];

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const employerEmail = 'employer@jobhub.com';
    let employer = await User.findOne({ email: employerEmail });

    if (!employer) {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      employer = await User.create({
        name: 'JobHub Employer',
        email: employerEmail,
        password: hashedPassword,
        role: 'employer',
      });
      console.log('Created default employer user');
    }

    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    const jobsToInsert = jobsData.map((job) => ({
      ...job,
      postedBy: employer._id,
    }));

    await Job.insertMany(jobsToInsert);
    console.log(`Inserted ${jobsToInsert.length} jobs successfully`);
  } catch (error) {
    console.error('Seed script failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
