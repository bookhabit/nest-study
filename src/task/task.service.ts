import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  onModuleInit() {
    this.logger.log('📅 태스크 스케줄링 서비스 초기화 완료');
  }

  // 1. 크론 잡 - 매 10초마다 실행
  @Cron('*/10 * * * * *', {
    name: 'every-10-seconds',
  })
  handleCron() {
    const now = new Date();
    this.logger.log(`⏰ 크론 잡 실행: ${now.toLocaleTimeString('ko-KR')}`);
  }

  // 2. 인터벌 - 5초마다 실행
  //   @Interval(5000)
  //   handleInterval() {
  //     const now = new Date();
  //     this.logger.log(`🔄 인터벌 실행: ${now.toLocaleTimeString('ko-KR')}`);
  //   }

  // 3. 타임아웃 - 앱 시작 후 3초 후 한 번 실행
  //   @Timeout(3000)
  //   handleTimeout() {
  //     this.logger.log('⏱️  타임아웃 실행 (앱 시작 후 3초)');
  //   }

  // 4. 동적 크론 잡 추가
  addCronJob(name: string, cronExpression: string) {
    const job = new CronJob(cronExpression, () => {
      this.logger.log(`🔧 동적 크론 잡 실행: ${name}`);
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.log(`✅ 크론 잡 추가: ${name}`);
  }

  // 5. 크론 잡 중지
  stopCronJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
    this.logger.log(`⏸️  크론 잡 중지: ${name}`);
  }

  // 6. 크론 잡 시작
  startCronJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    job.start();
    this.logger.log(`▶️  크론 잡 시작: ${name}`);
  }

  // 7. 크론 잡 삭제
  deleteCronJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.log(`🗑️  크론 잡 삭제: ${name}`);
  }

  // 8. 크론 잡 목록 조회
  getCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    return Array.from(jobs.keys()).map((name) => {
      const job = jobs.get(name);
      return {
        name,
        running: job ? (job as any).running || false : false,
      };
    });
  }
}
