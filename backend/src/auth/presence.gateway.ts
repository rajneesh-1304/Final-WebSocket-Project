import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { SessionService } from './session.service';
import { Socket } from 'socket.io';
import { parse } from 'path';

@WebSocketGateway(5000, { cors: true })
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private sessionService: SessionService,
  ) { }

  async handleConnection(client: Socket) {
    try {
      console.log('hello world!')
      console.log('New User connected', client.handshake.auth.id);
      const userId = 1;
      await this.sessionService.addSession(userId, client.id);
    } catch (e) {
      console.log(e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data) {
      const { userId, sessionId } = client.data;
      // this.sessionService.removeSession(userId, sessionId);
      console.log(`User ${userId} session ended: ${sessionId}`);
    }
  }

 @SubscribeMessage('otp')
  async handleAllMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    console.log(payload,"in gateway");

    if (payload.otp == 123456) {
      console.log('Correct otp');
      client.emit('otp_response', { status: 'success', message: 'Valid OTP' });
      await this.sessionService.removeAllSession(payload.userId);
      return;
    }

    console.log('Incorrect OTP');
    
    client.emit('otp_response', { status: 'error', message: 'Invalid OTP' });
  }
}