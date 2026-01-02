import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry.js';
import { config } from '../config/index.js';

// Import all schemas to ensure they are registered
import './schemas/common.js';
import './schemas/auth.js';
import './schemas/audit.js';
import './schemas/notification.js';
import './schemas/config.js';
import './schemas/feature-flags.js';

export const generateOpenApiSpec = () => {
    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            title: 'Developer Infrastructure API',
            version: '1.0.0',
            description: `
## 🚀 Elite API Gateway (Zod Powered)
Welcome to the Developer Infrastructure API reference. 

### 💎 Elite Features
- **Type Safety**: Automatically generated TypeScript types.
- **Runtime Validation**: Zero overhead schema validation.
- **Auto Docs**: Documentation synced with code via Zod.

### 🔑 Authentication
Most endpoints require a Bearer Token.
            `,
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
                description: 'Local development server',
            },
        ],
        // Global security can be added here if needed
    });
};
