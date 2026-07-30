const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projects = [
  {
    name: 'orbit-analytics',
    title: 'Orbit Analytics',
    gradient: ['#667eea', '#764ba2'],
    images: ['orbit-analytics.png', 'orbit-analytics-1.png', 'orbit-analytics-2.png', 'orbit-analytics-3.png']
  },
  {
    name: 'commerce-kit',
    title: 'CommerceKit',
    gradient: ['#f093fb', '#f5576c'],
    images: ['commerce-kit.png', 'commerce-kit-1.png', 'commerce-kit-2.png']
  },
  {
    name: 'focusflow',
    title: 'FocusFlow',
    gradient: ['#4facfe', '#00f2fe'],
    images: ['focusflow.png', 'focusflow-1.png', 'focusflow-2.png']
  },
  {
    name: 'devlog-cms',
    title: 'Devlog CMS',
    gradient: ['#43e97b', '#38f9d7'],
    images: ['devlog-cms.png', 'devlog-cms-1.png']
  },
  {
    name: 'pulse-api',
    title: 'Pulse API',
    gradient: ['#fa709a', '#fee140'],
    images: ['pulse-api.png', 'pulse-api-1.png', 'pulse-api-2.png']
  }
];

const width = 1200;
const height = 750;

function createSVG(title, gradient, variant = '') {
  const displayTitle = variant ? `${title} ${variant}` : title;
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradient[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradient[1]};stop-opacity:1" />
        </linearGradient>
        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="20" height="20" fill="rgba(255,255,255,0.05)" />
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
      <rect width="${width}" height="${height}" fill="url(#pattern)" />
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
            fill="rgba(255,255,255,0.95)" text-anchor="middle" dominant-baseline="middle">
        ${displayTitle}
      </text>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="32" 
            fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">
        Project Placeholder
      </text>
    </svg>
  `;
}

async function createPlaceholder(title, gradient, filename, variant = '') {
  const svg = createSVG(title, gradient, variant);
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'projects', filename);
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`✓ Created ${filename}`);
}

// Generate all placeholders
async function generateAll() {
  console.log('Generating placeholder images...\n');

  for (const project of projects) {
    for (let i = 0; i < project.images.length; i++) {
      const filename = project.images[i];
      const variant = i > 0 ? `#${i}` : '';
      await createPlaceholder(project.title, project.gradient, filename, variant);
    }
  }

  console.log('\n✓ All placeholder images generated successfully!');
}

generateAll().catch(console.error);
