import { ToolRegistry } from '../../core/ToolRegistry';
import { ISkill, SkillContext } from '../ISkill';

export interface PurchaseOrderInput {
  readonly sku: string;
  readonly quantity: number;
  readonly supplierId?: string;
}

export class SupplyChainCoordinatorSkill implements ISkill {
  readonly id = 'skill:supply-chain-coordinator';
  readonly description = 'Inventory checks, supplier lookups, and PO drafting for F&B operations.';

  private mountedTools: string[] = [];
  private mountedRegistry?: ToolRegistry;

  activate(ctx: SkillContext): void {
    this.mountedRegistry = ctx.tools;
    ctx.tools.register({
      name: 'inventory.check',
      description: 'Returns current on-hand stock for a SKU.',
      schema: {
        type: 'object',
        properties: { sku: { type: 'string' } },
        required: ['sku'],
      },
      handler: async (input: { sku: string }) => ({ sku: input.sku, onHand: 42, reorderAt: 50 }),
    });
    this.mountedTools.push('inventory.check');

    ctx.tools.register({
      name: 'po.draft',
      description: 'Drafts a purchase order for a given SKU and quantity.',
      schema: {
        type: 'object',
        properties: {
          sku: { type: 'string' },
          quantity: { type: 'number' },
          supplierId: { type: 'string' },
        },
        required: ['sku', 'quantity'],
      },
      handler: async (input: PurchaseOrderInput) => ({
        poId: `PO-${Date.now()}`,
        ...input,
        status: 'DRAFT',
      }),
    });
    this.mountedTools.push('po.draft');
  }

  deactivate(): void {
    if (this.mountedRegistry) {
      for (const name of this.mountedTools) this.mountedRegistry.unregister(name);
    }
    this.mountedTools = [];
    this.mountedRegistry = undefined;
  }
}
