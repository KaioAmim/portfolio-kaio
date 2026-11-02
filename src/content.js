// Dados extraídos do currículo fornecido por Kaio Amim.
export const profile = {
  name: 'Kaio Amim',
  role: 'Desenvolvedor de software',
  email: 'kaioamim.contato@gmail.com',
  github: 'https://github.com/KaioAmim',
  linkedin: 'https://www.linkedin.com/in/kaio-amim',
  instagram: 'https://www.instagram.com/kaioamim_',
  resumeUrl: '/curriculo-kaio-amim.pdf',
  location: 'Barretos, São Paulo',
};

export const timeline = [
  { period: 'Conclusão prevista · dez. 2028', title: 'Bacharelado em Sistemas de Informação', organization: 'UNIBARRETOS', description: 'Graduação em andamento, com formação em desenvolvimento, dados, gestão e infraestrutura de tecnologia.', type: 'education', current: true },
  { period: 'Jun. 2026 — atual', title: 'Técnico em Informática', organization: 'Poupatempo Barretos', description: 'Atendimento a usuários, diagnóstico de falhas e suporte a hardware, software, redes e chamados técnicos.', type: 'work', current: true },
  { period: 'Set. 2026', title: 'Formação GitHub Certification', organization: 'DIO', description: 'Formação concluída sobre Git, GitHub, colaboração, versionamento e boas práticas de repositório.', type: 'course' },
  { period: 'Ago. 2026', title: 'Agentes de IA em Campo', organization: 'DIO / AWS', description: 'Estudos de Amazon Bedrock, engenharia de prompts e criação de agentes de inteligência artificial.', type: 'course' },
  { period: 'Ago. 2026', title: 'Curso JavaScript Completo', organization: 'Danki Code', description: 'Formação prática em fundamentos, lógica, manipulação do DOM e desenvolvimento com JavaScript.', type: 'course' },
  { period: 'Out. 2025 — jun. 2026', title: 'Estagiário de TI', organization: 'Secretaria Municipal da Saúde de Barretos', description: 'Administração de usuários e permissões no Active Directory, configuração de redes, roteadores, impressoras e ambientes Linux.', type: 'work' },
  { period: 'Jul. 2025', title: 'Inglês para Programadores', organization: 'DANKI CODE', description: 'Inglês aplicado à leitura de documentação, termos técnicos e rotina de desenvolvimento.', type: 'course' },
  { period: 'Concluído · dez. 2024', title: 'Técnico em Desenvolvimento de Sistemas', organization: 'Etec Coronel Raphael Brandão', description: 'Formação técnica em programação, banco de dados, análise de sistemas e desenvolvimento web.', type: 'education' },
];

export const projects = [
  { id: 'unistock', cover: '/projects/covers/unistock.svg', title: 'UniStock', subtitle: 'Estoque, autenticação e integrações em um sistema completo.', category: 'Full stack', image: '/projects/unistock.webp', tags: ['PHP', 'MySQL', 'JavaScript'], url: 'https://controle-estoque-enpy.onrender.com/', github: 'https://github.com/KaioAmim/controle-estoque', description: 'Sistema de controle de estoque com cadastro de produtos, autenticação, sessões e integração com APIs externas.', details: ['CRUD completo para produtos e registros.', 'Autenticação de usuários e controle de sessões.', 'Persistência em banco relacional e integração com APIs.'] },
  { id: 'gastos', cover: '/projects/covers/gastos.svg', title: 'Gerenciamento de gastos', subtitle: 'Gastos, metas e visão mensal das finanças pessoais.', category: 'Front-end', image: '/projects/gastos.webp', tags: ['JavaScript', 'HTML', 'CSS'], url: 'https://kaioamim.github.io/gerenciamento-gastos/', github: 'https://github.com/KaioAmim/gerenciamento-gastos', description: 'Aplicação para registrar gastos, acompanhar metas e visualizar a organização financeira de cada mês.', details: ['Registro e organização de gastos pessoais.', 'Acompanhamento de metas financeiras.', 'Interface responsiva desenvolvida com JavaScript, HTML e CSS.'] },
  { id: 'doceria', cover: '/projects/covers/doceria.svg', title: 'Cantinho Doce da Dani', subtitle: 'E-commerce acadêmico com catálogo, carrinho e banco de dados.', category: 'Full stack', image: '/projects/doceria.webp', tags: ['PHP', 'MySQL', 'JavaScript'], url: 'https://website-doceria.vercel.app/', github: 'https://github.com/KaioAmim/website-doceria', description: 'E-commerce acadêmico com arquitetura cliente-servidor, catálogo de produtos, banco de dados relacional e operações CRUD.', details: ['Catálogo e experiência de compra para uma doceria.', 'Arquitetura cliente-servidor com banco relacional.', 'Cadastro, consulta, edição e exclusão de registros.'] },
  { id: 'pokedex', cover: '/projects/covers/pokedex.svg', title: 'Pokédex', subtitle: 'Consulta de Pokémon e detalhes integrados à PokéAPI.', category: 'Front-end', image: '/projects/pokedex.webp', tags: ['JavaScript', 'REST API', 'CSS'], url: 'https://kaioamim.github.io/curso-javascript/modulo-09/', github: 'https://github.com/KaioAmim/curso-javascript/tree/main/modulo-09', description: 'Aplicação que consome a PokéAPI para listar Pokémon e apresentar suas principais informações.', details: ['Consumo e tratamento de dados de uma API pública.', 'Listagem de Pokémon com imagens e nomes.', 'Interface dinâmica construída com JavaScript.'] },
];

export const skills = [
  { title: 'Desenvolvimento', items: ['JavaScript', 'PHP', 'React', 'Node.js', 'HTML & CSS'] },
  { title: 'Backend & dados', items: ['MySQL', 'SQL', 'APIs REST', 'CRUD', 'Autenticação'] },
  { title: 'Ferramentas & ambiente', items: ['Git & GitHub', 'Docker', 'Linux', 'Active Directory'] },
];

// Níveis estimados reproduzidos do portfólio anexado pelo titular.
export const skillLevels = [
  { name: 'JavaScript', level: 'Intermediário', stage: 2, detail: 'APIs, interações e lógica de aplicações web.' },
  { name: 'PHP', level: 'Intermediário', stage: 2, detail: 'CRUD, autenticação e sessões em projetos full stack.' },
  { name: 'HTML', level: 'Intermediário', stage: 2, detail: 'Estrutura de páginas em quatro projetos publicados.' },
  { name: 'CSS', level: 'Intermediário', stage: 2, detail: 'Estilização e layouts de aplicações web.' },
  { name: 'MySQL', level: 'Intermediário', stage: 2, detail: 'Modelagem relacional e persistência de dados.' },
  { name: 'Git', level: 'Intermediário', stage: 2, detail: 'Versionamento com branches, commits, merges e organização do histórico.' },
  { name: 'GitHub', level: 'Intermediário', stage: 2, detail: 'Pull requests, issues vinculadas, Projects, Pages, tags e proteção de branches.' },
  { name: 'React', level: 'Básico', stage: 1, detail: 'Componentes e interfaces; conhecimento em evolução.' },
  { name: 'Node.js', level: 'Básico', stage: 1, detail: 'Fundamentos de backend com JavaScript.' },
  { name: 'Docker', level: 'Básico', stage: 1, detail: 'Conhecimentos de ambientes e containers.' },
  { name: 'Linux', level: 'Intermediário', stage: 2, detail: 'Uso profissional em suporte e infraestrutura.' },
]
