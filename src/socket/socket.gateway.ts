import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('client connected');
    client.emit('connected', 'client connected');
  }

  handleDisconnect(client: Socket) {
    console.log('client connected');
    client.emit('disconnected');
  }

  @SubscribeMessage('stream')
  async broadcastEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log(data, client.id);
    client.broadcast.to(data.room_id).emit('stream', data);
  }
}
