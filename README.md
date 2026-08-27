# OnyInfo Ecommerce

Uma plataforma de e-commerce de hardware desenvolvida como entrega do Desafio 1 ("Minha Loja no Ar") do Bootcamp AWS AI FDE for Commerce. O projeto implementa um conceito de headless commerce em miniatura, operando exclusivamente no client-side sem a necessidade de um back-end em tempo de execução.

## Principais Funcionalidades

* **Arquitetura Data-Driven:** Interface, vitrines e filtros gerados dinamicamente a partir da leitura de arquivos estáticos (`products.json` e `categories.json`).
* **Roteamento Antecipado:** Uso de Loaders do React Router v6 para buscar os dados antes da renderização dos componentes de tela.
* **Checkout Simulado:** Fluxo de compra com persistência de estado no `localStorage`, formatação via Regex, validação de formulários (Zod) e integração com a API ViaCEP para autopreenchimento.
* **Defesa Técnica:** Rota estática dedicada (`/como-fiz`) contendo a apresentação arquitetural exigida pelo desafio.

## Tecnologias Utilizadas

* React
* TypeScript
* Vite
* Tailwind CSS
* Shadcn/UI
* Zustand 
* React Hook Form & Zod
* React Router DOM v6+
