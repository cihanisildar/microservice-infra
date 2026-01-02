import swaggerJsdoc from 'swagger-jsdoc';
import { generateOpenApiSpec } from '../docs/index.js';
import { ApiTag } from '@developer-infrastructure/shared-types';

/**
 * Filter the OpenAPI specification based on tags to separate Public and Admin APIs.
 */
const filterSpec = (spec: any, isAdmin: boolean) => {
    const filteredPaths: any = {};

    // In a real elite setup, we filter paths that have specific tags
    // Internal APIs might also be hidden from public spec entirely
    Object.entries(spec.paths || {}).forEach(([path, methods]: [string, any]) => {
        const filteredMethods: any = {};
        Object.entries(methods).forEach(([method, detail]: [string, any]) => {
            const tags = detail.tags || [];

            // Logic:
            // - Public doc: Must have PUBLIC tag and MUST NOT have ADMIN/INTERNAL tag
            // - Admin doc: Everything (or we could specify ADMIN tag)
            const isPublic = tags.includes(ApiTag.PUBLIC);
            const isInternal = tags.includes(ApiTag.INTERNAL);
            const isTargetAdmin = tags.includes(ApiTag.ADMIN);

            if (isAdmin || (isPublic && !isInternal && !isTargetAdmin)) {
                filteredMethods[method] = detail;
            }
        });

        if (Object.keys(filteredMethods).length > 0) {
            filteredPaths[path] = filteredMethods;
        }
    });

    return {
        ...spec,
        paths: filteredPaths,
    };
};

const getBaseSpec = () => {
    const zodSpec = generateOpenApiSpec() as any;
    const options: swaggerJsdoc.Options = {
        definition: {
            ...zodSpec,
            components: {
                ...zodSpec.components,
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Enter your JWT token',
                    },
                },
            },
            security: [{ bearerAuth: [] }],
        },
        apis: ['./src/routes/*.ts', './src/index.ts'],
    };

    const jsDocSpec = swaggerJsdoc(options);
    return {
        ...jsDocSpec,
        components: {
            ...(jsDocSpec as any).components,
            ...zodSpec.components,
        }
    };
};

const masterSpec = getBaseSpec();

export const publicApiSpec = filterSpec(masterSpec, false);
export const adminApiSpec = filterSpec(masterSpec, true);
