# teslo-shop

This vue app uses Pinia - TanStack and reusable components to build an online E-Commerce application. This project is a PoC and is not intended to be used in a production environment. It was created to learn about the use of permisions, roles, cache, layouts and advanced development using VUE and its environment tools. This app was built during the course "Vue.js from 0 to Expert" from Fernando Herrera. Udemy URL: https://www.udemy.com/share/104WrC3@aOX3PBJDIC2poao-ONXdZtvQSjOODuUCPR1znvLxNZ6B8XNf6-JtqEK24O4Vk

### Components

- Backend: the application contanis a backend built in NestJS that can be found in the folder "backend". The README.md file in that folder contains all needed information to run the backend.

- Fontend: the application contains a frontend built in Vue that can be found in the folder "frontend". The README.md file in that folder contains all needed information to run
  the frontend.

### Deployment to the cloud

For simplicity, the "frontend" has been build using "npm run build" and the contents of the created "dist" forlder have ben copied into the folder "public"
of the "backend" folder.
In a real world I would recommend to deploy frontend and backend sepoaratelly to improve maintainability and scalability.

1. Envs
   We add env variables to the Railway environment.
   Update HOST_API with the new URL yopu created for your deployment.

2. Railway
   For the backend we use Railway and we connect the free tier with our GitHub repository usiong the main branch and the folder "backend" as root
   folder for the deployment.

3. NeonTech
   For the database we use NeonTech because it offers a free tier that is enough for our test application.

4. Connection strings

5. Configurations
