import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return '새로운 고양이를 추가합니다';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `모든 고양이를 반환합니다 (제한: ${query.limit}개)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `#${id} 고양이를 반환합니다`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `#${id} 고양이를 업데이트합니다`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `#${id} 고양이를 삭제합니다`;
  }
}
