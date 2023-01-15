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

  roomId: string;

  handleConnection(@MessageBody() data: any, client: Socket) {
    client.emit('connected', data);
  }

  public handleDisconnect(client: Socket) {
    console.log('client connected');
    client.emit('disconnected');
  }

  @SubscribeMessage('joinToChat')
  public join(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.join(data.chatId);
  }

  @SubscribeMessage('stream')
  public broadcastEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(data, client.id);
    client.broadcast.to(data.room_id).emit('stream', data);
  }

  public chatMessage(chatId: string, messageId: number): void {
    const io = this.server.sockets;
    io.to(chatId).emit('chatMessage', {
      chatId,
      messageId,
    });
  }
}
