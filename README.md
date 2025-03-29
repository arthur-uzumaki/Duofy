# Teste Técnico para Desenvolvedor Backend 

 ## Ferramenta Back-End
 - Nodejs
 - Typescript
 - Prisma
 - Fastify
 - @Fastify/cors
 - @Fastify/jwt
 - @Fastify/swagger
 - @Fastify/swagger-ui
 - Fastify-type-provider-zod
 - Zod
 - amqplib
 - bcrypt
 - mongodb 

  ## 🚀 Como executar
  - Instale os pacotes com npm install.
  - Faça uma copia do arquivo .env.example para .env e altere caso necessário.
  - Execute npx prisma migrate dev para rodar as migrations
  - Execute npx prisma db seed. Esse comando também já vai executar as seeds
  - Execute  npx prisma studio. Ele se conecta ao banco de dados configurado no arquivo prisma/schema.prisma.
  - Execute docker-compose up -d . Ele vai baixar os contêineres
  - Execute npm run dev para iniciar o servidor.
  - Acessa a url do swagger http://localhost:3333/docs
  - Acessa um arquivo na raiz do projeto api.http pra testa as rotas
