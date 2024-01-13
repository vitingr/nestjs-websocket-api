import { Injectable } from '@nestjs/common';
import { CreateGeneratedBadgeInput } from './dto/create-generated-badge.input';
import { UpdateGeneratedBadgeInput } from './dto/update-generated-badge.input';

@Injectable()
export class GeneratedBadgeService {
  create(createGeneratedBadgeInput: CreateGeneratedBadgeInput) {
    return 'This action adds a new generatedBadge';
  }

  findAll() {
    return `This action returns all generatedBadge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generatedBadge`;
  }

  update(id: number, updateGeneratedBadgeInput: UpdateGeneratedBadgeInput) {
    return `This action updates a #${id} generatedBadge`;
  }

  remove(id: number) {
    return `This action removes a #${id} generatedBadge`;
  }
}
