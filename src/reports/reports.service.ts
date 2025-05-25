import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report-dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.reportRepo.create(reportDto);
    report.user = user;
    return this.reportRepo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportRepo.findOne({
      where: { id: parseInt(id) },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    await this.reportRepo.save(report);
    return report;
  }
}
