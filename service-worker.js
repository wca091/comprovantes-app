// Nome da "gaveta" onde vamos guardar o último comprovante recebido
const CACHE_NAME = 'comprovantes-share-cache';

// Instala o service worker imediatamente, sem esperar
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Assume o controle da página assim que ativado
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Aqui é onde a mágica acontece: o Android manda o arquivo compartilhado
// para essa URL (/share-target), e é o service worker que intercepta essa
// chamada antes mesmo dela chegar em qualquer servidor.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname === '/share-target') {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  try {
    // O Android empacota o arquivo compartilhado dentro de um "formData"
    const formData = await request.formData();
    const file = formData.get('comprovante');

    if (file) {
      const cache = await caches.open(CACHE_NAME);

      // Por enquanto guardamos só localmente (nesta etapa ainda não existe
      // um servidor de verdade). Isso vai virar um "enviar para o backend"
      // na próxima etapa do projeto.
      await cache.put(
        '/ultimo-comprovante',
        new Response(file, { headers: { 'Content-Type': file.type } })
      );

      const metadata = { name: file.name, type: file.type, size: file.size };
      await cache.put(
        '/ultimo-comprovante-info',
        new Response(JSON.stringify(metadata), {
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // Redireciona para a tela de sucesso (303 evita reenvio se a página for atualizada)
    return Response.redirect('/sucesso.html', 303);
  } catch (err) {
    return Response.redirect('/erro.html', 303);
  }
}
