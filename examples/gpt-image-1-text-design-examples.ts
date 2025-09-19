/**
 * GPT Image 1 Text Design Examples
 * 
 * Comprehensive examples demonstrating the use of GPT Image 1 for generating
 * text-heavy designs including brochures, flyers, posters, business cards,
 * and other marketing materials with extremely detailed prompts.
 */

import { generateTextDesign } from '../executors/gpt-image-1-text-designer';

/**
 * Business Brochure Example
 * Professional corporate brochure with company services
 */
export async function businessBrochureExample() {
  console.log('📄 Generating business brochure...');
  
  const result = await generateTextDesign({
    designType: 'brochure',
    title: 'Professional Services',
    subtitle: 'Excellence in Every Project',
    content: [
      'Consulting Services: Strategic business consulting and advisory services',
      'Project Management: End-to-end project management and delivery',
      'Technical Support: 24/7 technical support and maintenance',
      'Training Programs: Comprehensive training and development programs',
      'Quality Assurance: Rigorous quality control and testing processes'
    ],
    companyName: 'TechSolutions Inc.',
    contactInfo: {
      phone: '+1-555-0123',
      email: 'info@techsolutions.com',
      website: 'www.techsolutions.com',
      address: '123 Business Plaza, Suite 100, New York, NY 10001'
    },
    style: 'corporate',
    colorScheme: 'professional',
    layout: 'two-column',
    orientation: 'portrait',
    size: '1024x1536',
    quality: 'high',
    context: 'Business marketing material for B2B clients',
    targetAudience: 'Business executives and decision makers',
    callToAction: 'Contact us today for a free consultation!',
    logo: 'Modern, minimalist logo with clean lines and professional typography',
    typography: {
      primaryFont: 'Arial',
      secondaryFont: 'Helvetica',
      headingSize: 'large',
      bodySize: 'medium'
    }
  });

  if (result.success) {
    console.log('✅ Business brochure generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Business brochure generation failed:', result.error);
  }

  return result;
}

/**
 * Event Flyer Example
 * Creative flyer for a special event
 */
export async function eventFlyerExample() {
  console.log('🎉 Generating event flyer...');
  
  const result = await generateTextDesign({
    designType: 'flyer',
    title: 'Annual Tech Conference 2024',
    subtitle: 'Innovation in Technology',
    content: [
      'Date: March 15-17, 2024',
      'Location: Convention Center, San Francisco',
      'Speakers: Industry leaders and innovators',
      'Registration: Early bird special - 20% off!',
      'Networking: Connect with 500+ professionals',
      'Workshops: Hands-on learning sessions'
    ],
    style: 'creative',
    colorScheme: 'vibrant',
    layout: 'centered',
    orientation: 'portrait',
    size: '1024x1536',
    quality: 'high',
    context: 'Technology conference promotion',
    targetAudience: 'Technology professionals and enthusiasts',
    callToAction: 'Register now at www.techconf2024.com',
    logo: 'Modern tech conference logo with geometric elements',
    images: ['Technology conference scene', 'Professional networking event'],
    typography: {
      primaryFont: 'Roboto',
      secondaryFont: 'Open Sans',
      headingSize: 'extra-large',
      bodySize: 'large'
    }
  });

  if (result.success) {
    console.log('✅ Event flyer generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Event flyer generation failed:', result.error);
  }

  return result;
}

/**
 * Product Poster Example
 * Bold poster for product launch
 */
export async function productPosterExample() {
  console.log('📢 Generating product poster...');
  
  const result = await generateTextDesign({
    designType: 'poster',
    title: 'NEW PRODUCT LAUNCH',
    subtitle: 'Revolutionary Smart Home System',
    content: [
      'Control your entire home with one app',
      'Voice-activated smart devices',
      'Energy-efficient automation',
      '24/7 security monitoring',
      'Easy installation and setup'
    ],
    companyName: 'SmartHome Solutions',
    contactInfo: {
      phone: '+1-555-0199',
      email: 'info@smarthomesolutions.com',
      website: 'www.smarthomesolutions.com'
    },
    style: 'bold',
    colorScheme: 'vibrant',
    layout: 'asymmetric',
    orientation: 'portrait',
    size: '1024x1536',
    quality: 'high',
    context: 'Product launch marketing campaign',
    targetAudience: 'Homeowners and tech enthusiasts',
    callToAction: 'Pre-order now and save 30%!',
    logo: 'Modern smart home logo with connected device icons',
    images: ['Smart home interior', 'Connected devices', 'Happy family using smart home'],
    typography: {
      primaryFont: 'Montserrat',
      secondaryFont: 'Lato',
      headingSize: 'extra-large',
      bodySize: 'large'
    }
  });

  if (result.success) {
    console.log('✅ Product poster generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Product poster generation failed:', result.error);
  }

  return result;
}

/**
 * Business Card Example
 * Professional business card design
 */
export async function businessCardExample() {
  console.log('💼 Generating business card...');
  
  const result = await generateTextDesign({
    designType: 'business-card',
    title: 'Sarah Johnson',
    content: [
      'Senior Marketing Director',
      'Creative Solutions Agency'
    ],
    contactInfo: {
      phone: '+1-555-0155',
      email: 'sarah.johnson@creativesolutions.com',
      website: 'www.creativesolutions.com',
      address: '456 Creative Lane, Los Angeles, CA 90210'
    },
    style: 'elegant',
    colorScheme: 'professional',
    layout: 'centered',
    orientation: 'landscape',
    size: '1024x1024',
    quality: 'high',
    context: 'Professional networking and business development',
    targetAudience: 'Business professionals and potential clients',
    logo: 'Elegant, sophisticated logo with clean typography',
    typography: {
      primaryFont: 'Playfair Display',
      secondaryFont: 'Source Sans Pro',
      headingSize: 'medium',
      bodySize: 'small'
    }
  });

  if (result.success) {
    console.log('✅ Business card generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Business card generation failed:', result.error);
  }

  return result;
}

/**
 * Restaurant Menu Example
 * Appetizing restaurant menu design
 */
export async function restaurantMenuExample() {
  console.log('🍽️ Generating restaurant menu...');
  
  const result = await generateTextDesign({
    designType: 'menu',
    title: 'Bella Vista Restaurant',
    subtitle: 'Authentic Italian Cuisine',
    content: [
      'APPETIZERS',
      'Bruschetta al Pomodoro - $12',
      'Antipasto Misto - $18',
      'Calamari Fritti - $16',
      '',
      'PASTA',
      'Spaghetti Carbonara - $22',
      'Penne all\'Arrabbiata - $20',
      'Lobster Ravioli - $28',
      '',
      'MAIN COURSES',
      'Osso Buco - $32',
      'Saltimbocca alla Romana - $26',
      'Branzino al Sale - $30',
      '',
      'DESSERTS',
      'Tiramisu - $10',
      'Panna Cotta - $8',
      'Gelato Selection - $6'
    ],
    style: 'elegant',
    colorScheme: 'warm',
    layout: 'two-column',
    orientation: 'portrait',
    size: '1024x1536',
    quality: 'high',
    context: 'Fine dining restaurant menu',
    targetAudience: 'Food enthusiasts and restaurant patrons',
    callToAction: 'Reservations: (555) 123-4567',
    logo: 'Elegant Italian restaurant logo with classic typography',
    images: ['Italian cuisine', 'Restaurant interior', 'Chef preparing food'],
    typography: {
      primaryFont: 'Playfair Display',
      secondaryFont: 'Lato',
      headingSize: 'large',
      bodySize: 'medium'
    }
  });

  if (result.success) {
    console.log('✅ Restaurant menu generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Restaurant menu generation failed:', result.error);
  }

  return result;
}

/**
 * Newsletter Example
 * Professional newsletter design
 */
export async function newsletterExample() {
  console.log('📰 Generating newsletter...');
  
  const result = await generateTextDesign({
    designType: 'newsletter',
    title: 'Monthly Business Update',
    subtitle: 'January 2024 Edition',
    content: [
      'CEO MESSAGE',
      'Welcome to our first newsletter of 2024! We\'re excited to share our latest achievements and upcoming initiatives.',
      '',
      'COMPANY NEWS',
      '• Record-breaking Q4 performance with 25% growth',
      '• New office opening in Austin, Texas',
      '• Partnership with leading technology provider',
      '',
      'FEATURED ARTICLE',
      'The Future of Remote Work: How our company is adapting to the new normal and creating innovative solutions for distributed teams.',
      '',
      'UPCOMING EVENTS',
      '• Annual company retreat - March 15-17',
      '• Industry conference presentation - April 5',
      '• Team building workshop - February 20'
    ],
    companyName: 'Innovation Corp',
    contactInfo: {
      email: 'newsletter@innovationcorp.com',
      website: 'www.innovationcorp.com'
    },
    style: 'corporate',
    colorScheme: 'professional',
    layout: 'three-column',
    orientation: 'portrait',
    size: '1024x1536',
    quality: 'high',
    context: 'Internal company communication',
    targetAudience: 'Employees and stakeholders',
    callToAction: 'Subscribe to our newsletter for monthly updates',
    logo: 'Professional corporate logo with modern design',
    images: ['Company team photo', 'Office building', 'Technology workspace'],
    typography: {
      primaryFont: 'Arial',
      secondaryFont: 'Georgia',
      headingSize: 'large',
      bodySize: 'medium'
    }
  });

  if (result.success) {
    console.log('✅ Newsletter generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Newsletter generation failed:', result.error);
  }

  return result;
}

/**
 * Certificate Example
 * Professional certificate design
 */
export async function certificateExample() {
  console.log('🏆 Generating certificate...');
  
  const result = await generateTextDesign({
    designType: 'certificate',
    title: 'CERTIFICATE OF COMPLETION',
    subtitle: 'Professional Development Program',
    content: [
      'This certifies that',
      'JOHN SMITH',
      'has successfully completed the',
      'Advanced Project Management Certification Program',
      'with distinction',
      '',
      'Program Duration: 40 hours',
      'Completion Date: January 15, 2024',
      'Instructor: Dr. Jane Williams',
      'Program ID: PM-2024-001'
    ],
    companyName: 'Professional Development Institute',
    contactInfo: {
      email: 'certificates@pdinst.com',
      website: 'www.pdinst.com'
    },
    style: 'elegant',
    colorScheme: 'professional',
    layout: 'centered',
    orientation: 'landscape',
    size: '1536x1024',
    quality: 'high',
    context: 'Professional certification and recognition',
    targetAudience: 'Program graduates and employers',
    callToAction: 'Verify this certificate at www.pdinst.com/verify',
    logo: 'Official institute seal with formal design',
    images: ['Graduation cap', 'Diploma ribbon', 'Professional achievement'],
    typography: {
      primaryFont: 'Times New Roman',
      secondaryFont: 'Garamond',
      headingSize: 'extra-large',
      bodySize: 'large'
    }
  });

  if (result.success) {
    console.log('✅ Certificate generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Certificate generation failed:', result.error);
  }

  return result;
}

/**
 * Product Label Example
 * Professional product label design
 */
export async function productLabelExample() {
  console.log('🏷️ Generating product label...');
  
  const result = await generateTextDesign({
    designType: 'label',
    title: 'ORGANIC HONEY',
    subtitle: 'Pure & Natural',
    content: [
      'Net Weight: 12 oz (340g)',
      'Ingredients: 100% Pure Organic Honey',
      'Origin: California, USA',
      'Best Before: 12/2025',
      'Batch #: HNY-2024-001',
      'UPC: 123456789012'
    ],
    companyName: 'Golden Valley Farms',
    contactInfo: {
      phone: '+1-555-0166',
      email: 'info@goldenvalleyfarms.com',
      website: 'www.goldenvalleyfarms.com'
    },
    style: 'modern',
    colorScheme: 'natural',
    layout: 'centered',
    orientation: 'portrait',
    size: '1024x1024',
    quality: 'high',
    context: 'Organic food product packaging',
    targetAudience: 'Health-conscious consumers',
    callToAction: 'Visit our website for more products',
    logo: 'Natural, organic farm logo with honeycomb design',
    images: ['Honey jar', 'Bee on flower', 'Organic farm scene'],
    typography: {
      primaryFont: 'Open Sans',
      secondaryFont: 'Roboto',
      headingSize: 'large',
      bodySize: 'small'
    }
  });

  if (result.success) {
    console.log('✅ Product label generated successfully');
    console.log('💰 Cost: $' + result.design.metadata.cost.toFixed(4));
    console.log('⏱️ Processing time: ' + result.design.metadata.processingTime + 'ms');
  } else {
    console.error('❌ Product label generation failed:', result.error);
  }

  return result;
}

/**
 * Batch Processing Example
 * Generate multiple designs in one request
 */
export async function batchProcessingExample() {
  console.log('📦 Generating batch of designs...');
  
  const designs = [
    {
      designType: 'brochure' as const,
      title: 'Company Services',
      content: ['Service 1', 'Service 2', 'Service 3'],
      style: 'corporate' as const,
      colorScheme: 'professional' as const,
      quality: 'high' as const
    },
    {
      designType: 'flyer' as const,
      title: 'Special Event',
      content: ['Event details', 'Date and time', 'Location'],
      style: 'creative' as const,
      colorScheme: 'vibrant' as const,
      quality: 'high' as const
    },
    {
      designType: 'business-card' as const,
      title: 'John Doe',
      content: ['CEO', 'Company Name'],
      contactInfo: {
        phone: '+1-555-0123',
        email: 'john@company.com'
      },
      style: 'elegant' as const,
      colorScheme: 'professional' as const,
      quality: 'high' as const
    }
  ];

  const result = await generateTextDesign({ designs });

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
export async function runAllTextDesignExamples() {
  console.log('🚀 Starting GPT Image 1 Text Design Examples\n');
  
  const examples = [
    { name: 'Business Brochure', fn: businessBrochureExample },
    { name: 'Event Flyer', fn: eventFlyerExample },
    { name: 'Product Poster', fn: productPosterExample },
    { name: 'Business Card', fn: businessCardExample },
    { name: 'Restaurant Menu', fn: restaurantMenuExample },
    { name: 'Newsletter', fn: newsletterExample },
    { name: 'Certificate', fn: certificateExample },
    { name: 'Product Label', fn: productLabelExample },
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
  businessBrochureExample,
  eventFlyerExample,
  productPosterExample,
  businessCardExample,
  restaurantMenuExample,
  newsletterExample,
  certificateExample,
  productLabelExample,
  batchProcessingExample,
  runAllTextDesignExamples
};
