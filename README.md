# Projeto 02 — Catálogo de Filmes com Avaliações Pessoais

Aplicação web desenvolvida no âmbito do CTeSP de TPSI, na unidade curricular de Programação Web do IPVC. A aplicação permite ao utilizador registar filmes que viu ou quer ver, adicionar avaliações, comentários e consultar o seu histórico com filtros personalizados.

## Stack

O projeto foi desenvolvido utilizando uma arquitetura com separação total entre o Backend e o Frontend via API REST:

- **Backend:** Node.js + Express;
- **Frontend:** React (Vite);
- **Autenticação:** JSON Web Tokens (JWT);
- **Base de Dados:** MongoDB;
- **Controlo de Versão:** Git + GitHub.

---

## Funcionalidades Implementadas

### Backend (API REST)
- **Autenticação Segura:** Registo e login de utilizadores com geração e validação de tokens JWT.
- **Proteção de Rotas:** Apenas utilizadores autenticados podem gerir os seus filmes.
- **CRUD de Filmes:** Criação, leitura, atualização e eliminação de filmes com título, género, ano, sinopse e URL do poster.
- **Sistema de Avaliações:** Atribuição de 1 a 5 estrelas e comentários textuais por filme.
- **Filtros e Listagem:** Endpoints configurados para filtrar por género e estado (visto/por ver).
- **Métricas e Estatísticas:** Endpoint dedicado para calcular a média de avaliações por género.
- **Validação de Dados:** Tratamento de erros rigoroso com respostas e mensagens claras da API.

### Frontend (React)
- **Autenticação:** Páginas de login e registo integradas com validação de campos e redirecionamento de rotas protegidas.
- **Catálogo Interativo:** Listagem dinâmica dos filmes com componentes de filtros por género, ano e estado.
- **Formulários Dinâmicos:** Criação e edição de filmes com feedback em tempo real.
- **Avaliação por Estrelas:** Componente visual e intuitivo para classificação de 1 a 5 estrelas.
- **Página de Detalhes:** Visualização completa do filme, sinopse, classificação e comentário pessoal associado.
- **Dashboard de Estatísticas:** Exibição da média geral das avaliações e do género de filme favorito do utilizador.
- **Design Responsivo:** Interface fluida adaptada a diferentes tamanhos de ecrã com tratamento de mensagens de erro da API.

---

## Como Instalar e Executar Localmente

### Pré-requisitos
Antes de começar, certifique-se de que tem instalado na sua máquina:
- [Node.js](https://nodejs.org/)
- Instância ativa e configurada do MongoDB

### 1. Clonar o Repositório
```bash
git clone https://github.com/Lxrentz/PW-TrabalhoPratico
cd PW-TrabalhoPratico
```

### 2. Configurar o Backend
No seu terminal, aceda à diretoria do backend (ex: `/backend`):
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Configurar o Frontend
Num terminal paralelo, aceda à diretoria do frontend (ex: `/frontend`):
```bash
cd frontend
npm install
npm run dev
```

---

## Variáveis de Ambiente (`.env.example`)

Certifique-se de preencher e ajustar os ficheiros de configuração locais de acordo com os seguintes parâmetros:

**No Backend (`backend/.env`):**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/Nome-Base-de-Dados
JWT_SECRET=chave_secreta_para_jwt
JWT_EXPIRES_IN=1d
```