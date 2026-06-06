import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Tickets')
@Controller('api/tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my purchased tickets' })
  getMyTickets(@CurrentUser('id') userId: string) {
    return this.ticketsService.findMyTickets(userId);
  }

  @Get('verify/:qrCodeData')
  @ApiOperation({ summary: 'Verify a ticket by QR code data' })
  verify(@Param('qrCodeData') qrCodeData: string) {
    return this.ticketsService.verifyTicket(qrCodeData);
  }

  @Post('scan/:qrCodeData')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Scan a ticket (mark as used)' })
  scan(@Param('qrCodeData') qrCodeData: string) {
    return this.ticketsService.scanTicket(qrCodeData);
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event attendees (creator)' })
  getEventAttendees(@Param('eventId') eventId: string, @CurrentUser('id') userId: string) {
    return this.ticketsService.getEventAttendees(eventId, userId);
  }
}
