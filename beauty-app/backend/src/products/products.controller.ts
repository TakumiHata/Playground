import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: Prisma.ProductCreateInput): Promise<Product> {
    return this.productsService.create(data);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return this.productsService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(Number(id));
  }
} 