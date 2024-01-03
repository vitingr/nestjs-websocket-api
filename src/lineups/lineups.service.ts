import { Injectable } from '@nestjs/common';
import { CreateLineupInput } from './dto/create-lineup.input';
import { UpdateLineupInput } from './dto/update-lineup.input';

@Injectable()
export class LineupsService {
  create(createLineupInput: CreateLineupInput) {
    return 'This action adds a new lineup';
  }

  findAll() {
    return `This action returns all lineups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lineup`;
  }

  update(id: number, updateLineupInput: UpdateLineupInput) {
    return `This action updates a #${id} lineup`;
  }

  remove(id: number) {
    return `This action removes a #${id} lineup`;
  }
}
