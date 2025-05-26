import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report-dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate-dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
  ) {}

  createEstimate(estimateDto: GetEstimateDto) {
    console.log(estimateDto);
    return this.reportRepo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5 ', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5 ', { lat: estimateDto.lat })
      .andWhere('year - :year BETWEEN -3 AND 3 ', { year: estimateDto.year })
      .andWhere('approved IS TRUE')
      .orderBy('mileage - :mileage', 'DESC')
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne();
  }

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
