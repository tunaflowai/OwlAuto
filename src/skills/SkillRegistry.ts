import { ISkill } from './ISkill';

/**
 * Global directory of available skills. Personas reference them by id.
 */
export class SkillRegistry {
  private readonly skills = new Map<string, ISkill>();

  register(skill: ISkill): this {
    if (this.skills.has(skill.id)) {
      throw new Error(`Skill already registered: ${skill.id}`);
    }
    this.skills.set(skill.id, skill);
    return this;
  }

  get(id: string): ISkill {
    const s = this.skills.get(id);
    if (!s) throw new Error(`Skill not found: ${id}`);
    return s;
  }

  resolveAll(ids: ReadonlyArray<string>): ReadonlyArray<ISkill> {
    return ids.map(id => this.get(id));
  }

  list(): ReadonlyArray<ISkill> {
    return Array.from(this.skills.values());
  }
}
