// Endereço do servidor (Cloudflare Worker) que processa o comprovante
const WORKER_URL = 'https://comprovantes-worker.williamamorim126.workers.dev/';

// Nome da "gaveta" onde guardamos informações do último envio
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
// para essa URL (algo terminando em /share-target), e é o service worker
// que intercepta essa chamada antes mesmo dela chegar em qualquer servidor.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname.endsWith('/share-target')) {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  try {
    // O Android empacota o arquivo compartilhado dentro de um "formData"
    const formData = await request.formData();
    const file = formData.get('comprovante');

    if (!file) {
      return Response.redirect('erro.html', 303);
    }

    // Manda o arquivo de verdade para o servidor (Cloudflare Worker),
    // que usa IA para ler Data/Descrição/Valor e salva na planilha.
    const formParaEnviar = new FormData();
    formParaEnviar.append('comprovante', file, file.name);

    const resposta = await fetch(WORKER_URL, {
      method: 'POST',
      body: formParaEnviar,
    });

    const resultado = await resposta.json();

    // Guarda o resultado (sucesso ou erro) para a tela poder exibir os dados
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      'ultimo-resultado',
      new Response(JSON.stringify(resultado), {
        headers: { 'Content-Type': 'application/json' },
      })
    );

    if (resultado.success) {
      return Response.redirect('sucesso.html', 303);
    } else {
      return Response.redirect('erro.html', 303);
    }
  } catch (err) {
    return Response.redirect('erro.html', 303);
  }
}
