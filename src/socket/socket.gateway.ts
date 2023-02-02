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
import { JoinRoom, LeaveRoom, SendMessage } from './socket.interfaces/events';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server: Server;

  roomId: string;

  handleConnection() {
    console.log('client connected');
  }

  public handleDisconnect() {
    console.log('client disconnected');
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(
    @MessageBody() data: JoinRoom,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    client.to(data.roomId).emit('joinRoom', data);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(
    @MessageBody() data: LeaveRoom,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId);
    client.to(data.roomId).emit('leaveRoom', data);
  }

  /**
   *
   * @param data
   * @param client
   * Оповещение о новом сообщении
   */
  @SubscribeMessage('sendMessage')
  public chatMessage(
    @MessageBody() data: SendMessage,
    @ConnectedSocket() client: Socket,
  ): void {
    client.to(data.roomId).emit('sendMessage', { ...data });
  }
}
