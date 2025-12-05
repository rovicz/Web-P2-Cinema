# 🎬 Cinemarket - Sistema de Gestão de Cinema

Sistema web desenvolvido para o gerenciamento de operações diárias da rede de cinemas "Cinemarket". Este projeto compõe o módulo administrativo do sistema, permitindo o cadastro de filmes, salas, agendamento de sessões e simulação de venda de ingressos.

O projeto foi desenvolvido como atividade prática da disciplina de **Desenvolvimento Web Frontend**.

## 🚀 Tecnologias Utilizadas

O projeto utiliza a stack moderna exigida na especificação, com a adição de bibliotecas de UI para melhor experiência do usuário:

- **Core:** React + Vite (Template TypeScript)
- **Roteamento:** React Router DOM
- **Estilização:** Bootstrap 5 (Grid System & Componentes)
- **Ícones:** Lucide React (Substituindo/Complementando Bootstrap Icons)
- **Validação:** Zod (Schemas e validação de formulários)
- **Feedback Visual:** Sonner (Toasts/Notificações)
- **Backend Simulado:** Json-Server (API REST)

## 📋 Funcionalidades

Conforme os requisitos funcionais, o sistema oferece:

### 1. Gestão de Filmes (`/filmes`)

- Listagem de todos os filmes cadastrados.
- Cadastro de novos filmes com validação rigorosa (Título, Sinopse > 10 chars, Duração > 0, etc.).
- Exclusão de filmes.

### 2. Gestão de Salas (`/salas`)

- Cadastro de salas com número e capacidade máxima.
- Visualização da capacidade disponível.

### 3. Agendamento de Sessões (`/sessoes`)

- Vinculação entre **Filmes** e **Salas** existentes.
- Validação de datas (não permite agendamento retroativo).
- Visualização detalhada das sessões agendadas.

### 4. Venda de Ingressos

- Funcionalidade integrada à listagem de sessões.
- Simulação de venda (Inteira/Meia) com cálculo de valor.

## 📦 Instalação e Execução

Pré-requisitos: Certifique-se de ter o **Node.js** instalado em sua máquina.

### 1. Clone o repositório e instale as dependências, após isso rode o projeto

```bash
git clone <seu-repositorio-url>
cd Cinemarket
npm install
npx json-server --watch db.json --port 3000
npm run dev
```
