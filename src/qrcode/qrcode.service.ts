import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export class QrcodeService {
  async generateQRCodeData(eventId: string, userId: string): Promise<string> {
    const seed = uuidv4();
    return `${eventId}:${userId}:${seed}`;
  }

  async generateQRCodeImage(data: string): Promise<string> {
    return QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
    });
  }

  verifyQRCode(qrData: string): { eventId: string; userId: string; seed: string } | null {
    const parts = qrData.split(':');
    if (parts.length !== 3) return null;
    return { eventId: parts[0], userId: parts[1], seed: parts[2] };
  }
}
