<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Backend of teslo-shop made in NestJS.

This project was provoded as is by Fernando Herrera during his course: "Vue.js from 0 to Expert" from Fernando Herrera. Udemy URL: https://www.udemy.com/share/104WrC3@aOX3PBJDIC2poao-ONXdZtvQSjOODuUCPR1znvLxNZ6B8XNf6-JtqEK24O4Vk

If you want to use it, please use the original project repository: https://github.com/Klerith/nest-teslo-shop/tree/complete-backend

# Teslo API

1. `npm install`
2. Copy file `.env.template` and rename it as `.env`
3. Change environment variables if needed. Not recommended if don't know what you're doing.
4. Start up the database

```
docker compose up -d
```

5. Start the project:

```
npm run start:dev
yarn start:dev

```

6. Execute seed to import data into the database.

```
http://localhost:3000/api/seed
```

7. Visit the api:

```
http://localhost:3000/api
```
