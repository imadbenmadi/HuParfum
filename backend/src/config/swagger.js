// Swagger API Documentation Configuration
// Provides comprehensive API documentation with Swagger UI

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HuParfum API Documentation",
            version: "1.0.0",
            description:
                "Complete API documentation for HuParfum - Algerian Perfume & Candles E-commerce Platform",
            contact: {
                name: "HuParfum Support",
                email: "admin@huparfum.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5001",
                description: "Development Server",
            },
            {
                url: "http://localhost:5000",
                description: "Alternative Port",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT token from login endpoint",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
    specs,
    swaggerUi,
};
