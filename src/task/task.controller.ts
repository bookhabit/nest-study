import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('cron-jobs')
  getCronJobs() {
    return this.taskService.getCronJobs();
  }

  @Post('cron-jobs')
  addCronJob(@Body() body: { name: string; cronExpression: string }) {
    this.taskService.addCronJob(body.name, body.cronExpression);
    return { message: '크론 잡 추가됨', name: body.name };
  }

  @Post('cron-jobs/:name/start')
  startCronJob(@Param('name') name: string) {
    this.taskService.startCronJob(name);
    return { message: '크론 잡 시작됨', name };
  }

  @Post('cron-jobs/:name/stop')
  stopCronJob(@Param('name') name: string) {
    this.taskService.stopCronJob(name);
    return { message: '크론 잡 중지됨', name };
  }

  @Delete('cron-jobs/:name')
  deleteCronJob(@Param('name') name: string) {
    this.taskService.deleteCronJob(name);
    return { message: '크론 잡 삭제됨', name };
  }
}
