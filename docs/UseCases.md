# Casos de Uso (Use Cases - UC)

**UC01: Navegação Dinâmica e Vitrines**
* **Ator Principal:** Cliente
* **Descrição:** O cliente acessa a Home Page e interage com um menu de navegação e vitrines geradas de forma autônoma pelo sistema.
* **Fluxo Principal:** O sistema consome o arquivo `categories.json` via `fetch` para montar a NavBar superior automaticamente. Em seguida, carrega o `products.json` e renderiza as vitrines na página inicial, limitadas a 5 produtos por categoria, com botões para "Ver mais".

**UC02: Exploração e Filtros Inteligentes (Data-Driven)**
* **Ator Principal:** Cliente
* **Descrição:** O cliente acessa a página de uma categoria específica e utiliza filtros laterais para refinar a busca.
* **Fluxo Principal:** O cliente clica em uma categoria na NavBar. O sistema acessa a rota dinâmica `/categoria/:slug`. O React cruza os dados dos produtos com os metadados da categoria e desenha os filtros correspondentes (ex: *Checkboxes* para *strings* como Socket, e *Range Inputs* para números como Quantidade de Núcleos). A listagem de produtos reage em tempo real às seleções.

**UC03: Visualizar Detalhes do Produto (PDP)**
* **Ator Principal:** Cliente
* **Descrição:** O cliente clica em um item de hardware para conferir se as especificações técnicas são compatíveis com seu setup.
* **Fluxo Principal:** O sistema abre a página do produto exibindo imagem, título, preço e descrição. A tabela de especificações (`specs`) é montada dinamicamente lendo as chaves do objeto no JSON. O cliente pode clicar em "Adicionar ao Carrinho".

**UC04: Gerenciar Carrinho de Compras**
* **Ator Principal:** Cliente
* **Descrição:** O cliente gerencia os itens selecionados antes de iniciar o checkout.
* **Fluxo Principal:** O cliente altera a quantidade de um produto ou o remove. O Zustand intercepta a ação, atualiza o subtotal do pedido e persiste imediatamente o novo estado no `localStorage` do navegador. O cliente clica em "Continuar".

**UC05: Identificação e Autopreenchimento (ViaCEP)**
* **Ator Principal:** Cliente
* **Descrição:** O cliente fornece dados de contato e endereço para entrega simulada. O sistema otimiza a digitação com autopreenchimento e máscaras.
* **Fluxo Principal:** 
  1. O cliente acessa a etapa de Identificação. O sistema verifica o `localStorage`; se o cliente for recorrente, os campos são pré-populados.
  2. Se não, o cliente digita Nome, E-mail, Telefone e CPF. O sistema aplica máscaras visuais (Regex) e valida os dados (Zod).
  3. Na etapa de Endereço, o cliente digita o CEP. O sistema faz um `fetch` na API ViaCEP e preenche Rua, Bairro e Cidade automaticamente. 
  4. O Zustand salva todo o progresso no navegador.

**UC06: Pagamento e Finalização Fictícia**
* **Ator Principal:** Cliente
* **Descrição:** O cliente simula a escolha do frete e o pagamento do pedido.
* **Fluxo Principal:** O sistema lista opções fictícias de frete. Na aba Pagamento, o usuário seleciona Cartão ou PIX. Caso selecione PIX, uma regra de negócio deduz 5% do valor dos produtos. O sistema exibe o resumo completo (produtos, frete, desconto e dados do usuário) para a finalização simulada.

**UC07: Defesa Técnica (Avaliação do Bootcamp)**
* **Ator Principal:** Avaliador da AI/R Company
* **Descrição:** O avaliador acessa o sistema para auditar o projeto e assistir ao vídeo de explicação técnica.
* **Fluxo Principal:** O avaliador entra na rota estática `/como-fiz`. O sistema exibe uma interface limpa contendo o player de vídeo, onde são explicadas as decisões arquiteturais sobre *headless commerce*, roteamento dinâmico e performance no Lighthouse.