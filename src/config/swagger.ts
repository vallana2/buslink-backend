import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BusLink API",
      version: "1.0.0",
      description: "Multi-Agency Bus Ticketing and Transport Management Platform API",
    },
    servers: [
      { url: "http://localhost:5000/api/v1", description: "Local server" },
      { url: "https://buslink-backend-csye.onrender.com/api/v1", description: "Live server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);