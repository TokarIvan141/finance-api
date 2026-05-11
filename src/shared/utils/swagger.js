const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Finance API',
        version: '1.0.0',
        description: 'Personal Finance Management API'
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local Server' }
    ],
    paths: {
        '/api/v1/categories': {
            get: {
                summary: 'Get all categories',
                tags: ['Categories'],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
                    { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search by category name' }
                ],
                responses: { '200': { description: 'Success' } }
            },
            post: {
                summary: 'Create a new category',
                tags: ['Categories'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Продукти' },
                                    type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
                                    color: { type: 'string', example: '#FF0000' }
                                }
                            }
                        }
                    }
                },
                responses: { '201': { description: 'Created' } }
            }
        },
        '/api/v1/categories/{id}': {
            get: {
                summary: 'Get category by ID',
                tags: ['Categories'],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
                ],
                responses: { '200': { description: 'Success' } }
            },
            put: {
                summary: 'Update category name',
                tags: ['Categories'],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Оренда квартири' }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: 'Updated' } }
            },
            delete: {
                summary: 'Soft delete category',
                tags: ['Categories'],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
                ],
                responses: { '200': { description: 'Deleted' } }
            }
        }
    }
};

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;