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

  public handleConnection(client: Socket) {}

  public handleDisconnect() {}

  @SubscribeMessage('joinRoom')
  public async joinRoom(
    @MessageBody() data: JoinRoom,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`${data.clientId} joined`);

    /**
     * Отправляем клиенту список пользователей онлайн
     */
    const users = await this.server.of('/').in(data.roomId).fetchSockets();
    const clientIds = users.map((user) => {
      const clientId = user.handshake.query.userId as string;
      if (Number(clientId) !== data.clientId) {
        return { clientId: Number(clientId) };
      }
    });
    console.log(clientIds);

    client.join(data.roomId);

    /**
     * Событие на получение списка пользователей онлайн
     */

    client.emit('recieveUsersOnline', {
      clientIds,
    });

    /**
     * Ретрансляция события входа в комнату-
     */
    client.to(data.roomId).emit('joinRoom', { clientId: data.clientId });
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(
    @MessageBody() data: LeaveRoom,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId);
    client.to(data.roomId).emit('leaveRoom', { clientId: data.clientId });
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
