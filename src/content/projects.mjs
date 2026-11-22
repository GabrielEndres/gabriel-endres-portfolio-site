import { assignProjectAstros, completeGalaxy } from './astro-assignment.mjs';

export const categories = [
  { id: 'academic', label: { pt: 'Projetos académicos', en: 'Academic Projects' }, art: 'academic.webp' },
  { id: 'web', label: { pt: 'Projetos web', en: 'Web Projects' }, art: 'web.webp' },
  { id: 'ai', label: { pt: 'Projetos de IA', en: 'AI Projects' }, art: 'ai.webp' },
];

export const featuredProjectIds = [];

export const projects = [
  {
    id: 'eigenfaces', category: 'academic', planetSlot: 0, status: null, semester: 1, team: true,
    title: { pt: 'Eigenfaces', en: 'Eigenfaces' },
    summary: { pt: 'Aplicação Java que aproxima matrizes e reconstrói e compara imagens faciais através de Eigenfaces.', en: 'A Java application that approximates matrices and uses Eigenfaces to reconstruct and compare face images.' },
    objective: { pt: 'Representar imagens em tons de cinzento com menos componentes e avaliar quanta informação se perde na reconstrução.', en: 'Represent greyscale images with fewer components and measure how much information is lost during reconstruction.' },
    built: { pt: 'A aplicação lê matrizes e imagens em CSV, reconstrói-as com um número configurável de componentes e mede o erro absoluto médio. No espaço das Eigenfaces, identifica a imagem mais próxima da base por distância euclidiana e pode gerar uma imagem sintética. Exporta imagens em CSV e JPEG.', en: 'The application reads matrices and images from CSV, reconstructs them with a configurable number of components, and measures mean absolute error. In Eigenface space, it identifies the closest reference image by Euclidean distance and can generate a synthetic image. It exports images as CSV and JPEG.' },
    contribution: { pt: 'Implementei a aproximação de matrizes por decomposição em valores e vetores próprios. Trabalhei no cálculo da matriz de covariância, na normalização dos vetores próprios e na reconstrução de imagens, além de acrescentar testes e corrigir o menu da aplicação.', en: 'I implemented matrix approximation using eigenvalue decomposition. I worked on covariance calculation, eigenvector normalisation, and image reconstruction, added tests, and fixed issues in the application menu.' },
    commits: { authored: 55, total: 100 },
    results: null, working: null, planned: null,
    technologies: ['Java', 'Apache Commons Math', { pt: 'Análise de componentes principais (PCA)', en: 'Principal component analysis (PCA)' }],
    skills: [{ pt: 'Processamento de imagem', en: 'Image processing' }],
    media: [], repository: null,
  },
  {
    id: 'railway-network-simulator', category: 'academic', astro: 'sun', status: null, semester: 2, team: true,
    title: { pt: 'Railway Network Simulator', en: 'Railway Network Simulator' },
    summary: { pt: 'Simulador de gestão ferroviária em JavaFX com mapas editáveis, transporte de mercadorias e gestão de orçamento.', en: 'A JavaFX railway management simulator with editable maps, freight transport, and budget management.' },
    objective: { pt: 'Construir uma rede ferroviária, definir cenários e analisar como a infraestrutura e a operação dos comboios afetam o transporte de carga.', en: 'Build a railway network, define scenarios, and analyse how infrastructure and train operations affect freight transport.' },
    built: { pt: 'O editor permite criar mapas com cidades e indústrias, construir estações e ligar a rede por vias férreas. Na simulação, o utilizador atribui comboios a rotas de carga e acompanha despesas de operação e receitas de entregas. O projeto inclui análise de conectividade e testes com JUnit 5.', en: 'The editor lets users create maps with cities and industries, build stations, and connect them by rail. In the simulation, users assign trains to freight routes and track operating costs and delivery revenue. The project also includes connectivity analysis and JUnit 5 tests.' },
    contribution: { pt: 'Desenvolvi a lógica do simulador e partes da sua interface em JavaFX. Trabalhei na criação de cenários e nas melhorias de estações e implementei o custo de manutenção das vias, que entra no cálculo dos resultados financeiros.', en: 'I developed the simulation logic and parts of its JavaFX interface. I worked on scenario creation and station upgrades and implemented track maintenance costs for the financial reporting.' },
    commits: { authored: 58, total: 217 },
    results: null, working: null, planned: null,
    technologies: ['Java', 'JavaFX', 'JUnit 5'],
    skills: [{ pt: 'Simulação', en: 'Simulation' }, { pt: 'Testes de software', en: 'Software testing' }, 'Scrum'],
    media: [], repository: null,
  },
  {
    id: 'logistics-on-rails', category: 'academic', planetSlot: 1, status: null, semester: 3, team: true,
    title: { pt: 'Logistics on Rails', en: 'Logistics on Rails' },
    summary: { pt: 'Sistema de logística ferroviária que integra planeamento de viagens, operações de armazém e gestão de estações.', en: 'A rail freight logistics system that integrates journey planning, warehouse operations, and station management.' },
    objective: { pt: 'Apoiar o planeamento do transporte de mercadorias desde a descarga e preparação de encomendas até à análise da rede e dos tempos de viagem.', en: 'Support freight planning from unloading and order picking through to network analysis and travel time estimation.' },
    built: { pt: 'O sistema gere a descarga e a preparação de encomendas, calcula tempos de viagem e usa uma árvore k-d para localizar estações. A rede é modelada como um grafo para analisar centralidade, fluxo máximo e ligações entre estações. O projeto inclui uma base de dados Oracle e um módulo de controlo de estação em C e Assembly.', en: 'The system handles unloading and order picking, estimates travel times, and uses a k-d tree to locate stations. It models the railway as a graph to analyse centrality, maximum flow, and connections between stations. The project includes an Oracle database and a station control module in C and Assembly.' },
    contribution: {
      pt: 'Desenvolvi lógica de descarga e de preparação de encomendas e escrevi testes unitários para as operações de armazém. Também trabalhei no esquema e nas consultas da base de dados e no cálculo de tempos de viagem.',
      en: 'I developed unloading and order picking logic and wrote unit tests for warehouse operations. I also worked on the database schema and queries and on travel time calculations.',
    },
    commits: { authored: 81, total: 225 },
    results: null, working: null, planned: null,
    technologies: ['Java', 'Oracle PL/SQL', 'C', 'Assembly'],
    skills: [{ pt: 'Algoritmos de grafos', en: 'Graph algorithms' }, { pt: 'Estruturas de dados', en: 'Data structures' }],
    media: [], repository: null,
  },
  {
    id: 'aisafe', category: 'academic', astro: 'black-hole', status: null, semester: 4, team: true,
    title: { pt: 'AISafe', en: 'AISafe' },
    summary: { pt: 'Protótipo que valida planos de voo e simula aeronaves em paralelo para identificar violações de separação.', en: 'A prototype that validates flight plans and simulates aircraft in parallel to detect separation violations.' },
    objective: { pt: 'Apoiar a preparação e a validação de planos de voo, da gestão de aeronaves e espaço aéreo até ao relatório da simulação.', en: 'Support flight plan preparation and validation, from aircraft and airspace management through to simulation reporting.' },
    built: { pt: 'O back office Java gere aeronaves, companhias aéreas, aeroportos e áreas de controlo. Os planos podem ser importados numa linguagem própria analisada com ANTLR. O simulador em C executa um processo por voo, partilha o estado das aeronaves em memória e usa threads para detetar e registar violações de separação. Clientes TCP permitem acesso remoto e os eventos enviados por UDP alimentam um painel HTTP.', en: 'The Java back office manages aircraft, airlines, airports, and control areas. Flight plans can be imported in a custom language parsed with ANTLR. The C simulator runs one process per flight, shares aircraft state in memory, and uses threads to detect and report separation violations. TCP clients provide remote access and UDP events feed an HTTP dashboard.' },
    contribution: {
      pt: 'Implementei e testei regras de validação de planos de voo, adicionei a deteção de sobreposição entre áreas de controlo aéreo e contribuí para a implementação e os testes da simulação em C.',
      en: 'I implemented and tested flight plan validation rules, added overlap detection for air control areas, and contributed to the C simulation and its tests.',
    },
    commits: { authored: 100, total: 238 },
    results: null, working: null, planned: null,
    technologies: ['Java', 'C', 'ANTLR', 'TCP', 'UDP'],
    skills: [{ pt: 'Programação concorrente', en: 'Concurrent programming' }, { pt: 'Redes', en: 'Networking' }, { pt: 'Bases de dados relacionais', en: 'Relational databases' }, { pt: 'Simulação', en: 'Simulation' }],
    media: [], repository: null,
  },
  {
    id: 'laprizza', category: 'academic', planetSlot: 2, status: 'development', semester: 5, team: true,
    title: { pt: 'LaPrizza', en: 'LaPrizza' },
    summary: { pt: 'Sistema de gestão de uma pizzaria com catálogo, planeamento simulado de ingredientes e uma cozinha 3D configurável.', en: 'A pizzeria management system with a product catalogue, simulated ingredient planning, and a configurable 3D kitchen.' },
    objective: { pt: 'Apoiar a gestão do catálogo e do stock, estimar necessidades de reposição e visualizar a disposição dos equipamentos da cozinha.', en: 'Support catalogue and stock management, estimate replenishment needs, and visualise the kitchen equipment layout.' },
    built: {
      pt: 'A aplicação Angular e a API REST em Express, com PostgreSQL, permitem gerir contas por perfil, clientes, produtos, alergénios, stock e configurações de pizzas. O catálogo apresenta preços e disponibilidade calculados. Um módulo em Prolog simula o consumo de ingredientes e a reposição a partir de cenários de procura. O visualizador Three.js carrega a configuração ativa da cozinha e permite explorar o espaço e inspecionar equipamentos.',
      en: 'The Angular app and Express REST API, backed by PostgreSQL, support role-based account management, customers, products, allergens, stock, and pizza configurations. The catalogue displays calculated prices and availability. A Prolog module simulates ingredient consumption and replenishment from demand scenarios. The Three.js viewer loads the active kitchen configuration and lets users explore the space and inspect equipment.',
    },
    contribution: {
      pt: 'Implementei a ativação de contas por e-mail e a gestão de contas com registo de auditoria. Integrei o visualizador Three.js na aplicação Angular e desenvolvi a página e a API para gerir a configuração ativa da cozinha. Também implementei a captura de dados de stock e receitas para executar simulações de necessidades de ingredientes em Prolog.',
      en: 'I implemented email account activation and account management with audit logging. I integrated the Three.js viewer into Angular and developed the page and API for managing the active kitchen configuration. I also implemented stock and recipe data capture for ingredient requirements simulations in Prolog.',
    },
    commits: { authored: 153, total: 398 },
    results: null, working: null,
    planned: { pt: 'Agendamento da preparação de pedidos na cozinha.', en: 'Scheduling order preparation in the kitchen.' },
    technologies: ['JavaScript', 'TypeScript', 'Angular', 'Express', 'PostgreSQL', 'Three.js', 'SWI-Prolog'],
    skills: [{ pt: 'Desenvolvimento de APIs REST', en: 'REST API development' }, { pt: 'Controlo de acesso por perfil', en: 'Role-based access control' }, { pt: 'Integração de visualização 3D', en: '3D visualisation integration' }],
    media: [], repository: null,
  },
  {
    id: 'websites-for-local-restaurants', category: 'web', planetSlot: 3, status: 'development',
    title: { pt: 'Websites para Restaurantes Locais', en: 'Websites for Local Restaurants' },
    summary: { pt: 'Criação de websites para restaurantes locais.', en: 'Building websites for local restaurants.' },
    objective: { pt: 'Criar websites para restaurantes locais e desenvolver competências técnicas e de comunicação.', en: 'Build websites for local restaurants and develop technical and communication skills.' },
    built: null, contribution: null, results: null, working: null, planned: null,
    technologies: [], skills: [{ pt: 'Desenvolvimento web', en: 'Web development' }, { pt: 'Comunicação', en: 'Communication' }],
    media: [], repository: null,
  },
  {
    id: 'snake-ai-agent', category: 'ai', astro: 'quasar', status: 'development',
    title: { pt: 'Agente de IA para Snake', en: 'Snake AI Agent' },
    summary: { pt: 'Desenvolvimento de um agente de IA que aprende a jogar Snake.', en: 'Developing an AI agent that learns to play Snake.' },
    objective: { pt: 'Desenvolver um agente de IA que aprenda a jogar Snake.', en: 'Develop an AI agent that learns to play Snake.' },
    built: null, contribution: null, results: null, working: null,
    planned: { pt: 'Alargar o projeto e testar a abordagem noutros jogos e quebra-cabeças.', en: 'Extend the project and test the approach on other games and puzzles.' },
    technologies: [], skills: [], media: [], repository: null,
  },
];

const projectModels = assignProjectAstros(projects);

export function projectAstro(project) {
  return projectModels.get(project.id);
}

export function projectsIn(category) {
  return projects.filter((project) => project.category === category);
}

export function galaxyObjects(category) {
  const entries = projectsIn(category).map((project) => ({
    id: project.id,
    model: projectAstro(project),
    project,
  }));
  return completeGalaxy(category, entries);
}

export function featuredProjects() {
  return [...new Set(featuredProjectIds)]
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean)
    .slice(0, 3);
}
