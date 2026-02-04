import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { SessionService } from './session.service';
import { Socket } from 'socket.io';
import { parse } from 'path'; import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';




@WebSocketGateway(5000, { cors: true })
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private sessionService: SessionService,
  ) { }
  private otpStore = new Map<string, string>();

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const userId = Number(client.handshake.auth.userId);
      const purpose = client.handshake.auth.purpose;

      if (!userId) {
        client.disconnect();
        return;
      }
      console.log('🟢 User connected:', userId, client.id);

      if (purpose === "otp") {
        return;
      }

      const canLogin = await this.sessionService.canLogin(userId);
      if (!canLogin) {
        client.emit('session_error', {
          message: 'Session limit reached (Max 2 devices)',
        });
        client.disconnect();
        return;
      }

      await this.sessionService.addSession(userId, client.id);

      client.data.userId = userId;
      client.data.sessionId = client.id;
    } catch (e) {
      console.log(e.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const { userId, sessionId } = client.data;

    if (userId && sessionId) {
      await this.sessionService.removeSession(userId, sessionId);
      console.log(`🔴 User ${userId} disconnected (${sessionId})`);
    }
  }

  @SubscribeMessage('generate_otp')
  async generateOtp(
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.id;
    if (!userId) {
      client.emit('otp_error', { message: 'User not authenticated' });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(userId, otp);
    console.log(`OTP generated for user ${userId}: ${otp}`);
    client.emit('otp_generated', {
      otp,
    });
  }


  @SubscribeMessage('verify_otp')
  async handleAllMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const { otp, email } = payload;
    const userId = client.id;

    const storedOtp = this.otpStore.get(userId);

    if (!storedOtp) {
      client.emit('otp_response', { status: 'error', message: 'OTP not generated', });
      return;
    }
    if (storedOtp !== otp) {
      client.emit('otp_response', { status: 'error', message: 'Invalid OTP', });
      return;
    }
    const removed = await this.sessionService.removeEarliestSession(email);
    if (removed?.sessionId) {
      const oldSocket = this.server.sockets.sockets.get(removed.sessionId);

      if (oldSocket) {
        oldSocket.emit('session_removed', {
          message: 'Logged out because of another login',
        });
        console.log('logout successfull')

        setTimeout(() => {
          oldSocket.disconnect(true);
        }, 2000);
      }
    }
    this.otpStore.delete(userId);
    client.emit('otp_response', {
      status: 'success', message: 'OTP verified. Oldest session removed.',
    });
  }
}