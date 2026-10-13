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

## Idiomas e avaliações

Português, inglês e espanhol no seletor do cabeçalho. A escolha fica salva no navegador e vale para todas as páginas, com tradução do catálogo, pesquisa, detalhes, navegação e rótulos de acessibilidade. Nomes de marcas e os valores em reais são preservados.

A seção de avaliações mostra a nota de 4,5 e o total de 43 avaliações, conferidos diretamente no Google Maps em 12/10/2026. Inclui três trechos selecionados, com autoria, estrelas reais, controles e link para a fonte. Os trechos em inglês/espanhol são identificados como traduções. Não há atualização automática sem a futura conexão oficial. O snapshot está em `dist/reviews-data.js`; para conectar depois, usar Google Places no servidor, com chave protegida no Vercel, cache e autoria dos comentários preservada.

O parallax da abertura mantém uma margem de imagem além da área visível, evitando faixas vazias ao voltar ao topo. Os elementos do emblema 3D foram proporcionados para permanecer dentro da base e não cruzar os textos.

## Imagens e conteúdo

O logo é a foto pública original do Instagram. Imagens gastronômicas e cenas do pub foram geradas por IA e são identificadas como ilustrativas. Não são fotografias documentais do restaurante. Todas as seis categorias usam imagens panorâmicas próprias criadas para ocupar a largura da abertura. Pratos ou bebidas ficam à direita e o interior escuro do pub à esquerda, com luzes rosa e verde-água. As imagens em WebP são carregadas apenas na página correspondente.

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
