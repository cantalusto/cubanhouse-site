# CubanHouse — proposta visual

Demonstração comercial independente para apresentar ao Cuban House Gastrobar, no Aterrado, Volta Redonda. Não é um canal oficial do restaurante.

## Experiência

- Identidade em preto, rosa e verde-água, com o logo original preservado.
- Galeria de pratos com avanço em etapas, setas, arraste no computador e toque no celular.
- Categorias que se expandem ao passar o mouse ou receber foco por teclado, inspiradas no Qissa; cada categoria abre uma página própria.
- 52 itens do catálogo público, pesquisa sem distinção de acentos, ordenação, favoritos locais e detalhes.
- Links para a loja e itens no iFood; a compra acontece no iFood.
- Emblema 3D inspirado na marca, com balanço e iluminação neon, carregado somente perto da seção.
- GSAP, parallax e animações de rolagem. Letreiro final com algumas letras que apagam e reacendem.
- Loading de primeira entrada por pelo menos 2 segundos: logo acende como letreiro. Nas navegações seguintes, só aparece se o carregamento demorar; transições e entrada do conteúdo nas páginas internas.
- Layout responsivo, ações rápidas no celular e preferência de movimento reduzido.

## Imagens e conteúdo

O logo é a foto pública original do Instagram. Imagens gastronômicas e cenas do pub foram geradas por IA e são identificadas como ilustrativas. Não são fotografias documentais do restaurante. A abertura de Petiscos usa uma imagem panorâmica criada para ocupar a largura da tela: bolinhos em travessa, cerveja e coquetel à direita, interior escuro do pub à esquerda, luzes rosa e verde-água.

Catálogo e informações públicas consultados em 12/10/2026. Preços, disponibilidade, entrega e valor final são confirmados no iFood. Não há credenciais nem sincronização automática nesta demonstração.

## Executar

Requer Node.js 20 ou superior. Não é necessário instalar dependências.

- `npm start`: servidor local em http://127.0.0.1:4173/.
- `npm run build`: gera novamente as seis páginas de categoria a partir do catálogo.
- `dist/`: arquivos estáticos prontos para hospedagem.

## Vercel

Importar o repositório no Vercel. A configuração em `vercel.json` usa a pasta de saída `dist`, sem framework ou compilação obrigatória. Nenhuma variável de ambiente é necessária. O repositório é privado; o endereço de hospedagem pode ser compartilhado conforme a configuração de acesso do Vercel.

## Validação

Verificação visual em computador e em telas de 390 e 320 px. Categorias, busca, ordenação, favoritos, detalhes e links foram conferidos. O loading foi verificado para primeira entrada, navegação rápida e carregamento lento. Não foram testadas compras ou a API do iFood.

## Integração futura

Após obter autorização do restaurante e acesso oficial, implementar leitura do catálogo no servidor com autenticação protegida, cache e tratamento de disponibilidade. Não expor credenciais no navegador.

- [API iFood: catálogo](https://developer.ifood.com.br/en-US/docs/food/guides/modules/catalog/fundamentals)
- [Fluxo do catálogo](https://developer.ifood.com.br/en-US/docs/food/guides/modules/catalog/workflow)
- [Homologação](https://developer.ifood.com.br/en-US/docs/food/guides/modules/catalog/homologation)

## Inspirações

[Qissa](https://www.qissa.co.uk/), [Camarada Camarão](https://www.camaradacamarao.com.br/) e [Tengile MalaMala](https://tengilemalamala.com/): organização do cardápio, narrativa visual e experiência de navegação. As imagens dessas referências não foram reutilizadas.
