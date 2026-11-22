export const profile = {
  firstNames: 'Gabriel Carneiro',
  lastName: 'Endres',
  institution: 'Instituto Superior de Engenharia do Porto (ISEP)',
  city: 'Porto',
  graduation: 2027,
  linkedin: 'https://www.linkedin.com/in/gabriel-endres-401a4b412/',
  github: 'https://github.com/GabrielEndres',
  pt: {
    degree: 'Licenciatura em Engenharia Informática',
    role: 'Finalista de Engenharia Informática',
    intro: 'Entusiasma-me a inteligência artificial e estou aberto a estágios curriculares em diferentes áreas. As bases que adquiri no ISEP, no Porto, permitem-me adaptar a novos contextos, aprender as tecnologias de que a equipa precisar e aprofundar conhecimentos na área do estágio.',
    experience: 'Java é a linguagem com que tenho mais experiência. Nos projetos académicos, trabalhei em equipa com Scrum.',
  },
  en: {
    degree: 'BSc in Informatics Engineering',
    role: 'Final-year Informatics Engineering student',
    intro: 'I’m enthusiastic about artificial intelligence and open to curricular internships across different fields. My studies at ISEP in Porto gave me the foundations to adapt to new settings, learn the technologies my team needs, and build expertise in the area where I intern.',
    experience: 'Java is the language I have the most experience with. I’ve worked in teams using Scrum on academic projects.',
  },
  skills: [
    ['programming', ['Java', 'JavaScript', 'C', 'Python', 'SQL', 'PL/SQL', { pt: 'Assembly (bases)', en: 'Assembly (basic)' }]],
    ['webDevelopment', ['HTML', 'CSS', 'Angular', 'HTTP', 'REST APIs']],
    ['software', [{ pt: 'Desenvolvimento de software', en: 'Software development' }, { pt: 'Programação concorrente', en: 'Concurrent programming' }, { pt: 'Processamento de imagem', en: 'Image processing' }, { pt: 'Simulação', en: 'Simulation' }]],
    ['dataNetworks', ['Oracle Database', 'TCP/IP (TCP, UDP)', { pt: 'Autenticação digital', en: 'Digital authentication' }]],
    ['collaboration', ['Git', 'GitHub', 'JUnit', 'ANTLR', 'Scrum', { pt: 'Gestão de equipa', en: 'Team management' }]],
  ],
};

export const fullName = `${profile.firstNames} ${profile.lastName}`;
