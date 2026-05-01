import { ToolRegistry } from '../../core/ToolRegistry';
import { ISkill, SkillContext } from '../ISkill';

/**
 * Grants the agent the ability to navigate web pages and extract content.
 * In production, this would wire Playwright/Puppeteer into the tool handlers.
 */
export class BrowserOperatorSkill implements ISkill {
  readonly id = 'skill:browser-operator';
  readonly description = 'Headless browser navigation, extraction, and form-filling.';

  private mountedTools: string[] = [];
  private mountedRegistry?: ToolRegistry;

  activate(ctx: SkillContext): void {
    this.mountedRegistry = ctx.tools;

    ctx.tools.register({
      name: 'browser.fetch',
      description: 'Fetches the visible text content of a URL.',
      schema: {
        type: 'object',
        properties: { url: { type: 'string', description: 'Target URL' } },
        required: ['url'],
      },
      handler: async (input: { url: string }) => ({
        url: input.url,
        text: `<mock-content for ${input.url}>`,
      }),
    });
    this.mountedTools.push('browser.fetch');

    ctx.tools.register({
      name: 'browser.click',
      description: 'Clicks an element identified by a CSS selector.',
      schema: {
        type: 'object',
        properties: { selector: { type: 'string' } },
        required: ['selector'],
      },
      handler: async (input: { selector: string }) => ({ clicked: input.selector, ok: true }),
    });
    this.mountedTools.push('browser.click');
  }

  deactivate(): void {
    if (this.mountedRegistry) {
      for (const name of this.mountedTools) this.mountedRegistry.unregister(name);
    }
    this.mountedTools = [];
    this.mountedRegistry = undefined;
  }
}
