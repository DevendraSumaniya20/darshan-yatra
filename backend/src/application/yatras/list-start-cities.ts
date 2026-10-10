import type { YatraRepository } from '../../domain/yatra/yatra-repository.ts';

export class ListStartCities {
  private readonly yatras: YatraRepository;

  constructor(yatras: YatraRepository) {
    this.yatras = yatras;
  }

  async execute(): Promise<string[]> {
    return this.yatras.listStartCities();
  }
}
