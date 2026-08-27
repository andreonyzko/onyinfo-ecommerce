# Documento de Arquitetura de Software (SAD)

## 1. Introdução

### 1.1 Propósito
Este documento fornece uma visão arquitetural abrangente da plataforma OnyInfo. O objetivo é detalhar as decisões de design, a stack tecnológica, o fluxo de dados e a infraestrutura de implantação, garantindo o alinhamento com os requisitos técnicos de entrega do desafio, especificamente a implementação de um conceito de *headless commerce* em miniatura.

### 1.2 Restrições e Premissas
* A aplicação deve ser obrigatoriamente um site estático, hospedado publicamente e de forma gratuita.
* O sistema não possuirá um servidor back-end de aplicação em tempo de execução; todas as lógicas de negócio e estado (carrinho, usuário, validações) devem ser processadas no *client-side*.
* O catálogo de produtos não pode ser inserido de forma fixa (hardcoded) no HTML.

---

## 2. Visão Arquitetural

A arquitetura da OnyInfo segue o padrão **Single Page Application (SPA)** focada em processamento avançado no navegador do usuário. A aplicação é estritamente *Data-Driven*, simulando a separação entre front-end e back-end típica de arquiteturas *composable* e *headless*.

### 2.1 Arquitetura Headless e Orientada a Metadados
A vitrine (front-end construído em React) atua exclusivamente como a camada de apresentação abstrata. Toda a inteligência de negócios deriva de dois arquivos JSON estruturados, consumidos via `fetch` nativo:
*   **`products.json` (A Fonte de Dados):** Contém os itens de hardware, preços e atributos técnicos.
*   **`categories.json` (Os Metadados):** Atua como um dicionário de regras. Ele instrui o front-end sobre como construir a NavBar automaticamente e quais tipos de inputs de filtro (Checkboxes, Range Sliders) devem ser renderizados na tela para cada especificação de hardware.

### 2.2 Estratégia de Roteamento (*Loaders*)
Utilizamos o **React Router v6+ (Data Mode)**. O acesso ao sistema de arquivos (JSONs) é orquestrado pelas funções *Loader* das rotas antes mesmo da montagem dos componentes visuais. O uso de uma rota dinâmica (ex: `/categoria/:slug`) permite que a interface reaja aos dados injetados, prevenindo re-renderizações excessivas e garantindo um carregamento inicial instantâneo.

---

## 3. Stack Tecnológica

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Core & Build** | Vite, React, TypeScript | Compilação ultrarrápida, componentização escalável e tipagem estática rigorosa que previne erros de *runtime*. |
| **Estilização (UI)** | Tailwind CSS, Shadcn/UI | Desenvolvimento acelerado de uma interface limpa, moderna e acessível, garantindo responsividade sem arquivos CSS monolíticos. |
| **Roteamento** | React Router DOM (Data) | Gerenciamento de rotas e injeção de dados fluídos. Essencial para isolar a vitrine da rota técnica obrigatória `/como-fiz`. |
| **Estado Global** | Zustand | *Store* atômica e livre de *boilerplate* para gerenciamento centralizado do Carrinho e do Perfil do Cliente. |
| **Formulários** | React Hook Form, Zod | Validação performática de schemas (E-mail, CPF), controle otimizado de *inputs* e aplicação de máscaras via Regex. |
| **Integração Externa**| ViaCEP API | Automação do *checkout* através do autopreenchimento de endereços via *fetch*, sem onerar o *bundle* da aplicação. |

---

## 4. Gerenciamento de Dados e Estado

### 4.1 Persistência e Simulação de Sessão
Para simular um ambiente autenticado em um site puramente estático, o Zustand utiliza o middleware `persist`. Toda mutação no estado (adição de itens ao Carrinho, preenchimento de dados pessoais e endereço) é automaticamente sincronizada com o `localStorage` do navegador. Os formulários do React Hook Form utilizam esses dados recuperados (`defaultValues`) para autopreencher as informações de clientes recorrentes.

### 4.2 Fluxo do *Checkout* Assíncrono
1. **Carrinho:** Consolidado via Zustand.
2. **Identificação:** Máscaras formatadas em tempo real (Regex) e validação de schema estrito (Zod).
3. **Endereço (ViaCEP):** Disparo assíncrono à API pública ViaCEP acionado no evento *onBlur* do campo CEP. Resposta formatada injetada via função `setValue()` do RHF.
4. **Resumo:** Consolidação puramente lógica no front-end, aplicando regras de negócio matemáticas (como o desconto de 5% no PIX) para a revisão do pedido.

---

## 5. Mapeamento AWS e Evolução (*Defesa Técnica*)

*Sessão dedicada ao embasamento das decisões para o vídeo do desafio.*

### 5.1 Jornada do Clique (Cenário Estático Atual)
*   **Origem e Entrega:** Os ativos compilados (HTML, JS, CSS e os JSONs) são implementados em uma hospedagem estática gratuita. 
*   **Camada de Cache (CDN):** Quando o cliente solicita acesso à loja, o navegador é roteado para a CDN (Content Delivery Network). Em um cenário de alto tráfego (ex: 10 mil acessos simultâneos), o cache de borda (*Edge Cache*) da CDN absorve a carga e entrega a SPA estática quase instantaneamente, protegendo o servidor de origem de indisponibilidades.

### 5.2 Arquitetura Futura e *BFF* (App Mobile)
Caso a OnyInfo escale para um aplicativo *mobile* nativo, a topologia exigirá um intermediário:
*   **O Papel do BFF (*Backend for Frontend*):** Um novo serviço (como o AWS API Gateway roteando para funções AWS Lambda) seria instanciado.
*   **Justificativa:** Em vez de o aplicativo móvel baixar os arquivos JSON inteiros, ele faria requisições ao BFF. O BFF orquestraria a busca no banco de dados real, aplicaria lógicas complexas de segurança e entregaria um *payload* otimizado (apenas os dados estritamente necessários para a tela do celular), reduzindo o consumo de banda e bateria do dispositivo do usuário.

---

## 6. Qualidade, Auditoria e Performance
O projeto adota o **Google Lighthouse** como métrica primária de qualidade. As pontuações (Scores) são mantidas nas faixas verdes através da eliminação de bibliotecas de terceiros densas, processamento descentralizado e uso de *Data Loaders* nativos do React Router para antecipar o *fetch* dos metadados antes da renderização visual.