import { Body, Controller, Get, Param, Put, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.ordersService.findAll(req.user);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.ordersService.create(body, req.user);
  }

  @Roles('super_admin', 'operations_admin')
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.ordersService.updateStatus(id, status, req.user.userId, req.user.sbToken);
  }
}
