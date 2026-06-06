import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get creator analytics overview' })
  getOverview(@CurrentUser('id') userId: string) {
    return this.analyticsService.getCreatorAnalytics(userId);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales analytics per event' })
  getSales(@CurrentUser('id') userId: string) {
    return this.analyticsService.getSalesAnalytics(userId);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get detailed analytics for an event' })
  getEventAnalytics(@Param('eventId') eventId: string, @CurrentUser('id') userId: string) {
    return this.analyticsService.getEventAnalytics(eventId, userId);
  }
}
