import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');

const isFile = (p) => {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
};

const isDir = (p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
};

const readText = (p) => fs.readFileSync(p, 'utf8');

const walk = (dir) => {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
      const full = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else out.push(full);
    }
  }
  return out;
};

const roots = walk(path.join(srcRoot, 'app'))
  .filter((p) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(p))
  .filter((p) => !p.includes(`${path.sep}__tests__${path.sep}`));

const resolveCandidates = (base) => {
  const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.scss', '.css'];
  const out = [];
  for (const ext of exts) out.push(base + ext);
  for (const ext of exts) out.push(path.join(base, 'index' + ext));
  return out;
};

const resolveSpecifier = (fromFile, spec) => {
  if (!spec || typeof spec !== 'string') return null;

  let raw = spec;
  if (raw.startsWith('@/')) {
    raw = path.join(srcRoot, raw.slice(2));
  } else if (raw.startsWith('./') || raw.startsWith('../')) {
    raw = path.resolve(path.dirname(fromFile), raw);
  } else if (raw.startsWith('/')) {
    raw = path.join(projectRoot, raw.slice(1));
  } else {
    return null;
  }

  if (isFile(raw)) return raw;
  for (const c of resolveCandidates(raw)) {
    if (isFile(c)) return c;
  }
  return null;
};

const extractSpecifiers = (sourceFile) => {
  const specs = [];
  const add = (v) => {
    if (typeof v === 'string' && v.length > 0) specs.push(v);
  };

  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const ms = node.moduleSpecifier;
      if (ms && ts.isStringLiteral(ms)) add(ms.text);
    } else if (ts.isCallExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === 'require') {
        const a0 = node.arguments?.[0];
        if (a0 && ts.isStringLiteral(a0)) add(a0.text);
      }
    } else if (ts.isImportCall(node)) {
      const a0 = node.arguments?.[0];
      if (a0 && ts.isStringLiteral(a0)) add(a0.text);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return specs;
};

const parseSource = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(ext)) return null;
  const text = readText(filePath);
  const kind =
    ext === '.tsx' ? ts.ScriptKind.TSX :
    ext === '.ts' ? ts.ScriptKind.TS :
    ext === '.jsx' ? ts.ScriptKind.JSX :
    ts.ScriptKind.JS;
  return ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, kind);
};

const withinSrc = (p) => {
  const rel = path.relative(srcRoot, p);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
};

const reachable = new Set();
const queue = [...roots];

while (queue.length) {
  const file = queue.pop();
  if (!file || reachable.has(file)) continue;
  reachable.add(file);

  const sf = parseSource(file);
  if (!sf) continue;

  const specs = extractSpecifiers(sf);
  for (const s of specs) {
    const resolved = resolveSpecifier(file, s);
    if (!resolved) continue;
    if (!withinSrc(resolved)) continue;
    if (!reachable.has(resolved)) queue.push(resolved);
  }
}

const allFiles = walk(srcRoot).filter((p) => {
  if (p.includes(`${path.sep}.next${path.sep}`)) return false;
  if (p.includes(`${path.sep}node_modules${path.sep}`)) return false;
  return true;
});

const deletableExts = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.scss', '.css',
]);

const protectedPrefixes = [
  path.join(srcRoot, 'assets') + path.sep,
  path.join(srcRoot, 'styles') + path.sep,
  path.join(srcRoot, 'types') + path.sep,
];

const isProtected = (p) => protectedPrefixes.some((pre) => p.startsWith(pre)) || p.endsWith('.d.ts');

const unused = [];
for (const f of allFiles) {
  const ext = path.extname(f).toLowerCase();
  if (!deletableExts.has(ext)) continue;
  if (isProtected(f)) continue;
  if (!reachable.has(f)) unused.push(f);
}

unused.sort();

const report = {
  roots: roots.map((p) => path.relative(projectRoot, p)).sort(),
  reachableCount: reachable.size,
  reachable: Array.from(reachable).map((p) => path.relative(projectRoot, p)).sort(),
  unusedCount: unused.length,
  unused: unused.map((p) => path.relative(projectRoot, p)),
};

fs.mkdirSync(path.join(projectRoot, 'docs'), { recursive: true });
fs.writeFileSync(path.join(projectRoot, 'docs', 'unused-src-report.json'), JSON.stringify(report, null, 2) + '\n');

console.log(`Reachable: ${report.reachableCount}`);
console.log(`Unused deletable files: ${report.unusedCount}`);
for (const p of report.unused) console.log(p);
