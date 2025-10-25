/**
 * Adds a watermark to a base64-encoded image
 * For free tier users, adds "Brand Kit AI" watermark
 */
export function addWatermark(base64Image: string): string {
  // Create an SVG watermark overlay
  const watermarkSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.5"/>
        </filter>
      </defs>
      <rect width="200" height="60" fill="black" opacity="0.3" rx="8"/>
      <text x="100" y="35" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" 
            fill="white" text-anchor="middle" filter="url(#shadow)">Brand Kit AI</text>
    </svg>
  `;
  
  // Convert watermark SVG to base64
  const watermarkBase64 = Buffer.from(watermarkSVG).toString('base64');
  
  // Create HTML that overlays the watermark on the image
  // This is a simple approach - in production, you'd use a proper image library like sharp
  const watermarkedImageHTML = `
    data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1024" height="1024">
        <image href="data:image/png;base64,${base64Image}" width="1024" height="1024"/>
        <image href="data:image/svg+xml;base64,${watermarkBase64}" x="824" y="944" width="200" height="60"/>
      </svg>
    `).toString('base64')}
  `;
  
  return watermarkedImageHTML;
}
