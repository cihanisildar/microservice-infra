export interface Template {
    subject: string;
    body: (context: any) => string;
}

export class TemplateManager {
    private templates: Record<string, Template> = {
        'welcome_email': {
            subject: 'Welcome to Developer Infrastructure!',
            body: (ctx) => `Hi ${ctx.name || 'Developer'}, welcome to our professional platform! Your ID is: ${ctx.userId}`
        },
        'password_reset': {
            subject: 'Reset Your Password',
            body: (ctx) => `Click the link to reset your password: ${ctx.resetLink}`
        }
    };

    getTemplate(id: string): Template | undefined {
        return this.templates[id];
    }
}

export const templateManager = new TemplateManager();
