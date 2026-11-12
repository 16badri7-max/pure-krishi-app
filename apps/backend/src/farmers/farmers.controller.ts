import { Controller, Get, Param } from '@nestjs/common';
import { FarmersService } from './farmers.service';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Get()
  findAll() { return this.farmersService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.farmersService.findOne(id); }
}
