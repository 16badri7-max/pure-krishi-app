import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Get()
  findAll() {
    return this.farmersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('farmer', 'super_admin', 'operations_admin')
  @Post('stock-submissions')
  submitStock(@Body() body: any, @Req() req: any) {
    return this.farmersService.submitStock(body, req.user.userId, req.user.sbToken);
  }
}
