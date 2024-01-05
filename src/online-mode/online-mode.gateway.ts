import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { OnlineModeService } from './online-mode.service';
import { CreateOnlineModeDto } from './dto/create-online-mode.dto';
import { UpdateOnlineModeDto } from './dto/update-online-mode.dto';

@WebSocketGateway()
export class OnlineModeGateway {
  constructor(private readonly onlineModeService: OnlineModeService) {}

  @SubscribeMessage('createOnlineMode')
  create(@MessageBody() createOnlineModeDto: CreateOnlineModeDto) {
    return this.onlineModeService.create(createOnlineModeDto);
  }

  @SubscribeMessage('findAllOnlineMode')
  findAll() {
    return this.onlineModeService.findAll();
  }

  @SubscribeMessage('findOneOnlineMode')
  findOne(@MessageBody() id: number) {
    return this.onlineModeService.findOne(id);
  }

  @SubscribeMessage('updateOnlineMode')
  update(@MessageBody() updateOnlineModeDto: UpdateOnlineModeDto) {
    return this.onlineModeService.update(updateOnlineModeDto.id, updateOnlineModeDto);
  }

  @SubscribeMessage('removeOnlineMode')
  remove(@MessageBody() id: number) {
    return this.onlineModeService.remove(id);
  }
}
