import BlogDocs from "./blogDocs";
import UserDocs from "./userDocs";

const swaggerdocs = {
  openapi: "3.0.1",
  info: {
    title: "Mag's brand documentation",
    version: "1.0.0",
    description: "This is an API for my blog application",
    contact: {
      name: "Munezero Ange Gabriel",
      url: "https://munezero2000.github.io/mag-s-brand/",
      email: "munezero05200@gmail.com",
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "apiKey",
        name: "x-auth-token",
        in: "header",
        description: "Bearer token authorization",
      },
    },
  },
  tags: [
    {
      name: "Blog",
      description: "Blog Endpoints",
    },
    {
      name: "User",
      description: "Users Endpoints",
    },
  ],
  paths: {
    ...UserDocs,
    ...BlogDocs,
  },
};
export default swaggerdocs;
