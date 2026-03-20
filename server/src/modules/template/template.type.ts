export type TemplateCreateInput = {
  name: string;
};

export type TemplateStatus = {
  module: string;
  ready: boolean;
  timestamp: string;
};

export const TEMPLATE_MODULE_NAME = 'template';
