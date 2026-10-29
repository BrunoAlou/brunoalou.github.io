// Preenche o campo `capa` dos itens do catálogo que têm `imdb: tt...`,
// usando o pôster do IMDb.
//
// Uso:  node scripts/capas-imdb.mjs            (só itens sem capa)
//       node scripts/capas-imdb.mjs --forcar   (substitui capas existentes)

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const PASTA = new URL('../_catalogo/', import.meta.url);
const LARGURA = 400; // largura do pôster em pixels
const forcar = process.argv.includes('--forcar');

async function buscarPoster(imdbId) {
  const resposta = await fetch(`https://v3.sg.media-imdb.com/suggestion/t/${imdbId}.json`);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const dados = await resposta.json();
  const titulo = (dados.d || []).find((d) => d.id === imdbId);
  const url = titulo?.i?.imageUrl;
  if (!url) throw new Error('pôster não encontrado');
  // "..._V1_.jpg" -> "..._V1_SX400.jpg" (versão redimensionada)
  return url.replace(/\._V1_.*\.jpg$/, `._V1_SX${LARGURA}.jpg`);
}

for (const arquivo of await readdir(PASTA)) {
  if (!arquivo.endsWith('.md')) continue;

  const caminho = join(PASTA.pathname.replace(/^\/([A-Za-z]:)/, '$1'), arquivo);
  const texto = await readFile(caminho, 'utf8');
  const frontMatter = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontMatter) continue;

  const imdb = frontMatter[1].match(/^imdb:\s*(tt\d+)\s*$/m)?.[1];
  const temCapa = /^capa:/m.test(frontMatter[1]);
  if (!imdb || (temCapa && !forcar)) continue;

  try {
    const capa = await buscarPoster(imdb);
    let novoFrontMatter = frontMatter[1].replace(/^capa:.*\r?\n?/m, '');
    novoFrontMatter = novoFrontMatter.replace(/^(imdb:.*)$/m, `$1\ncapa: ${capa}`);
    await writeFile(caminho, texto.replace(frontMatter[1], novoFrontMatter));
    console.log(`✔ ${arquivo}: ${capa}`);
  } catch (erro) {
    console.log(`✘ ${arquivo} (${imdb}): ${erro.message}`);
  }
}
