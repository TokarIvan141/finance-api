const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Finance API',
        version: '1.0.0',
        description: 'Personal Finance Management API. \n\n🔒 **Авторизація:** API використовує JWT токени (через HttpOnly cookies).'
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local Server' }
    ],
    tags: [
        { name: 'Auth', description: 'Управління доступом' },
        { name: 'Categories', description: 'Категорії' },
        { name: 'Transactions', description: 'Транзакції' },
        { name: 'Budgets', description: 'Бюджети' },
        { name: 'Reports', description: 'Звіти' },
        { name: 'Export', description: 'Експорт' },
        { name: 'Settings', description: 'Налаштування' },
        { name: 'Logs', description: 'Логи' }
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'accessToken',
                description: 'JWT токен у HttpOnly Cookie'
            }
        },
        schemas: {
            Error: {
                type: 'object',
                properties: { error: { type: 'string', example: 'Помилка' } }
            }
        },
        responses: {
            UnauthorizedError: {
                description: 'Не авторизовано',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            NotFoundError: {
                description: 'Не знайдено',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
        }
    },
    security: [{ cookieAuth: [] }],

    paths: {
        '/api/v1/auth/register': {
            post: {
                summary: 'Register a new user',
                tags: ['Auth'],
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password', 'name'],
                                properties: {
                                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                                    password: { type: 'string', format: 'password', example: '123456' },
                                    name: { type: 'string', example: 'Іван' }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/auth/login': {
            post: {
                summary: 'Login user',
                tags: ['Auth'],
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                                    password: { type: 'string', format: 'password', example: '123456' }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/auth/logout': {
            post: {
                summary: 'Logout user',
                tags: ['Auth'],
                responses: { '200': { description: 'Logged out successfully' } }
            }
        },
        '/api/v1/auth/refresh': {
            post: {
                summary: 'Refresh access token',
                tags: ['Auth'],
                responses: { '200': { description: 'Tokens refreshed' } }
            }
        },
        '/api/v1/auth/me': {
            get: {
                summary: 'Get current user info',
                tags: ['Auth'],
                responses: { '200': { description: 'Success' } }
            }
        },
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
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { '200': { description: 'Success' } }
            },
            put: {
                summary: 'Update category name',
                tags: ['Categories'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', properties: { name: { type: 'string', example: 'Оренда квартири' } } }
                        }
                    }
                },
                responses: { '200': { description: 'Updated' } }
            },
            delete: {
                summary: 'Soft delete category',
                tags: ['Categories'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { '200': { description: 'Deleted' } }
            }
        },
        '/api/v1/categories/{id}/transactions': {
            get: {
                summary: 'Get transactions by category with filters',
                tags: ['Categories', 'Transactions'],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
                    { in: 'query', name: 'type', schema: { type: 'string', enum: ['income', 'expense'] } },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'search', schema: { type: 'string' } }
                ],
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/transactions': {
            get: {
                summary: 'Get all transactions with filters',
                tags: ['Transactions'],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
                    { in: 'query', name: 'type', schema: { type: 'string', enum: ['income', 'expense'] } },
                    { in: 'query', name: 'categoryId', schema: { type: 'string', format: 'uuid' } },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' }, description: 'YYYY-MM-DD' },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date' }, description: 'YYYY-MM-DD' },
                    { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search in description' }
                ],
                responses: { '200': { description: 'Success' } }
            },
            post: {
                summary: 'Create a new transaction',
                tags: ['Transactions'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    categoryId: { type: 'string', format: 'uuid' },
                                    amount: { type: 'number', example: 1500.50 },
                                    type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
                                    date: { type: 'string', format: 'date-time', example: '2026-05-11T12:00:00Z' },
                                    description: { type: 'string', example: 'Покупка продуктів' }
                                }
                            }
                        }
                    }
                },
                responses: { '201': { description: 'Created' } }
            }
        },
        '/api/v1/transactions/{id}': {
            get: {
                summary: 'Get transaction by ID',
                tags: ['Transactions'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { '200': { description: 'Success' } }
            },
            put: {
                summary: 'Update transaction',
                tags: ['Transactions'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', properties: { amount: { type: 'number', example: 1600.00 }, date: { type: 'string', format: 'date-time', example: '2026-05-12T12:00:00Z' }, description: { type: 'string', example: 'Оновлений опис' } } }
                        }
                    }
                },
                responses: { '200': { description: 'Updated' } }
            },
            delete: {
                summary: 'Soft delete transaction',
                tags: ['Transactions'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { '200': { description: 'Deleted' } }
            }
        },
        '/api/v1/categories/{id}/budget': {
            get: {
                summary: 'Get budget for category',
                tags: ['Budgets'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { '200': { description: 'Success' } }
            },
            post: {
                summary: 'Set budget for category',
                tags: ['Budgets'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { amountLimit: { type: 'number' } } } } } },
                responses: { '201': { description: 'Created' } }
            },
            put: {
                summary: 'Update budget for category',
                tags: ['Budgets'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { amountLimit: { type: 'number' } } } } } },
                responses: { '200': { description: 'Updated' } }
            },
            delete: {
                summary: 'Delete budget for category',
                tags: ['Budgets'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { '200': { description: 'Deleted' } }
            }
        },
        '/api/v1/reports/summary': {
            get: {
                summary: 'Get total income, expense and balance',
                tags: ['Reports'],
                parameters: [
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date' } }
                ],
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/reports/by-category': {
            get: {
                summary: 'Get expenses/incomes grouped by category (for pie chart)',
                tags: ['Reports'],
                parameters: [
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'type', schema: { type: 'string', enum: ['income', 'expense'], default: 'expense' } }
                ],
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/reports/trend': {
            get: {
                summary: 'Get transactions grouped by date (for line chart)',
                tags: ['Reports'],
                parameters: [
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'interval', schema: { type: 'string', enum: ['day', 'month'], default: 'day' } }
                ],
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/reports/budget-utilization': {
            get: {
                summary: 'Get current month budget limits vs actual spending',
                tags: ['Reports'],
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/export/xlsx': {
            get: {
                summary: 'Export transactions to Excel (.xlsx)',
                tags: ['Export'],
                parameters: [
                    { in: 'query', name: 'type', schema: { type: 'string', enum: ['income', 'expense'] } },
                    { in: 'query', name: 'categoryId', schema: { type: 'string', format: 'uuid' } },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date' } },
                    { in: 'query', name: 'search', schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Excel file',
                        content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } } }
                    }
                }
            }
        },
        '/api/v1/settings': {
            get: {
                summary: 'Get current user settings',
                tags: ['Settings'],
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/settings/theme': {
            patch: {
                summary: 'Update UI theme',
                tags: ['Settings'],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['theme'], properties: { theme: { type: 'string', enum: ['light', 'dark'] } } } } }
                },
                responses: { '200': { description: 'Success' }, '400': { description: 'Bad Request' } }
            }
        },
        '/api/v1/logs': {
            get: {
                summary: 'Get all system logs',
                security: [],
                tags: ['Logs'],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 50 } }
                ],
                responses: { '200': { description: 'Success' } }
            }
        },
        '/api/v1/users/{userId}/logs': {
            get: {
                summary: 'Get logs for specific user',
                security: [],
                tags: ['Logs'],
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string', format: 'uuid' } },
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } }
                ],
                responses: { '200': { description: 'Success' } }
            }
        }
    }
};

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwagger;