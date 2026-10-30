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
  { period: 'Conclusão prevista · dez. 2028', title: 'Bacharelado em Sistemas de Informação', organization: 'UNIBARRETOS', description: 'Formação superior em andamento, em Barretos, São Paulo.', type: 'education', current: true },
  { period: 'Jun. 2026 — atual', title: 'Técnico em Informática', organization: 'Poupatempo Barretos', description: 'Suporte a usuários, diagnóstico e resolução de problemas de hardware, software e redes, com atendimento de chamados.', type: 'work', current: true },
  { period: 'Set. 2026', title: 'Formação GitHub Certification', organization: 'DIO', description: 'Bootcamp concluído na DIO. Certificado de conclusão da Formação GitHub Certification.', type: 'course' },
  { period: 'Ago. 2026', title: 'Agentes de IA em Campo', organization: 'DIO / AWS', description: 'Amazon Bedrock e engenharia de prompts aplicados a agentes de inteligência artificial.', type: 'course' },
  { period: 'Ago. 2026', title: 'Curso JavaScript Completo', organization: 'Danki Code', description: 'Curso concluído, conforme certificado emitido pela Danki Code.', type: 'course' },
  { period: 'Out. 2025 — jun. 2026', title: 'Estagiário de TI', organization: 'Secretaria Municipal da Saúde de Barretos', description: 'Administração de usuários e permissões no Active Directory, configuração de redes, roteadores e impressoras, e trabalho com ambientes Linux.', type: 'work' },
  { period: 'Jul. 2025', title: 'Inglês para Programadores', organization: 'DANKI CODE', description: 'Curso de inglês com foco no contexto de programação e tecnologia.', type: 'course' },
  { period: 'Concluído · dez. 2024', title: 'Técnico em Desenvolvimento de Sistemas', organization: 'Etec Coronel Raphael Brandão', description: 'Formação técnica em desenvolvimento de sistemas.', type: 'education' },
];

export const projects = [
  { id: 'unistock', cover: '/projects/covers/unistock.svg', title: 'UniStock', subtitle: 'Controle de estoque com autenticação e APIs.', category: 'Full stack', image: '/projects/unistock.webp', tags: ['PHP', 'MySQL', 'JavaScript'], url: 'https://controle-estoque-enpy.onrender.com/', github: 'https://github.com/KaioAmim/controle-estoque', description: 'Sistema de controle de estoque com CRUD completo, autenticação, controle de sessões e integração com APIs externas.', details: ['Cadastro, consulta, atualização e exclusão de registros.', 'Autenticação de usuários e controle de sessões.', 'Banco de dados relacional e integração com APIs.'] },
  { id: 'gastos', cover: '/projects/covers/gastos.svg', title: 'Gerenciamento de gastos', subtitle: 'Controle mensal de gastos e metas financeiras.', category: 'Front-end', image: '/projects/gastos.webp', tags: ['JavaScript', 'HTML', 'CSS'], url: 'https://kaioamim.github.io/gerenciamento-gastos/', github: 'https://github.com/KaioAmim/gerenciamento-gastos', description: 'Aplicação para controle de gastos pessoais e acompanhamento de metas financeiras.', details: ['Organização de gastos pessoais.', 'Acompanhamento de metas financeiras.', 'Interface web desenvolvida com JavaScript, HTML e CSS.'] },
  { id: 'doceria', cover: '/projects/covers/doceria.svg', title: 'Cantinho Doce da Dani', subtitle: 'E-commerce acadêmico com catálogo e carrinho.', category: 'Full stack', image: '/projects/doceria.webp', tags: ['PHP', 'MySQL', 'JavaScript'], url: 'https://website-doceria.vercel.app/', github: 'https://github.com/KaioAmim/website-doceria', description: 'Projeto acadêmico de e-commerce, com arquitetura cliente-servidor, modelagem de banco de dados relacional e CRUD completo.', details: ['E-commerce desenvolvido como projeto acadêmico.', 'Arquitetura cliente-servidor e banco de dados relacional.', 'Operações completas de cadastro, consulta, edição e exclusão.'] },
  { id: 'pokedex', cover: '/projects/covers/pokedex.svg', title: 'Pokédex', subtitle: 'Pokémon e suas informações, via API pública.', category: 'Front-end', image: '/projects/pokedex.webp', tags: ['JavaScript', 'REST API', 'CSS'], url: 'https://kaioamim.github.io/curso-javascript/modulo-09/', github: 'https://github.com/KaioAmim/curso-javascript/tree/main/modulo-09', description: 'Aplicação que consome uma API pública para listar e exibir informações de Pokémon.', details: ['Consumo de uma API pública.', 'Listagem de Pokémon com imagens e nomes.', 'Manipulação da interface com JavaScript.'] },
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
  { name: 'Git', level: 'Intermediário', stage: 2, detail: 'Versionamento de projetos no GitHub.' },
  { name: 'React', level: 'Básico', stage: 1, detail: 'Componentes e interfaces; conhecimento em evolução.' },
  { name: 'Node.js', level: 'Básico', stage: 1, detail: 'Fundamentos de backend com JavaScript.' },
  { name: 'Docker', level: 'Básico', stage: 1, detail: 'Conhecimentos de ambientes e containers.' },
  { name: 'Linux', level: 'Intermediário', stage: 2, detail: 'Uso profissional em suporte e infraestrutura.' },
]
