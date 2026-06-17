import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFittingDto } from './dto/create-fitting.dto';
import { UpdateFittingDto } from './dto/update-fitting.dto';
import { Fitting } from './entities/fitting.entity';

@Injectable()
export class FittingsService {
  private fittings: Fitting[] = [
    {
      id: '1',
      rentalId: '1',
      dressId: '2',
      dressName: 'Baby, the Stars 玫瑰庭园 OP',
      userName: '小美',
      fitScore: 4,
      bustFit: 'perfect',
      waistFit: 'loose',
      hipFit: 'perfect',
      lengthFit: 'perfect',
      comfortScore: 5,
      overallSatisfaction: 4,
      feedback: '裙子非常漂亮，做工精细，玫瑰印花很有质感。腰部稍微有点松，但系上腰带就很好看了。',
      suggestions: '建议搭配浅色裙撑，效果会更蓬更可爱。',
      willRentAgain: true,
      createdAt: '2026-06-19',
    },
    {
      id: '2',
      rentalId: '2',
      dressId: '1',
      dressName: 'Angelic Pretty 云境花影 JSK',
      userName: '玲玲',
      fitScore: 5,
      bustFit: 'perfect',
      waistFit: 'perfect',
      hipFit: 'perfect',
      lengthFit: 'perfect',
      comfortScore: 5,
      overallSatisfaction: 5,
      feedback: '超级喜欢！云境花影的柄图真的太美了，蓝色很显白。尺码非常合适，穿着也很舒服，漫展出片率超高。',
      suggestions: '建议搭配白色蕾丝内搭和蓬蓬裙撑，再配上同色系发带，整体造型超完整。',
      willRentAgain: true,
      createdAt: '2026-07-05',
    },
  ];

  create(createFittingDto: CreateFittingDto, rentalData?: { dressId: string; dressName: string; userName: string }): Fitting {
    const newFitting: Fitting = {
      id: Date.now().toString(),
      ...createFittingDto,
      dressId: rentalData?.dressId || '',
      dressName: rentalData?.dressName || '',
      userName: rentalData?.userName || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.fittings.push(newFitting);
    return newFitting;
  }

  findAll(): Fitting[] {
    return this.fittings;
  }

  findOne(id: string): Fitting {
    const fitting = this.fittings.find((f) => f.id === id);
    if (!fitting) {
      throw new NotFoundException(`Fitting with id ${id} not found`);
    }
    return fitting;
  }

  findByDressId(dressId: string): Fitting[] {
    return this.fittings.filter((f) => f.dressId === dressId);
  }

  findByRentalId(rentalId: string): Fitting | undefined {
    return this.fittings.find((f) => f.rentalId === rentalId);
  }

  update(id: string, updateFittingDto: UpdateFittingDto): Fitting {
    const fittingIndex = this.fittings.findIndex((f) => f.id === id);
    if (fittingIndex === -1) {
      throw new NotFoundException(`Fitting with id ${id} not found`);
    }
    this.fittings[fittingIndex] = {
      ...this.fittings[fittingIndex],
      ...updateFittingDto,
    };
    return this.fittings[fittingIndex];
  }

  remove(id: string): void {
    const fittingIndex = this.fittings.findIndex((f) => f.id === id);
    if (fittingIndex === -1) {
      throw new NotFoundException(`Fitting with id ${id} not found`);
    }
    this.fittings.splice(fittingIndex, 1);
  }
}
