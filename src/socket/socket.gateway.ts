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

  handleConnection(client: Socket) {
    // const userId = client.handshake.query;
    // console.log(userId.userId);
    // console.log('client connected');
  }

  public handleDisconnect() {
    // console.log('client disconnected');
  }

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
    const userIds = users.map((user) => {
      const userId = user.handshake.query.userId as string;
      if (Number(userId) !== data.clientId) {
        return userId;
      }
    });
    console.log(userIds);

    client.join(data.roomId);

    /**
     * Событие на получение списка пользователей онлайн
     */
    client.emit('recieveOnlineUsers', {
      userIds,
    });

    /**
     * Ретрансляция события входа в комнату-
     */
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
