export interface EmailOptions {
    to: string;
    subject: string;
    body: string;
    templateId?: string;
    context?: any;
}

export interface IEmailProvider {
    send(options: EmailOptions): Promise<boolean>;
    getName(): string;
}
