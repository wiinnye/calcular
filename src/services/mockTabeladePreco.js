const tabelaDePreco = [
  
  {
    "servico": "Acesso à Internet",
    "preco_reais": 6.00,
    "value": "Internet"
  },
  {
    "servico": "Impressão P&B - Internet (por folha)",
    "preco_reais": 1.00,
    "value": "Impressão P&B internet"
  },
  {
    "servico": "Impressão Colorida - 1ª Primeira Folha",
    "preco_reais": 8.00,
    "value": "Impressão Colorida"
  },
  {
    "servico": "Impressão Colorida - Internet (por folha)",
    "preco_reais": 2.00,
    "value": "Impressão Colorida internet"
  },
  {
    "servico": "Impressão P&B - Pen Drive (por folha)",
    "preco_reais": 2.00,
    "value": "Impressão P&B pendrive"
  },
  {
    "servico": "Impressão Colorida - Pen Drive (por folha)",
    "preco_reais": 3.00,
    "value": "Impressão Colorida pendrive"
  },
  {
    "servico": "Cópia simples P&B (até 50 folhas)",
    "preco_reais": 1.00,
    "value": "Cópia P&B"
  },
  {
    "servico": "Cópia simples P&B (acima de 50 folhas)",
    "preco_reais": 0.85,
    "value": "Cópia P&B desconto"
  },
  {
    "servico": "Cópia simples Colorida (LIVRO)",
    "preco_reais": 2.00,
    "value": "Cópia Livro Colorida"
  },
  {
    "servico": "Cópia simples P&B (LIVRO)",
    "preco_reais": 1.00,
    "value": "Cópia Livro P&B"
  },
  {
    "servico": "Cópia simples Colorida - Imagem Pequena/Média",
    "preco_reais": 3.00,
    "value": "Cópia Colorida Imagem PQ"
  },
  {
    "servico": "Cópia simples Colorida - Imagem Grande (Folha A4 Completa)",
    "preco_reais": 4.00,
    "value": "Cópia Colorida A4"
  },
  {
    "servico": "Encadernação (até 100 folhas)",
    "preco_reais": 18.00,
    "value": "Encadernação"
  },
  {
    "servico": "Encadernação (a cada 99 folhas adicionais)",
    "preco_reais": 8.00,
    "value": "Encadernação adicao"
  },
  {
    "servico": "Adesivo - Imagem Pequena/Média",
    "preco_reais": 12.00,
    "value": "Adesivo PQ"
  },
  {
    "servico": "Adesivo - Imagem Grande (Folha A4 Completa)",
    "preco_reais": 16.00,
    "value": "Adesivo A4"
  },
  {
    "servico": "Certificado (Colorido ou PB)",
    "preco_reais": 12.00,
    "value": "Certificado"
  },
  {
    "servico": "Cadastro - (Site) - A partir",
    "preco_reais": 25.00,
    "value": "Cadastro Site"
  },
  {
    "servico": "Cadastro/criar - (e-mail) A partir",
    "preco_reais": 10.00,
    "value": "Cadastro E-mail"
  },
  {
    "servico": "Licenciamento - Documento Carro",
    "preco_reais": 12.00,
    "value": "Licenciamento"
  },
  {
    "servico": "Digitalização (Escaneamento) - Por folha",
    "preco_reais": 4.00,
    "value": "Digitalização"
  },
  {
    "servico": "Plastificação - Pq (RG, CPF, Título do Eleitor)",
    "preco_reais": 8.00,
    "value": "Plastificação PQ"
  },
  {
    "servico": "Plastificação - Md (Folhas tamanho a5)",
    "preco_reais": 15.00,
    "value": "Plastificação MD"
  },
  {
    "servico": "Plastificação - Gd (Folhas tamanho a4, Ofício, Carta)",
    "preco_reais": 18.00,
    "value": "Plastificação A4"
  },
  {
    "servico": "Antecedentes Criminais - Por consulta",
    "preco_reais": 12.00,
    "value": "Antecedentes"
  },
  {
    "servico": "Curriculo - 1ª via",
    "preco_reais": 10.00,
    "value": "Curriculo 1"
  },
  {
    "servico": "Curriculo - 2ª via",
    "preco_reais": 6.00,
    "value": "Curriculo 2"
  },
  {
    "servico": "Digitação (Trabalhos e Contratos) - Por folha",
    "preco_reais": 12.00,
    "value": "Digitação contrato"
  },
  {
    "servico": "Digitação (Demais assuntos) - Por folha",
    "preco_reais": 10.00,
    "value": "Digitação"
  },
  {
    "servico": "Foto - Imagem Pequena - por imagem",
    "preco_reais": 8.00,
    "value": "Foto Imagem PQ"
  },
  {
    "servico": "Foto - Imagem Média (1/2 da folha a4) - por imagem",
    "preco_reais": 12.00,
    "value": "Foto Imagem MD"
  },
  {
    "servico": "Foto - Imagem Grande (Folha A4 completa) - por imagem",
    "preco_reais": 18.00,
    "value": "Foto Imagem A4"
  },
  {
    "servico": "Foto - 3x4 (2 unidades)",
    "preco_reais": 12.00,
    "value": "Foto 3x4 2"
  },
  {
    "servico": "Foto - 3x4 (4 unidades)",
    "preco_reais": 16.00,
    "value": "Foto 3x4 4"
  },
  {
    "servico": "Foto - 3x4 (6 unidades)",
    "preco_reais": 20.00,
    "value": "Foto 3x4 6"
  },
  {
    "servico": "Foto - 3x4 (10 unidades)",
    "preco_reais": 22.00,
    "value": "Foto 3x4 10"
  },
  {
    "servico": "Foto Passaporte",
    "preco_reais": 16.00,
    "value": "Foto Passaporte"
  },
  {
    "servico": "Foto Passaporte (as demais sai)",
    "preco_reais": 6.00,
    "value": "Foto Passaporte +1"
  },
  {
    "servico": "Cópia de CD/DVD - A Partir de",
    "preco_reais": 12.00,
    "value": "Cópia CD/DVD"
  },
  {
    "servico": "Cópia de Pen-Drive (a cada 100 Mega)",
    "preco_reais": 5.00,
    "value": "Cópia Pen-Drive"
  }
]


export default tabelaDePreco;