# gabriel-endres-portfolio

Portefólio de Gabriel Carneiro Endres em português de Portugal e inglês. O mapa do universo, o índice e as fichas apresentam projetos académicos, web e de IA.

## Pré-visualização local

Com Node.js 22 ou posterior, executa `npm run dev` e abre [a pré-visualização](http://127.0.0.1:4173/). O servidor escuta apenas em localhost e volta a gerar as páginas quando os ficheiros de `src/` ou `public/` mudam. Recarrega a página para ver as alterações.

`npm run build` gera o site estático em `dist/`. O ficheiro `index.html` de cada galáxia e projeto permite abrir e recarregar URLs como `/galaxias/academic/` e `/projetos/eigenfaces/`. Para servir o site num subdiretório, define `PORTFOLIO_BASE` com o nome desse diretório antes de gerar o site. Por exemplo, no PowerShell, usa `$env:PORTFOLIO_BASE = 'gabriel-endres-portfolio'`.

## Adicionar ou atualizar projetos

Edita `src/content/projects.mjs`. Acrescenta uma entrada ao fim de `projects` com um `id` único em minúsculas e uma `category` (`academic`, `web` ou `ai`). Preenche `title`, `summary` e os campos descritivos como pares `{ pt: '…', en: '…' }`. A entrada passa a alimentar o mapa da galáxia, o índice e o URL `/projetos/<id>/`.

- Usa `status: 'development'` para projetos em desenvolvimento e `status: null` nos restantes. Os campos `semester` e `team` são opcionais.
- Preenche `objective`, `built`, `scope`, `contribution`, `results`, `working` e `planned` à medida que tiveres informação. Os campos vazios ficam ocultos. `scope` descreve o âmbito e `working` identifica funcionalidades já operacionais.
- Em `technologies` e `skills`, usa texto simples para nomes comuns aos dois idiomas e pares `pt`/`en` para os restantes. Uma lista vazia fica oculta.
- Quando houver um URL, coloca-o em `repository` para mostrar o botão de GitHub na ficha.
- Guarda capturas ou vídeos em `public/media/projects/<id>/`. Em `media`, adiciona objetos com `type` (`image`, `video` ou `demo`), `src` e `label` bilingue. Usa um caminho como `media/projects/<id>/captura.webp` ou um URL HTTPS. Podes fornecer `alt` bilingue para imagens e `poster` e `captions` (`pt`/`en`, ficheiros `.vtt`) para vídeos.

### Escolher o astro de um projeto

O campo opcional `astro` aceita qualquer identificador de `src/content/celestial.mjs`, por exemplo `saturn`, `red-dwarf`, `neutron-star`, `white-hole` ou `quasar`. Omitir `astro` atribui um planeta automaticamente. A sequência é Mercúrio, Vénus, Terra, Marte, Júpiter, Saturno, Urano e Neptuno. O nono projeto automático inicia um novo ciclo. A sequência é partilhada pelas galáxias e conta apenas os projetos com atribuição automática.

Acrescenta novos projetos ao fim para conservar as atribuições existentes. Para fixar a posição de um projeto automático mesmo que a lista seja reordenada, usa `planetSlot` com um número inteiro único a partir de zero (`0` para Mercúrio, `7` para Neptuno e `8` para o primeiro lugar do segundo ciclo). Os projetos sem `planetSlot` ocupam as posições livres pela ordem da lista. Cada galáxia recebe uma estrela ou um buraco negro ou branco decorativo quando precisar de completar essa composição.

## Escolher os destaques

Preenche `featuredProjectIds` em `src/content/projects.mjs` com os identificadores dos projetos na ordem pretendida. A secção mostra até três projetos e fica oculta enquanto a lista estiver vazia.

## Atualizar o CV

Para a pré-visualização, guarda a versão em revisão em `.preview/cv.pdf` e reinicia `npm run dev`. A pasta `.preview/` está excluída do Git. O servidor inclui a cópia local em `/media/cv.pdf` e o botão abre-a num novo separador.

Depois de aprovada a versão a divulgar, guarda o PDF aprovado em `public/media/cv.pdf` e executa `npm run build`. O botão entra na compilação pública quando esse ficheiro existe. A publicação é um passo separado da compilação.

## Estrutura

- `src/content/` contém os projetos, o perfil e as traduções da interface.
- `src/navigation/` define os URLs. `src/app.mjs` gere o histórico e a escolha de idioma.
- `src/ui/` e `src/styles.css` definem as páginas e os componentes.
- `src/content/celestial.mjs` e `src/celestial.css` definem os modelos de astros. As texturas de aproximação ficam em `public/media/astro/`.
- `src/motion.mjs` desenha o fundo de estrelas e anima a entrada nas galáxias. `src/camera.mjs` gere a aproximação aos astros e `src/expanded-map.mjs` gere a expansão na janela e em ecrã inteiro nativo.
