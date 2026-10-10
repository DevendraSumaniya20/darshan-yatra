import type { RequestHandler } from 'express';
import type { GetYatraDetail } from '../../../application/yatras/get-yatra-detail.ts';
import type { ListStartCities } from '../../../application/yatras/list-start-cities.ts';
import type { ListYatras, ListYatrasInput } from '../../../application/yatras/list-yatras.ts';
import { listYatrasQuery, yatraSlugParams } from '../schemas/yatra-schemas.ts';

export type YatraUseCases = {
  listYatras: ListYatras;
  getYatraDetail: GetYatraDetail;
  listStartCities: ListStartCities;
};

export class YatraController {
  private readonly useCases: YatraUseCases;

  constructor(useCases: YatraUseCases) {
    this.useCases = useCases;
  }

  list: RequestHandler = async (req, res) => {
    const query = listYatrasQuery.parse(req.query);

    const input: ListYatrasInput = { page: query.page, pageSize: query.pageSize };
    if (query.circuit) input.circuit = query.circuit;
    if (query.startCity) input.startCity = query.startCity;
    if (query.difficulty) input.difficulty = query.difficulty;
    if (query.maxDays) input.maxDurationDays = query.maxDays;
    if (query.month) input.month = query.month;

    const result = await this.useCases.listYatras.execute(input);
    res.json({
      data: result.items,
      meta: { total: result.total, page: result.page, pageSize: result.pageSize },
    });
  };

  detail: RequestHandler = async (req, res) => {
    const { slug } = yatraSlugParams.parse(req.params);
    res.json({ data: await this.useCases.getYatraDetail.execute(slug) });
  };

  startCities: RequestHandler = async (_req, res) => {
    res.json({ data: await this.useCases.listStartCities.execute() });
  };
}
