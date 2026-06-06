import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('api/payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize a payment for tickets' })
  initialize(@Body() dto: InitializePaymentDto, @CurrentUser('id') userId: string) {
    return this.paymentsService.initializePayment(dto, userId);
  }

  @Get('verify/:reference')
  @ApiOperation({ summary: 'Verify a payment by reference' })
  verify(@Param('reference') reference: string) {
    return this.paymentsService.verifyPayment(reference);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Paystack webhook endpoint' })
  webhook(@Body() body: any) {
    return this.paymentsService.handleWebhook(body);
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment history for an event (creator)' })
  getEventPayments(@Param('eventId') eventId: string, @CurrentUser('id') userId: string) {
    return this.paymentsService.getPaymentHistory(eventId, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments for my events (creator)' })
  getAll(@CurrentUser('id') userId: string) {
    return this.paymentsService.getAllPayments(userId);
  }
}
