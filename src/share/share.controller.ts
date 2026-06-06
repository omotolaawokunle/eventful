import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShareService } from './share.service';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';

@ApiTags('Sharing')
@Controller('api/share')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Get(':eventId')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get shareable links for an event' })
  getShareLinks(@Param('eventId') eventId: string) {
    const placeholderEvent = {
      title: 'Check out this event on Eventful!',
      description: 'Amazing event happening soon. Get your tickets now!',
    };
    return this.shareService.generateShareLinks(
      eventId,
      placeholderEvent.title,
      placeholderEvent.description,
    );
  }
}
