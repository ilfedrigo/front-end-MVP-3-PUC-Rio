# UrbanTrendz

UrbanTrendz é uma aplicação de comércio eletrônico que consiste em um frontend e um backend para gerenciar compras e ordens.

## Arquitetura

<img width="441" alt="Screenshot 2024-04-25 at 11 08 04" src="https://github.com/ilfedrigo/front-end-MVP-3-PUC-Rio/assets/115956776/50d6e528-d611-44cf-b9b7-6af59d3bdb1c">

## Instruções de instalação

Para rodar a aplicação, siga os passos abaixo:

1. Certifique-se de ter o Docker instalado em sua máquina.
2. Clone este repositório para o seu ambiente local.
3. No terminal, navegue até a pasta do frontend.
4. Crie um arquivo chamado `Dockerfile` com o seguinte conteúdo:

```Dockerfile
FROM nginx:latest

COPY front-end-MVP-3-PUC-Rio/ /usr/share/nginx/html/
```

5. Execute os seguintes comandos para construir e rodar o container Docker:

```bash
docker build -t urbantrendz-frontend .
docker run -p 8080:80 urbantrendz-frontend
```

6. Acesse a aplicação no seu navegador em [http://localhost:8080](http://localhost:8080).

## Descrição do projeto

O UrbanTrendz consiste em quatro telas principais:

- **login.html**: Responsável por autenticar os usuários. O login com o usuário admin e senha password102030 redireciona para admin.html, caso contrário, redireciona para index.html.
- **index.html**: Apresenta uma lista de itens disponíveis para compra, obtidos de uma API externa. Os usuários podem adicionar itens ao carrinho e prosseguir para a tela de checkout.
- **cart.html**: Mostra os itens selecionados para compra e permite que o usuário finalize o checkout. Os itens são enviados para o backend após a confirmação.
- **admin.html**: Exibe todas as ordens de compra registradas no sistema. Apenas o usuário admin pode acessar esta página.

## API Externa

A aplicação consulta a [Fake Store API](https://fakestoreapi.com/products) para obter a lista de itens disponíveis para compra. Essa API fornece dados simulados de produtos.
