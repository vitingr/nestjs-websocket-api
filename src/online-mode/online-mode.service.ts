import { Injectable } from '@nestjs/common';
import { CreateOnlineModeDto } from './dto/create-online-mode.dto';
import { UpdateOnlineModeDto } from './dto/update-online-mode.dto';

@Injectable()
export class OnlineModeService {
  create(createOnlineModeDto: CreateOnlineModeDto) {
    return 'This action adds a new onlineMode';
  }

  findAll() {
    return `This action returns all onlineMode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} onlineMode`;
  }

  update(id: number, updateOnlineModeDto: UpdateOnlineModeDto) {
    return `This action updates a #${id} onlineMode`;
  }

  remove(id: number) {
    return `This action removes a #${id} onlineMode`;
  }
}
