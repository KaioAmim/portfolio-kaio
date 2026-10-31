# Portfólio de Kaio Amim

React + Vite + Canvas. Conteúdo e links baseados no currículo fornecido. Fontes e imagens locais.

## Executar

```sh
npm install
npm run dev
npm run build
npm run preview
```

`dist/` contém a versão estática de produção. Esta versão inclui a foto de apresentação e a seção Stacks com filtros por categoria.

## Conteúdo e visual

- `src/content.js`: dados pessoais, projetos, competências e trajetória.
- `public/curriculo-kaio-amim.pdf`: currículo original para download.
- `public/projects/`: capturas reais dos projetos em WebP.
- `src/styles.css`: estrutura e responsividade.
- `src/experience.css`: temas claro/escuro, violeta, carrossel e animações.
- `src/components/HeroScene.jsx`: robô holográfico do anexo, com projeção 3D, arraste e quatro ângulos.

- `src/violet.css`: revisão violeta, cards ilustrados, contato e carregamento percentual.
- `public/projects/covers/`: capas vetoriais originais; capturas reais mantidas nos detalhes.

## Interações

- Carrossel de projetos com reprodução automática, pausa, setas, indicadores, teclado e rolagem por toque. Pausa ao receber foco ou hover e quando a seção sai da tela.
- Botões “Ver site” destacados e tags com as cores das tecnologias.
- Stacks com ícones do Simple Icons, letreiro contínuo e pausa.
- Linha do tempo alternada no desktop; coluna única no celular. Entrada em 3D ao filtrar.
- Tema persistido localmente. Transição curta de cores e animação apenas no botão, sem transformar a página.
- Brilho suave no cursor em dispositivos com mouse.
- Preferência de movimento reduzido respeitada por padrão. O botão de movimento na cena permite ativar todos os efeitos explicitamente.
- Modal acessível, menu móvel, download do CV e cópia de e-mail.

## Carregamento e contingência

A tela de carregamento acompanha a preparação da cena (com limite para não bloquear a página). Erros de renderização possuem uma tela de recuperação; a ausência de conexão tem um estado específico.

Em produção, o service worker salva somente `offline.html`, mantendo o aplicativo atualizado pela rede. Em uma visita posterior, falhas de rede e respostas 5xx na navegação podem apresentar essa página. Não é possível exibir uma página personalizada na primeira visita durante uma queda total do servidor/DNS, antes de qualquer cache existir. Os caminhos de autenticação não são interceptados.

## Verificação

```sh
node tests/offline.test.mjs
```

Cinco casos cobrem rede indisponível, HTTP 503, resposta normal, preservação de autenticação e exclusão de assets/rotas de login. `dev/states.html?mode=loading`, `?mode=error` e `?mode=offline` são uma bancada local de inspeção; não entram no build publicado.

Contato: o formulário prepara um e-mail no aplicativo do visitante; não envia mensagens por servidor.
Carregamento: palavras animadas do anexo e entrada antecipada, sem logo. Aguarda recursos iniciais com limite para evitar bloqueio.

## Integração do anexo — 27/10/2026
HeroScene e estilo do letreiro adaptados de portfolio-kaio-main.zip. Loader baseado no componente IntroLoader do anexo (referência original: https://uiverse.io/kennyotsu/fresh-lizard-20). Transições implementadas com Web Animations, sem dependência adicional. Process descreve quatro etapas ilustrativas e entregáveis.

Stacks: seção com ícones, descrições e níveis estimados reproduzidos do anexo. ServiceVisual contém as quatro ilustrações SVG originais do anexo. Instagram incluído conforme profile.social.instagram do arquivo fornecido.

## Estudos de identidade visual

As propostas KA e AFK estão em [`design/identidade-ka/`](design/identidade-ka/README.md), incluindo os dois modelos preferidos com A de barra curva. São estudos para avaliação e não substituem a marca usada pelo site.
