import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.productsService.findAllApproved(category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'operations_admin')
  @Get('admin/all')
  findAllAdmin(@Req() req: any) {
    return this.productsService.findAllAdmin(req.user.sbToken);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'operations_admin')
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.productsService.createAsAdmin(body, req.user.userId, req.user.sbToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'operations_admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.productsService.updateAsAdmin(id, body, req.user.userId, req.user.sbToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'operations_admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.productsService.removeAsAdmin(id, req.user.userId, req.user.sbToken);
  }
}
