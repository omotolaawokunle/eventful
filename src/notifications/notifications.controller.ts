import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('reminders')
  @ApiOperation({ summary: 'Set a reminder for an event' })
  createReminder(@Body() dto: CreateReminderDto, @CurrentUser('id') userId: string) {
    return this.notificationsService.createReminder(dto, userId);
  }

  @Get('reminders')
  @ApiOperation({ summary: 'Get my reminders' })
  getReminders(@CurrentUser('id') userId: string) {
    return this.notificationsService.findMyReminders(userId);
  }

  @Delete('reminders/:id')
  @ApiOperation({ summary: 'Delete a reminder' })
  deleteReminder(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationsService.deleteReminder(id, userId);
  }
}
