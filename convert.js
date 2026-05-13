import fs from 'fs';
import path from 'path';

const screensDir = path.join(process.cwd(), 'screens');
const pagesDir = path.join(process.cwd(), 'src', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

function htmlToJsx(html) {
  // Remove nested header and aside tags as they are provided by the Layout
  html = html.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '');
  html = html.replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, '');
  // Remove script tags as they are not valid in JSX/React this way
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  let jsx = html;
  
  // Replace class with className
  jsx = jsx.replace(/className="/g, 'class="'); // Reset if already run
  jsx = jsx.replace(/class="/g, 'className="');
  
  // Replace for with htmlFor
  jsx = jsx.replace(/for="/g, 'htmlFor="');
  
  // Self close img tags
  jsx = jsx.replace(/<img([^>]+?)(?<!\/)>/g, '<img$1 />');
  
  // Self close input tags
  jsx = jsx.replace(/<input([^>]+?)(?<!\/)>/g, '<input$1 />');
  
  // Fix inline styles
  jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
    const styleObj = p1.split(';').filter(s => s.trim()).reduce((acc, s) => {
      let [key, value] = s.split(':');
      if(key && value) {
        key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        acc += `"${key}": "${value.trim().replace(/"/g, "'")}",`;
      }
      return acc;
    }, '');
    return `style={{${styleObj}}}`;
  });

  // Convert HTML comments to JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  // Fix checked attribute
  jsx = jsx.replace(/checked /g, 'defaultChecked ');
  
  // Fix SVG attributes
  jsx = jsx.replace(/viewbox=/g, 'viewBox=');
  jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
  jsx = jsx.replace(/fill-opacity=/g, 'fillOpacity=');
  jsx = jsx.replace(/font-family=/g, 'fontFamily=');
  jsx = jsx.replace(/font-size=/g, 'fontSize=');
  jsx = jsx.replace(/text-anchor=/g, 'textAnchor=');
  jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
  jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  jsx = jsx.replace(/clip-rule=/g, 'clipRule=');
  jsx = jsx.replace(/fill-rule=/g, 'fillRule=');

  return jsx;
}

const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.html'));

let routes = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(screensDir, file), 'utf8');
  
  // Derive component name
  const nameMatch = file.match(/^\d+_(.*)\.html$/);
  let baseName = nameMatch ? nameMatch[1] : file.replace('.html', '');
  let componentName = baseName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  componentName = componentName.replace(/[^a-zA-Z0-9]/g, '');

  const routePath = '/' + baseName.toLowerCase().replace(/_/g, '-');
  routes.push({ path: routePath, component: componentName, file: `${componentName}.jsx` });

  let jsxOutput;
  const hasSidebar = content.includes('ml-[280px]') || content.includes('pl-[280px]');
  
  if (hasSidebar) {
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch) {
      const innerContent = htmlToJsx(mainMatch[1]);
      jsxOutput = `import React from 'react';\n\nexport default function ${componentName}() {\n  return (\n    <>\n${innerContent}\n    </>\n  );\n}\n`;
    }
  }

  if (!jsxOutput) {
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : content;
    const innerContent = htmlToJsx(bodyContent);
    jsxOutput = `import React from 'react';\n\nexport default function ${componentName}() {\n  return (\n    <div className="min-h-screen bg-background text-on-surface antialiased">\n${innerContent}\n    </div>\n  );\n}\n`;
  }

  fs.writeFileSync(path.join(pagesDir, `${componentName}.jsx`), jsxOutput);
}

// Generate App.jsx
const imports = routes.map(r => `import ${r.component} from './pages/${r.component}';`).join('\n');
const layoutRoutes = routes.filter(r => r.component !== 'LoginMedallionTheatre');
const loginRoute = routes.find(r => r.component === 'LoginMedallionTheatre');

const appContent = `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
${imports}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        ${loginRoute ? `<Route path="${loginRoute.path}" element={<${loginRoute.component} />} />` : ''}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/clerk-dashboard" />} />
${layoutRoutes.map(r => `          <Route path="${r.path}" element={<${r.component} />} />`).join('\n')}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'App.jsx'), appContent);
