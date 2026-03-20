import type { TemplateCreateInput } from './template.type.js';
import { templateRepository } from './template.repository.js';

export const templateService = {
  async getStatus() {
    return templateRepository.getStatus();
  },

  async create(payload: TemplateCreateInput) {
    return templateRepository.create(payload);
  },
};
