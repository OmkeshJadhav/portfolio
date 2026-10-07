const path = require('path');
const sharp = require('sharp');

const blogPosts = [
  {
    filename: 'server-components.png',
    title: 'React Server Components',
    gradient: ['#61dafb', '#0088cc'],
  },
  {
    filename: 'postgres-indexes.png',
    title: 'PostgreSQL Indexes',
    gradient: ['#336791', '#4169e1'],
  },
  {
    filename: 'lenis-gsap.png',
    title: 'Lenis & GSAP',
    gradient: ['#88ce02', '#0ae448'],
  },
  {
    filename: 'race-condition.png',
    title: 'Debugging Race Conditions',
    gradient: ['#ff6b6b', '#ee5a6f'],
  },
];

const width = 1200;
const height = 750;

function createSVG(title, gradient) {
  // Escape XML entities
  const escapedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
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
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="64" font-weight="bold" 
            fill="rgba(255,255,255,0.95)" text-anchor="middle" dominant-baseline="middle">
        ${escapedTitle}
      </text>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="28" 
            fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">
        Blog Post Cover
      </text>
    </svg>
  `;
}

async function createPlaceholder(title, gradient, filename) {
  const svg = createSVG(title, gradient);
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'blog', filename);
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`✓ Created ${filename}`);
}

async function generateAll() {
  console.log('Generating blog placeholder images...\n');

  for (const post of blogPosts) {
    await createPlaceholder(post.title, post.gradient, post.filename);
  }

  console.log('\n✓ All blog placeholder images generated successfully!');
}

generateAll().catch(console.error);
