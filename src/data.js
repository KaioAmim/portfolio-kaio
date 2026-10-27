// Dados profissionais fornecidos por Kaio e pelo currículo enviado.
export const profile = {
  name: 'Kaio Amim',
  photo: '',
  careerPlan: 'Busco uma oportunidade como Desenvolvedor Júnior, com foco em Backend e Web, para contribuir com soluções reais e evoluir tecnicamente em um ambiente profissional.',
  experiences: [
    { company: 'Poupatempo Barretos', role: 'Técnico em Informática', period: 'Jun/2026 — atual', description: 'Suporte a usuários, diagnóstico e resolução de problemas de hardware, software e redes, com atendimento de chamados sob demanda.' },
    { company: 'Secretaria Municipal da Saúde de Barretos', role: 'Estagiário de T.I.', period: 'Out/2025 — Jun/2026', description: 'Administração de usuários e permissões no Active Directory, configuração de redes, roteadores e impressoras e uso de máquinas em ambiente Linux.' },
  ],
  academic: [
    { title: 'Sistemas de Informação', subtitle: 'Unibarretos · Bacharelado', period: '2024 — Dez/2028', description: 'Graduação em andamento.' },
    { title: 'Téc. Desenvolvimento de Sistemas', subtitle: 'Etec Coronel Raphael Brandão', period: 'Concluído em Dez/2024', description: '' },
  ],
  extracurricular: [
    { title: 'Formação GitHub Certification', subtitle: 'DIO', period: '12/09/2026', description: 'Bootcamp concluído na DIO. Certificado de conclusão da Formação GitHub Certification.' },
    { title: 'Agentes de IA em Campo', subtitle: 'DIO / AWS', period: 'Ago/2026', description: 'Amazon Bedrock e engenharia de prompts.' },
    { title: 'Inglês para Programadores', subtitle: 'Danki Code', period: 'Jul/2025', description: '' },
  ],
  role: 'Desenvolvedor Backend & Web',
  email: 'kaioamim.contato@gmail.com',
  location: 'Barretos, SP · Brasil',
  availability: 'Aberto a oportunidades',
  about: 'Sou desenvolvedor de software em formação, com experiência em suporte e infraestrutura de TI. Trabalho com PHP, JavaScript, Node.js, React e MySQL para construir aplicações com autenticação, APIs e bancos de dados. Gosto de transformar problemas reais em soluções simples de usar.',
  social: {
    github: 'https://github.com/kaioamim',
    linkedin: 'https://www.linkedin.com/in/kaio-amim/',
    instagram: 'https://www.instagram.com/kaioamim_',
  },
}

export const projects = [
  { number: '01', title: 'UniStock', category: 'Controle de estoque', description: 'Sistema com CRUD completo, autenticação, controle de sessões e integração com APIs externas.', tags: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'], liveUrl: 'https://controle-estoque-enpy.onrender.com/' },
  { number: '02', title: 'Pokédex', category: 'Consumo de API', description: 'Aplicação que consome uma API pública para listar e apresentar informações de Pokémon.', tags: ['JavaScript', 'HTML', 'CSS'], liveUrl: 'https://kaioamim.github.io/curso-javascript/modulo-09/' },
  { number: '03', title: 'Doceria', category: 'E-commerce acadêmico', description: 'Projeto full stack de e-commerce com arquitetura cliente-servidor, banco de dados relacional e CRUD completo.', tags: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'], liveUrl: 'https://website-doceria.vercel.app/' },
  { number: '04', title: 'Gerenciamento de Gastos', category: 'Finanças pessoais', description: 'Aplicação para controlar gastos pessoais e acompanhar metas financeiras.', tags: ['JavaScript', 'HTML', 'CSS'], liveUrl: 'https://kaioamim.github.io/gerenciamento-gastos/' },
]

export const services = [
  {
    number: '01',
    title: 'Direção & estratégia',
    text: 'Definição do problema, arquitetura da experiência e uma direção visual que torna o produto reconhecível.',
  },
  {
    number: '02',
    title: 'Design de interface',
    text: 'Interfaces responsivas, acessíveis e consistentes — do primeiro wireframe ao design system.',
  },
  {
    number: '03',
    title: 'Desenvolvimento',
    text: 'Implementação front-end com código organizado, animações intencionais e atenção real à performance.',
  },
]

export const stack = ['PHP', 'JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'MySQL', 'Git', 'Docker', 'Linux']

// Estimativas baseadas no currículo e nos projetos; revisar com o titular.
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
