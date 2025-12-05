# 🎬 CineWeb - Sistema de Gestão de Cinema

Sistema web desenvolvido para o gerenciamento de operações diárias da rede de cinemas "CineWeb". [cite_start]Este projeto compõe o módulo administrativo do sistema, permitindo o cadastro de filmes, salas, agendamento de sessões e simulação de venda de ingressos[cite: 1, 6, 7].

[cite_start]O projeto foi desenvolvido como atividade prática da disciplina de **Desenvolvimento Web Frontend**[cite: 2].

## 🚀 Tecnologias Utilizadas

O projeto utiliza a stack moderna exigida na especificação, com a adição de bibliotecas de UI para melhor experiência do usuário:

- [cite_start]**Core:** React + Vite (Template TypeScript) [cite: 53]
- [cite_start]**Roteamento:** React Router DOM [cite: 53]
- [cite_start]**Estilização:** Bootstrap 5 (Grid System & Componentes) [cite: 53, 92]
- **Ícones:** Lucide React (Substituindo/Complementando Bootstrap Icons)
- [cite_start]**Validação:** Zod (Schemas e validação de formulários) [cite: 54, 80]
- **Feedback Visual:** Sonner (Toasts/Notificações)
- [cite_start]**Backend Simulado:** Json-Server (API REST) [cite: 54]

## 📋 Funcionalidades

[cite_start]Conforme os requisitos funcionais[cite: 63], o sistema oferece:

### [cite_start]1. Gestão de Filmes (`/filmes`) [cite: 65]

- Listagem de todos os filmes cadastrados.
- [cite_start]Cadastro de novos filmes com validação rigorosa (Título, Sinopse > 10 chars, Duração > 0, etc.) [cite: 81-86].
- Exclusão de filmes.

### [cite_start]2. Gestão de Salas (`/salas`) [cite: 69]

- [cite_start]Cadastro de salas com número e capacidade máxima[cite: 70].
- Visualização da capacidade disponível.

### [cite_start]3. Agendamento de Sessões (`/sessoes`) [cite: 71]

- [cite_start]Vinculação entre **Filmes** e **Salas** existentes[cite: 73, 74, 76].
- [cite_start]Validação de datas (não permite agendamento retroativo)[cite: 90].
- Visualização detalhada das sessões agendadas.

### [cite_start]4. Venda de Ingressos [cite: 95]

- Funcionalidade integrada à listagem de sessões.
- [cite_start]Simulação de venda (Inteira/Meia) com cálculo de valor[cite: 98].

## 📦 Instalação e Execução

Pré-requisitos: Certifique-se de ter o **Node.js** instalado em sua máquina.

### 1. Clone o repositório e instale as dependências

```bash
git clone <seu-repositorio-url>
cd cineweb
npm install
```
