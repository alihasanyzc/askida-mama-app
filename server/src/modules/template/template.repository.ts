import type { TemplateCreateInput, TemplateStatus } from './template.type.js';

export const templateRepository = {
  async getStatus(): Promise<TemplateStatus> {
    return {
      module: 'template',
      ready: true,
      timestamp: new Date().toISOString(),
    };
  },

  async create(payload: TemplateCreateInput) {
    return {
      ...payload,
      createdAt: new Date().toISOString(),
    };
  },
};
