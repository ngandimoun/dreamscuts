/**
 * GPT Image 1 UI Design Examples
 * 
 * Comprehensive examples demonstrating the use of GPT Image 1 for generating
 * UI/UX designs including web apps, mobile apps, dashboards, and other
 * interface designs with extremely detailed prompts.
 */

import { generateUIDesign } from '../executors/gpt-image-1-ui-designer';

/**
 * Web Application Example
 * Modern task management web application
 */
export async function webAppExample() {
  console.log('💻 Generating web application UI...');
  
  const result = await generateUIDesign({
    designType: 'web-app',
    appName: 'TaskManager Pro',
    description: 'A comprehensive task management platform for teams and individuals',
    features: [
      'Task creation and management with drag-and-drop interface',
      'Team collaboration with real-time updates',
      'Progress tracking with visual analytics',
      'Deadline reminders and notifications',
      'File sharing and document collaboration',
      'Time tracking and productivity metrics'
    ],
    targetUsers: 'Business professionals, project managers, and development teams',
    style: 'modern',
    colorScheme: 'professional',
    layout: 'single-page',
    orientation: 'landscape',
    size: '1536x1024',
    quality: 'high',
    context: 'Business productivity application for team collaboration',
    branding: {
      logo: 'Modern, minimalist logo with clean lines and professional typography',
      tagline: 'Streamline Your Workflow',
      companyName: 'Productivity Solutions Inc.'
    },
    navigation: {
      type: 'header',
      items: ['Dashboard', 'Tasks', 'Team', 'Reports', 'Settings', 'Profile']
    },
    content: {
      hero: 'Welcome to TaskManager Pro - The ultimate productivity solution for modern teams',
      sections: [
        'Dashboard Overview with key metrics and recent activity',
        'Task Management with kanban boards and list views',
        'Team Collaboration with real-time chat and file sharing',
        'Analytics and Reporting with visual data representation'
      ],
      callToAction: 'Get Started Today - Free 30-day trial'
    },
    typography: {
      primaryFont: 'Inter',
      secondaryFont: 'Roboto',
      headingSize: 'large',
      bodySize: 'medium'
    },
    components: {
      buttons: ['Primary CTA Button', 'Secondary Action Button', 'Icon Button', 'Floating Action Button'],
      forms: ['Task Creation Form', 'User Registration Form', 'Settings Form', 'Search Form'],
      cards: ['Task Card', 'User Profile Card', 'Statistics Card', 'Notification Card'],
      modals: ['Task Details Modal', 'User Settings Modal', 'Confirmation Modal', 'Help Modal']
    }
  });

  if (result.success) {
    console.log('✅ Web application UI generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Web application UI generation failed:', result.error);
  }

  return result;
}

/**
 * Mobile Application Example
 * Fitness tracking mobile app
 */
export async function mobileAppExample() {
  console.log('📱 Generating mobile application UI...');
  
  const result = await generateUIDesign({
    designType: 'mobile-app',
    appName: 'FitTracker',
    description: 'A comprehensive fitness tracking application for health-conscious individuals',
    features: [
      'Workout tracking with exercise library',
      'Progress monitoring with charts and graphs',
      'Social features with friend connections',
      'Goal setting and achievement tracking',
      'Nutrition logging and meal planning',
      'Wearable device integration'
    ],
    targetUsers: 'Fitness enthusiasts, health-conscious individuals, and athletes',
    style: 'material',
    colorScheme: 'vibrant',
    layout: 'tabs',
    orientation: 'portrait',
    size: '1024x1536',
    quality: 'high',
    context: 'Mobile fitness and health tracking application',
    branding: {
      logo: 'Dynamic, energetic logo with fitness-related icons',
      tagline: 'Your Fitness Journey Starts Here',
      companyName: 'HealthTech Solutions'
    },
    navigation: {
      type: 'bottom',
      items: ['Home', 'Workouts', 'Progress', 'Social', 'Profile']
    },
    content: {
      hero: 'Transform Your Health with FitTracker - Track, Connect, Achieve',
      sections: [
        'Home Dashboard with daily stats and quick actions',
        'Workout Library with exercise categories and routines',
        'Progress Tracking with visual charts and milestones',
        'Social Feed with friends\' activities and achievements'
      ],
      callToAction: 'Start Your Fitness Journey Today'
    },
    typography: {
      primaryFont: 'Roboto',
      secondaryFont: 'Open Sans',
      headingSize: 'large',
      bodySize: 'medium'
    },
    components: {
      buttons: ['Primary Action Button', 'Secondary Button', 'Floating Action Button', 'Icon Button'],
      forms: ['Workout Log Form', 'Goal Setting Form', 'Profile Form', 'Search Form'],
      cards: ['Workout Card', 'Progress Card', 'Achievement Card', 'Friend Activity Card'],
      modals: ['Workout Details Modal', 'Goal Setting Modal', 'Share Modal', 'Settings Modal']
    }
  });

  if (result.success) {
    console.log('✅ Mobile application UI generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Mobile application UI generation failed:', result.error);
  }

  return result;
}

/**
 * Dashboard Example
 * Business analytics dashboard
 */
export async function dashboardExample() {
  console.log('📊 Generating dashboard UI...');
  
  const result = await generateUIDesign({
    designType: 'dashboard',
    appName: 'Analytics Pro',
    description: 'A comprehensive business intelligence dashboard for data-driven decision making',
    features: [
      'Real-time data visualization with interactive charts',
      'Custom report generation with drag-and-drop builder',
      'Performance metrics with KPI tracking',
      'Trend analysis with predictive insights',
      'Data export and sharing capabilities',
      'Multi-user collaboration with role-based access'
    ],
    targetUsers: 'Business analysts, executives, and data scientists',
    style: 'corporate',
    colorScheme: 'dark',
    layout: 'dashboard',
    orientation: 'landscape',
    size: '1536x1024',
    quality: 'high',
    context: 'Business intelligence and analytics platform',
    branding: {
      logo: 'Professional, data-focused logo with analytical elements',
      tagline: 'Data-Driven Decisions Made Simple',
      companyName: 'DataVision Analytics'
    },
    navigation: {
      type: 'sidebar',
      items: ['Overview', 'Reports', 'Analytics', 'Data Sources', 'Users', 'Settings']
    },
    content: {
      hero: 'Welcome to Analytics Pro - Transform your data into actionable insights',
      sections: [
        'Executive Dashboard with key performance indicators',
        'Interactive Reports with customizable visualizations',
        'Advanced Analytics with machine learning insights',
        'Data Management with source integration and validation'
      ],
      callToAction: 'Explore Your Data Today'
    },
    typography: {
      primaryFont: 'Arial',
      secondaryFont: 'Helvetica',
      headingSize: 'large',
      bodySize: 'medium'
    },
    components: {
      buttons: ['Primary Action Button', 'Secondary Button', 'Icon Button', 'Toggle Button'],
      forms: ['Report Builder Form', 'Filter Form', 'User Management Form', 'Settings Form'],
      cards: ['KPI Card', 'Chart Card', 'Data Table Card', 'Alert Card'],
      modals: ['Report Details Modal', 'Data Source Modal', 'User Permissions Modal', 'Export Modal']
    }
  });

  if (result.success) {
    console.log('✅ Dashboard UI generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Dashboard UI generation failed:', result.error);
  }

  return result;
}

/**
 * Landing Page Example
 * SaaS product landing page
 */
export async function landingPageExample() {
  console.log('🌐 Generating landing page UI...');
  
  const result = await generateUIDesign({
    designType: 'landing-page',
    appName: 'CloudSync Pro',
    description: 'The ultimate cloud storage solution for businesses and individuals',
    features: [
      'Unlimited cloud storage with enterprise-grade security',
      'Real-time collaboration with team workspaces',
      'Advanced file sharing with permission controls',
      'Automatic backup and version history',
      'Mobile apps for all major platforms',
      '24/7 customer support and SLA guarantee'
    ],
    targetUsers: 'Businesses, teams, and individuals needing reliable cloud storage',
    style: 'modern',
    colorScheme: 'professional',
    layout: 'single-page',
    orientation: 'landscape',
    size: '1536x1024',
    quality: 'high',
    context: 'SaaS product landing page for cloud storage service',
    branding: {
      logo: 'Modern, cloud-themed logo with clean typography',
      tagline: 'Your Files, Everywhere, Always',
      companyName: 'CloudSync Technologies'
    },
    navigation: {
      type: 'header',
      items: ['Features', 'Pricing', 'About', 'Contact', 'Login', 'Sign Up']
    },
    content: {
      hero: 'Store, Share, and Collaborate with CloudSync Pro - The Future of Cloud Storage',
      sections: [
        'Hero Section with compelling value proposition',
        'Features Showcase with detailed benefits',
        'Pricing Plans with clear comparison',
        'Customer Testimonials and social proof',
        'FAQ Section with common questions',
        'Contact Form and call-to-action'
      ],
      callToAction: 'Start Your Free Trial Today - No Credit Card Required'
    },
    typography: {
      primaryFont: 'Inter',
      secondaryFont: 'Source Sans Pro',
      headingSize: 'extra-large',
      bodySize: 'large'
    },
    components: {
      buttons: ['Primary CTA Button', 'Secondary Button', 'Outline Button', 'Text Button'],
      forms: ['Sign Up Form', 'Contact Form', 'Newsletter Form', 'Demo Request Form'],
      cards: ['Feature Card', 'Pricing Card', 'Testimonial Card', 'FAQ Card'],
      modals: ['Sign Up Modal', 'Demo Request Modal', 'Contact Modal', 'Pricing Modal']
    }
  });

  if (result.success) {
    console.log('✅ Landing page UI generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Landing page UI generation failed:', result.error);
  }

  return result;
}

/**
 * E-commerce Example
 * Online shopping platform
 */
export async function ecommerceExample() {
  console.log('🛒 Generating e-commerce UI...');
  
  const result = await generateUIDesign({
    designType: 'ecommerce',
    appName: 'StyleHub',
    description: 'A modern e-commerce platform for fashion and lifestyle products',
    features: [
      'Product catalog with advanced filtering and search',
      'Shopping cart with secure checkout process',
      'User accounts with order history and wishlist',
      'Product reviews and ratings system',
      'Mobile-responsive design for all devices',
      'Payment integration with multiple options'
    ],
    targetUsers: 'Fashion-conscious consumers and online shoppers',
    style: 'modern',
    colorScheme: 'vibrant',
    layout: 'grid',
    orientation: 'landscape',
    size: '1536x1024',
    quality: 'high',
    context: 'E-commerce platform for fashion and lifestyle products',
    branding: {
      logo: 'Stylish, fashion-forward logo with modern typography',
      tagline: 'Discover Your Style',
      companyName: 'StyleHub Fashion'
    },
    navigation: {
      type: 'header',
      items: ['Women', 'Men', 'Kids', 'Accessories', 'Sale', 'Account', 'Cart']
    },
    content: {
      hero: 'Discover the Latest Trends at StyleHub - Fashion for Every Occasion',
      sections: [
        'Product Grid with featured items and categories',
        'Shopping Cart with item management and checkout',
        'Product Details with images, reviews, and specifications',
        'User Account with order history and preferences'
      ],
      callToAction: 'Shop Now and Get 20% Off Your First Order'
    },
    typography: {
      primaryFont: 'Montserrat',
      secondaryFont: 'Open Sans',
      headingSize: 'large',
      bodySize: 'medium'
    },
    components: {
      buttons: ['Add to Cart Button', 'Buy Now Button', 'Wishlist Button', 'Filter Button'],
      forms: ['Search Form', 'Checkout Form', 'Account Form', 'Review Form'],
      cards: ['Product Card', 'Category Card', 'Review Card', 'Promotion Card'],
      modals: ['Product Quick View Modal', 'Cart Modal', 'Login Modal', 'Size Guide Modal']
    }
  });

  if (result.success) {
    console.log('✅ E-commerce UI generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ E-commerce UI generation failed:', result.error);
  }

  return result;
}

/**
 * Portfolio Example
 * Creative portfolio website
 */
export async function portfolioExample() {
  console.log('🎨 Generating portfolio UI...');
  
  const result = await generateUIDesign({
    designType: 'portfolio',
    appName: 'Creative Studio',
    description: 'A stunning portfolio website showcasing creative work and services',
    features: [
      'Portfolio gallery with project showcases',
      'About section with professional background',
      'Services overview with detailed descriptions',
      'Contact form with project inquiry options',
      'Blog section with latest updates',
      'Responsive design for all devices'
    ],
    targetUsers: 'Creative professionals, designers, and potential clients',
    style: 'creative',
    colorScheme: 'vibrant',
    layout: 'single-page',
    orientation: 'landscape',
    size: '1536x1024',
    quality: 'high',
    context: 'Creative portfolio website for design professionals',
    branding: {
      logo: 'Creative, artistic logo with unique typography',
      tagline: 'Where Creativity Meets Innovation',
      companyName: 'Creative Studio Design'
    },
    navigation: {
      type: 'header',
      items: ['Home', 'Portfolio', 'About', 'Services', 'Blog', 'Contact']
    },
    content: {
      hero: 'Welcome to Creative Studio - Bringing Your Vision to Life',
      sections: [
        'Hero Section with compelling visual and call-to-action',
        'Portfolio Gallery with project showcases and case studies',
        'About Section with professional background and expertise',
        'Services Overview with detailed descriptions and pricing',
        'Client Testimonials with social proof and reviews',
        'Contact Section with inquiry form and contact information'
      ],
      callToAction: 'Let\'s Create Something Amazing Together'
    },
    typography: {
      primaryFont: 'Playfair Display',
      secondaryFont: 'Source Sans Pro',
      headingSize: 'extra-large',
      bodySize: 'large'
    },
    components: {
      buttons: ['Primary CTA Button', 'Secondary Button', 'Portfolio Button', 'Contact Button'],
      forms: ['Contact Form', 'Project Inquiry Form', 'Newsletter Form', 'Quote Request Form'],
      cards: ['Portfolio Card', 'Service Card', 'Testimonial Card', 'Blog Card'],
      modals: ['Portfolio Modal', 'Contact Modal', 'Service Modal', 'Quote Modal']
    }
  });

  if (result.success) {
    console.log('✅ Portfolio UI generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Portfolio UI generation failed:', result.error);
  }

  return result;
}

/**
 * Admin Panel Example
 * Content management system
 */
export async function adminPanelExample() {
  console.log('⚙️ Generating admin panel UI...');
  
  const result = await generateUIDesign({
    designType: 'admin-panel',
    appName: 'ContentManager Pro',
    description: 'A comprehensive content management system for websites and applications',
    features: [
      'Content creation and editing with rich text editor',
      'User management with role-based permissions',
      'Media library with file organization',
      'Analytics dashboard with performance metrics',
      'SEO tools with optimization recommendations',
      'Backup and restore functionality'
    ],
    targetUsers: 'Content managers, website administrators, and developers',
    style: 'corporate',
    colorScheme: 'professional',
    layout: 'sidebar',
    orientation: 'landscape',
    size: '1536x1024',
    quality: 'high',
    context: 'Content management system for website administration',
    branding: {
      logo: 'Professional, technical logo with clean design',
      tagline: 'Manage Your Content with Confidence',
      companyName: 'ContentTech Solutions'
    },
    navigation: {
      type: 'sidebar',
      items: ['Dashboard', 'Content', 'Media', 'Users', 'Analytics', 'Settings', 'Tools']
    },
    content: {
      hero: 'Welcome to ContentManager Pro - Your Content Management Solution',
      sections: [
        'Dashboard Overview with system status and recent activity',
        'Content Management with editor and publishing tools',
        'User Management with permissions and role assignments',
        'Analytics with performance metrics and user insights'
      ],
      callToAction: 'Start Managing Your Content Today'
    },
    typography: {
      primaryFont: 'Arial',
      secondaryFont: 'Helvetica',
      headingSize: 'large',
      bodySize: 'medium'
    },
    components: {
      buttons: ['Primary Action Button', 'Secondary Button', 'Icon Button', 'Toggle Button'],
      forms: ['Content Editor Form', 'User Management Form', 'Settings Form', 'Search Form'],
      cards: ['Content Card', 'User Card', 'Analytics Card', 'System Status Card'],
      modals: ['Content Editor Modal', 'User Details Modal', 'Settings Modal', 'Confirmation Modal']
    }
  });

  if (result.success) {
    console.log('✅ Admin panel UI generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Admin panel UI generation failed:', result.error);
  }

  return result;
}

/**
 * Game UI Example
 * Mobile game interface
 */
export async function gameUIExample() {
  console.log('🎮 Generating game UI...');
  
  const result = await generateUIDesign({
    designType: 'game-ui',
    appName: 'Space Adventure',
    description: 'An immersive space exploration game with stunning visuals and engaging gameplay',
    features: [
      'Interactive game controls with touch gestures',
      'Progress tracking with achievements and levels',
      'Social features with friend connections and leaderboards',
      'In-game store with virtual items and upgrades',
      'Multiplayer modes with real-time gameplay',
      'Customization options for characters and ships'
    ],
    targetUsers: 'Gaming enthusiasts and casual mobile gamers',
    style: 'creative',
    colorScheme: 'dark',
    layout: 'tabs',
    orientation: 'portrait',
    size: '1024x1536',
    quality: 'high',
    context: 'Mobile space exploration game with immersive UI',
    branding: {
      logo: 'Futuristic, space-themed logo with sci-fi elements',
      tagline: 'Explore the Universe',
      companyName: 'SpaceGames Studio'
    },
    navigation: {
      type: 'bottom',
      items: ['Play', 'Hangar', 'Store', 'Social', 'Profile']
    },
    content: {
      hero: 'Welcome to Space Adventure - Your Journey Through the Cosmos Begins',
      sections: [
        'Game Play Interface with controls and HUD elements',
        'Hangar with ship customization and upgrades',
        'Store with virtual items and premium content',
        'Social Hub with friends and leaderboards'
      ],
      callToAction: 'Start Your Space Adventure Now'
    },
    typography: {
      primaryFont: 'Orbitron',
      secondaryFont: 'Exo',
      headingSize: 'large',
      bodySize: 'medium'
    },
    components: {
      buttons: ['Play Button', 'Action Button', 'Menu Button', 'Social Button'],
      forms: ['Character Creation Form', 'Settings Form', 'Chat Form', 'Purchase Form'],
      cards: ['Ship Card', 'Achievement Card', 'Friend Card', 'Item Card'],
      modals: ['Game Menu Modal', 'Settings Modal', 'Purchase Modal', 'Social Modal']
    }
  });

  if (result.success) {
    console.log('✅ Game UI generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Game UI generation failed:', result.error);
  }

  return result;
}

/**
 * Batch Processing Example
 * Generate multiple UI designs in one request
 */
export async function batchProcessingExample() {
  console.log('📦 Generating batch of UI designs...');
  
  const designs = [
    {
      designType: 'web-app' as const,
      appName: 'TaskManager Pro',
      description: 'Task management application',
      features: ['Task creation', 'Team collaboration'],
      style: 'modern' as const,
      colorScheme: 'professional' as const,
      quality: 'high' as const
    },
    {
      designType: 'mobile-app' as const,
      appName: 'FitTracker',
      description: 'Fitness tracking mobile app',
      features: ['Workout tracking', 'Progress monitoring'],
      style: 'material' as const,
      colorScheme: 'vibrant' as const,
      quality: 'high' as const
    },
    {
      designType: 'dashboard' as const,
      appName: 'Analytics Pro',
      description: 'Business analytics dashboard',
      features: ['Data visualization', 'Custom reports'],
      style: 'corporate' as const,
      colorScheme: 'dark' as const,
      quality: 'high' as const
    }
  ];

  const result = await generateUIDesign({ designs });

  if (result.success) {
    console.log('✅ Batch processing completed successfully');
    console.log('📊 Total designs: ' + result.results.summary.total);
    console.log('✅ Successful: ' + result.results.summary.successful);
    console.log('❌ Failed: ' + result.results.summary.failed);
  } else {
    console.error('❌ Batch processing failed:', result.error);
  }

  return result;
}

/**
 * Run all examples
 */
export async function runAllUIDesignExamples() {
  console.log('🚀 Starting GPT Image 1 UI Design Examples\n');
  
  const examples = [
    { name: 'Web Application', fn: webAppExample },
    { name: 'Mobile Application', fn: mobileAppExample },
    { name: 'Dashboard', fn: dashboardExample },
    { name: 'Landing Page', fn: landingPageExample },
    { name: 'E-commerce', fn: ecommerceExample },
    { name: 'Portfolio', fn: portfolioExample },
    { name: 'Admin Panel', fn: adminPanelExample },
    { name: 'Game UI', fn: gameUIExample },
    { name: 'Batch Processing', fn: batchProcessingExample }
  ];

  const results = [];

  for (const example of examples) {
    try {
      console.log(`\n--- ${example.name} ---`);
      const result = await example.fn();
      results.push({ name: example.name, success: result.success });
    } catch (error) {
      console.error(`❌ ${example.name} failed:`, error);
      results.push({ name: example.name, success: false, error: error.message });
    }
  }

  console.log('\n📋 Summary:');
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
  });

  const successful = results.filter(r => r.success).length;
  console.log(`\n🎯 Overall: ${successful}/${results.length} examples successful`);

  return results;
}

export default {
  webAppExample,
  mobileAppExample,
  dashboardExample,
  landingPageExample,
  ecommerceExample,
  portfolioExample,
  adminPanelExample,
  gameUIExample,
  batchProcessingExample,
  runAllUIDesignExamples
};
