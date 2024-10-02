import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      version,
    },
    servers: [
      {
        url: `${process.env.APP_BASE_URL}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/api-docs/*.yaml', './src/api-docs/schemas/*/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);
