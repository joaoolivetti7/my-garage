# 🚗 MyGarage - Gestão Inteligente de Veículos

![Project Status](https://img.shields.io/badge/status-active-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

**MyGarage** é um sistema Full Stack desenvolvido para a gestão completa de manutenção veicular. O projeto nasceu da necessidade real de monitorar motores de alta exigência (como a linha **THP**), onde o histórico de manutenção é crucial para a valorização do ativo.

Diferente de planilhas comuns, o MyGarage oferece inteligência de dados, cálculo de depreciação em tempo real e ferramentas para facilitar a revenda.

---

## ✨ Funcionalidades Principais

### 🧠 Monitoramento Inteligente (THP Logic)

- **Algoritmo de Saúde:** Analisa o intervalo de trocas de óleo específicas.
- **Alertas Preditivos:** Avisa visualmente (Verde/Amarelo/Vermelho) o status do motor baseando-se na quilometragem da última preventiva, ignorando manutenções corretivas ou estéticas.

### 💰 Inteligência Financeira & FIPE

- **Integração BrasilAPI:** Consulta automática do valor de mercado (Tabela FIPE) baseada no ano/modelo do carro.
- **ROI de Manutenção:** Gráficos e cards que comparam o _Valor Investido_ vs _Valor de Mercado_, permitindo decisões baseadas em dados (ex: hora certa de vender).

### 🤝 Dossiê de Venda (Shareable Link)

- **Link Público:** Gera uma página de "Laudo Digital" para enviar a compradores.
- **Privacidade:** Exibe todo o histórico de zelo e peças trocadas, mas **oculta os valores financeiros**, servindo como argumento de valorização sem abrir margem para negociação de preço.

### 📄 Relatórios Oficiais

- **Exportação PDF:** Geração de documento formal com histórico zebrado e cabeçalho, pronto para impressão.

---

## 🚀 Tecnologias Utilizadas

O projeto utiliza o que há de mais moderno no ecossistema React/Next.js:

- **Core:** [Next.js 14](https://nextjs.org/) (App Router & Server Actions).
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/).
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (via Docker).
- **ORM:** [Prisma](https://www.prisma.io/) (com Tipagem Segura).
- **Gráficos:** [Recharts](https://recharts.org/).
- **PDF:** [jsPDF](https://github.com/parallax/jsPDF).

---

## 🛠️ Como rodar localmente

Este projeto utiliza **Docker** para garantir que o ambiente seja replicável em qualquer máquina.

### Pré-requisitos

- Node.js 18+
- Docker & Docker Compose

### Passo a Passo

1. **Clone o repositório**

   ```bash
   git clone [https://github.com/SEU_USUARIO/my-garage-nextjs.git](https://github.com/SEU_USUARIO/my-garage-nextjs.git)
   cd my-garage-nextjs
   ```

2. **Suba o Banco de Dados**
   docker-compose up -d

3. **Configure as Variáveis de Ambiente**
   DATABASE_URL="postgresql://admin:turbo_thp@localhost:5432/mygarage?schema=public"

4. **Instale as dependências e Configure o Banco**
   npm install
   npx prisma migrate dev --name init

5. **Rode a aplicação**
   npm run dev

### 📂 Estrutura do Projeto

/actions.ts # Server Actions (Lógica de Backend)
/share/[id] # Rota pública dinâmica (Dossiê)
page.tsx # Dashboard Principal
/components # Componentes React (Client Components)
/lib
prisma.ts # Singleton de conexão segura (Pool)
fipe.ts # Integração com API externa
/prisma
schema.prisma # Modelagem do Banco de Dados

🤝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

Desenvolvido com 💙 e muito café por [Seu Nome] - Londrina/PR.
