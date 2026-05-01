import { IPersona } from './IPersona';

export class PersonaRegistry {
  private readonly personas = new Map<string, IPersona>();

  register(persona: IPersona): this {
    if (this.personas.has(persona.id)) {
      throw new Error(`Persona already registered: ${persona.id}`);
    }
    this.personas.set(persona.id, persona);
    return this;
  }

  get(id: string): IPersona {
    const p = this.personas.get(id);
    if (!p) throw new Error(`Persona not found: ${id}`);
    return p;
  }

  list(): ReadonlyArray<IPersona> {
    return Array.from(this.personas.values());
  }
}
