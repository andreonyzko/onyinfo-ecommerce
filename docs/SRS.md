# Especificação de Requisitos de Software (SRS)

## 1. Introdução

### 1.1 Propósito
Este documento define os requisitos funcionais, não funcionais e arquiteturais da plataforma **OnyInfo**, um e-commerce estático especializado em peças de hardware. O projeto é a entrega final do Desafio 1 do Bootcamp.

### 1.2 Escopo do Projeto
O sistema consiste em uma vitrine virtual focada no conceito de *headless commerce* em miniatura. A aplicação é 100% *data-driven*: o front-end é totalmente desacoplado e reage a dois arquivos estáticos principais (`products.json` para os dados e `categories.json` para os metadados), consumidos através da API `fetch` nativa. A aplicação não possui um servidor back-end em tempo de execução.

---

## 2. Descrição Geral

### 2.1 Perspectiva do Produto
A OnyInfo é uma Single Page Application (SPA) que utiliza carregamento de dados antecipado (via rotas). As sessões de usuário, o estado do carrinho e o fluxo de compra são gerenciados e persistidos localmente (client-side) para simular uma experiência de usuário autenticado sem ferir a restrição de ser um site estático.

### 2.2 Stack Tecnológica
*   **Core:** React, TypeScript, Vite.
*   **Roteamento:** React Router DOM v6+ (Data Mode com Loaders).
*   **Estilização e UI:** Tailwind CSS, Shadcn/UI, Lucide Icons.
*   **Gerenciamento de Estado:** Zustand (com middleware `persist`).
*   **Formulários e Validação:** React Hook Form e Zod.
*   **Integrações Externas:** API ViaCEP.

---

## 3. Requisitos Funcionais (RF)

### 3.1 Arquitetura Data-Driven e Catálogo
*   **RF01 - Catálogo Headless:** O sistema deve carregar os dados através de arquivos isolados (`products.json` com no mínimo 6 produtos e `categories.json` com as especificações da loja) utilizando a API `fetch`. É estritamente proibido o uso de produtos ou menus fixos (hardcoded) no HTML.
*   **RF02 - Interface e NavBar Dinâmicas:** O Header deve renderizar a NavBar mapeando automaticamente as categorias retornadas pelo arquivo de metadados (`categories.json`), criando os links de navegação sem intervenção manual no código React.
*   **RF03 - Roteamento Centralizado:** O sistema deve utilizar uma rota dinâmica única (ex: `/categoria/:slug`) que carrega os produtos correspondentes antes de renderizar a página.
*   **RF04 - Filtros Inteligentes:** A página de categoria deve exibir filtros dinâmicos na Sidebar. O sistema lerá as especificações dos produtos e renderizará componentes diferentes com base no tipo de dado (Checkboxes para *Strings*, Range Inputs para *Numbers*).
*   **RF05 - Vitrines da Home Page:** A página inicial deve exibir os produtos agrupados por categorias, limitados a 5 itens por vitrine, contendo um botão "Ver mais".
*   **RF06 - Página de Detalhes do Produto (PDP):** Cada item deve ter uma exibição detalhada com imagem, título, preço, descrição, tabela de especificações (`specs`) e botões de compra.

### 3.2 Carrinho e Fluxo de Checkout Avançado
*   **RF07 - Carrinho de Compras:** O sistema deve listar os produtos selecionados, permitir a alteração de quantidades, remover itens e exibir o subtotal dinamicamente.
*   **RF08 - Etapa de Identificação e Validação:** O fluxo de checkout deve coletar Nome, E-mail, Telefone e CPF. O sistema aplicará máscaras automáticas via Regex para CPF e Telefone, e validará a integridade dos dados utilizando o Zod.
*   **RF09 - Autocomplete de Endereço (ViaCEP):** Ao preencher o CEP, o sistema deve consumir a API ViaCEP em segundo plano e autopreencher os campos de Rua, Bairro, Cidade e Estado.
*   **RF10 - Pagamento e Revisão Fictícia:** O usuário deve poder selecionar fretes simulados e métodos de pagamento. O sistema encerrará com uma tela de revisão do pedido completo.

### 3.3 Defesa Técnica Obrigatória
*   **RF11 - Rota de Avaliação:** A plataforma deve possuir a rota estática `/como-fiz`, dedicada a hospedar o vídeo explicativo (de 5 a 8 minutos) sobre o código, a arquitetura *headless* e a análise de performance do site.

---

## 4. Requisitos Não Funcionais (RNF)

*   **RNF01 - Hospedagem Estática e Gratuita:** A aplicação deve ser compilada e hospedada publicamente (ex: GitHub Pages) sem custos, permanecendo operante através de uma URL pública acessível.
*   **RNF02 - Persistência Inteligente (Local Storage):** O estado do carrinho, a escolha do tema (Light/Dark Mode) e os dados validados de identificação e endereço do cliente devem ser salvos localmente. Em compras futuras, o formulário deve ser pré-populado.
*   **RNF03 - Excelência em Performance:** A utilização de Data Loaders e o descarte de requisições desnecessárias visam atingir pontuações máximas nas auditorias ao vivo realizadas com o Google Lighthouse.
*   **RNF04 - Responsividade Absoluta:** Componentes construídos com Shadcn/UI e Tailwind devem se adaptar perfeitamente a dispositivos *mobile* e *desktop*.

---

## 5. Regras de Negócio (RN)
*   **RN01 - Desconto no PIX:** A seleção do método de pagamento "PIX" aplica automaticamente 5% de desconto no valor final do resumo do pedido.
*   **RN02 - Operação *Read-Only*:** Como os JSONs são estáticos para respeitar a arquitetura exigida, finalizar um pedido não deduz estoque real dos produtos, tratando-se de uma simulação visual.