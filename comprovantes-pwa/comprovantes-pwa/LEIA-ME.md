# Comprovantes — Passo 2 (app que aparece na lista de compartilhar)

Esses arquivos criam um app instalável (PWA) que, depois de instalado no
Android, aparece na lista de compartilhamento do celular — igual o WhatsApp,
o Gmail, etc.

Nesta etapa ele **ainda não lê os dados nem salva em banco de dados**. O
objetivo é só confirmar que o compartilhamento funciona de ponta a ponta.
Quando você compartilhar um PDF ou imagem pra ele, vai aparecer uma tela
confirmando o nome, tipo e tamanho do arquivo recebido.

## Por que precisa estar publicado na internet

O Android só deixa instalar e usar um PWA como alvo de compartilhamento se
ele estiver servido por HTTPS (não funciona abrindo o arquivo direto do
celular). A forma mais simples e gratuita pra isso é o GitHub Pages.

## Passo a passo para publicar (GitHub Pages)

1. Crie uma conta gratuita em https://github.com (se ainda não tiver).
2. Crie um repositório novo, público, com qualquer nome (ex: `comprovantes-app`).
3. Nesse repositório, envie (upload) estes 6 arquivos, todos na raiz:
   - `index.html`
   - `manifest.json`
   - `service-worker.js`
   - `sucesso.html`
   - `erro.html`
   - `icon-192.png`
   - `icon-512.png`
4. Vá em **Settings > Pages** do repositório.
5. Em "Branch", selecione `main` (ou `master`) e a pasta `/root`, depois
   clique em **Save**.
6. Espere 1-2 minutos. O GitHub vai te dar um link parecido com:
   `https://seu-usuario.github.io/comprovantes-app/`

## Passo a passo para instalar no celular do primo

1. Abra esse link no **Google Chrome** do Android (tem que ser o Chrome).
2. Toque no menu (⋮) no canto superior direito.
3. Toque em **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
4. Confirme a instalação. Um ícone "Comprovantes" vai aparecer na tela
   inicial, igual um app normal.

## Como testar se funcionou

1. Abra qualquer app do banco (ou a galeria de fotos) e escolha um
   comprovante em PDF ou imagem.
2. Toque em **Compartilhar**.
3. Procure por **"Comprovantes"** na lista — ele deve aparecer junto com
   WhatsApp, Gmail, etc.
4. Toque nele. Deve abrir uma tela verde confirmando o recebimento do
   arquivo, com nome, tipo e tamanho.

Se o app não aparecer na lista de compartilhar, o motivo mais comum é que
ele não foi instalado corretamente (passo anterior) — reabra o link e tente
instalar de novo.

## O que vem depois

Na próxima etapa vamos trocar a parte que só "confirma o recebimento" por um
envio de verdade para um servidor, que vai usar IA para ler a Data, a
Descrição e o Valor do comprovante e salvar num banco de dados.
