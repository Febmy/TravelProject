const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('figma_node_raw.json', 'utf8'));
const canvas = raw.nodes['0:1'].document;
const hp = canvas.children.find(c => c.name === 'homepage');

function printDetailed(node, depth = 0) {
  if (!node) return;
  const indent = '  '.repeat(depth);
  const text = node.type === 'TEXT' ? ` -> "${node.characters.replace(/\n/g, ' ')}"` : '';
  const fills = (node.fills || []).filter(f => f.visible !== false && f.type === 'SOLID' && f.color)
    .map(f => {
      const r = Math.round(f.color.r * 255).toString(16).padStart(2,'0');
      const g = Math.round(f.color.g * 255).toString(16).padStart(2,'0');
      const b = Math.round(f.color.b * 255).toString(16).padStart(2,'0');
      return `#${r}${g}${b}`;
    }).join(',');
  const fillStr = fills ? ` [fills: ${fills}]` : '';
  const size = node.absoluteBoundingBox ? ` (${Math.round(node.absoluteBoundingBox.width)}x${Math.round(node.absoluteBoundingBox.height)})` : '';
  console.log(`${indent}${node.name} [${node.type}]${size}${fillStr}${text}`);
  if (node.children && depth < 3) {
    node.children.forEach(c => printDetailed(c, depth + 1));
  }
}

console.log('=== HOMEPAGE DETAILED TREE ===');
printDetailed(hp);
