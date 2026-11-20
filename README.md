# Portfólio de Kaio Amim

Portfólio pessoal desenvolvido com React e Vite. A interface reúne projetos, trajetória, competências e formas de contato.

## Executar localmente

```sh
npm install
npm run dev
npm run build
npm run preview
```

O comando `npm run build` gera o site estático em `dist/`, incluindo as páginas personalizadas de erro 404 e 500 e a tela de recuperação em `/recuperacao.html`.

## Estrutura

- `src/content.js`: perfil, projetos, competências e trajetória.
- `src/App.jsx` e `src/components/`: interface e interações do site.
- `src/styles.css`: estilos principais, organizados por seção.
- `public/projects/`: imagens dos projetos e capas usadas nos cards.
- `public/curriculo-kaio-amim.pdf`: currículo disponível para download.
- `404.html`, `500.html` e `public/error.css`: páginas personalizadas de erro.
- `public/politica-de-cookies.html` e `public/politica-de-privacidade.html`: políticas do site.

## Recursos

- Layout responsivo, tema claro/escuro e preferência por movimento reduzido.
- Consentimento de cookies com escolhas registradas no navegador; nenhuma categoria opcional é ativada antes do aceite.
- Formulário de contato via Formspree quando `VITE_FORMSPREE_ENDPOINT` está configurado; caso contrário, abre um rascunho no aplicativo de e-mail.
- Página offline servida pelo service worker após uma visita com cache disponível.
- Testes do fallback offline: `node tests/offline.test.mjs`.
- `dev/states.html` permite inspecionar estados de carregamento, erro e offline localmente; não é incluída no build.
