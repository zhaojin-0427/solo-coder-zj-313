import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental, FitRiskAssessment, UserInfo, OutfitRentalItem } from './entities/rental.entity';
import { DressesService } from '../dresses/dresses.service';
import { FittingsService } from '../fittings/fittings.service';
import { OutfitsService } from '../outfits/outfits.service';
import { ConsignmentsService } from '../consignments/consignments.service';

@Injectable()
export class RentalsService {
  private rentals: Rental[] = [
    {
      id: '1',
      dressId: '2',
      dressName: 'Baby, the Stars 玫瑰庭园 OP',
      isOutfitRental: false,
      userInfo: {
        name: '小美',
        phone: '138****0001',
        height: 165,
        weight: 52,
        bust: 90,
        waist: 72,
        hip: 94,
        tryOnPreference: '希望稍微宽松一些',
        usageScenario: '生日派对',
        notes: '第一次租lo裙',
      },
      startDate: '2026-06-18',
      endDate: '2026-06-22',
      totalDays: 4,
      totalPrice: 480,
      deposit: 800,
      status: 'in_progress',
      fitRiskAssessment: {
        riskLevel: 'low',
        score: 15,
        factors: ['胸围在尺码范围内', '腰围在尺码范围内'],
        suggestions: ['建议搭配薄款裙撑', '可以放心穿着'],
      },
      createdAt: '2026-06-10',
    },
    {
      id: '2',
      dressId: '1',
      dressName: 'Angelic Pretty 云境花影 JSK',
      outfitId: '1',
      outfitName: '云端花嫁',
      isOutfitRental: true,
      outfitItems: [
        {
          id: '1',
          name: 'Angelic Pretty 云境花影 JSK',
          type: 'dress',
          typeName: '主裙',
          isCore: true,
          deposit: 500,
          dailyPrice: 89,
        },
        {
          id: 'acc-1',
          name: '白色蕾丝头纱',
          type: 'accessory',
          typeName: '配件',
          isCore: false,
          deposit: 100,
          dailyPrice: 15,
        },
        {
          id: 'kc-1',
          name: '珍珠蝴蝶结发带',
          type: 'kc',
          typeName: 'KC',
          isCore: false,
          deposit: 80,
          dailyPrice: 10,
        },
        {
          id: 'petticoat-1',
          name: '白色蓬蓬裙撑',
          type: 'petticoat',
          typeName: '衬裙',
          isCore: false,
          deposit: 60,
          dailyPrice: 8,
        },
        {
          id: 'shoes-1',
          name: '白色蕾丝高跟鞋',
          type: 'shoes_bag',
          typeName: '鞋包',
          isCore: false,
          deposit: 150,
          dailyPrice: 20,
        },
      ],
      userInfo: {
        name: '玲玲',
        phone: '139****0002',
        height: 158,
        weight: 48,
        bust: 86,
        waist: 68,
        hip: 90,
        tryOnPreference: '喜欢修身效果',
        usageScenario: '婚纱照',
        notes: '租了全套套装拍婚纱照',
      },
      startDate: '2026-07-01',
      endDate: '2026-07-07',
      totalDays: 6,
      totalPrice: 990,
      deposit: 1060,
      status: 'confirmed',
      fitRiskAssessment: {
        riskLevel: 'low',
        score: 10,
        factors: ['身材比例标准', '尺码非常合适'],
        suggestions: ['搭配蓬蓬裙撑效果更佳', '建议穿白色打底衫'],
      },
      createdAt: '2026-06-15',
    },
    {
      id: '3',
      dressId: '5',
      dressName: 'Alice and the Pirates 海盗船 OP',
      outfitId: '3',
      outfitName: '海盗冒险',
      isOutfitRental: true,
      outfitItems: [
        {
          id: '5',
          name: 'Alice and the Pirates 海盗船 OP',
          type: 'dress',
          typeName: '主裙',
          isCore: true,
          deposit: 700,
          dailyPrice: 99,
        },
        {
          id: 'acc-3',
          name: '海盗三角帽',
          type: 'accessory',
          typeName: '配件',
          isCore: false,
          deposit: 100,
          dailyPrice: 15,
        },
        {
          id: 'kc-3',
          name: '骷髅发饰套装',
          type: 'kc',
          typeName: 'KC',
          isCore: false,
          deposit: 60,
          dailyPrice: 8,
        },
        {
          id: 'petticoat-3',
          name: '黑色鱼骨裙撑',
          type: 'petticoat',
          typeName: '衬裙',
          isCore: false,
          deposit: 80,
          dailyPrice: 10,
        },
      ],
      userInfo: {
        name: '酷酷',
        phone: '137****0003',
        height: 172,
        weight: 65,
        bust: 98,
        waist: 80,
        hip: 100,
        tryOnPreference: '希望不紧绷',
        usageScenario: '漫展',
        notes: '身高较高，担心长度不够，租了全套套装',
      },
      startDate: '2026-08-01',
      endDate: '2026-08-07',
      totalDays: 6,
      totalPrice: 1134,
      deposit: 1340,
      status: 'pending',
      fitRiskAssessment: {
        riskLevel: 'medium',
        score: 55,
        factors: ['胸围接近上限', '身高较高，裙长可能偏短'],
        suggestions: ['建议试穿后再决定', '可以搭配长款衬裙', '考虑搭配高跟鞋'],
      },
      createdAt: '2026-06-16',
    },
  ];

  constructor(
    private readonly dressesService: DressesService,
    private readonly fittingsService: FittingsService,
    @Inject(forwardRef(() => OutfitsService))
    private readonly outfitsService: OutfitsService,
    @Inject(forwardRef(() => ConsignmentsService))
    private readonly consignmentsService: ConsignmentsService,
  ) {}

  create(createRentalDto: CreateRentalDto): Rental {
    if (createRentalDto.isOutfitRental) {
      return this.createOutfitRental(createRentalDto);
    } else {
      return this.createSingleRental(createRentalDto);
    }
  }

  private createSingleRental(createRentalDto: CreateRentalDto): Rental {
    if (!createRentalDto.dressId) {
      throw new BadRequestException('请选择裙子');
    }

    const dress = this.dressesService.findOne(createRentalDto.dressId);

    if (this.consignmentsService.isDressLockedForRental(createRentalDto.dressId)) {
      throw new BadRequestException('该裙子正在寄售议价或已成交，无法预约租赁');
    }
    const start = new Date(createRentalDto.startDate);
    const end = new Date(createRentalDto.endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = totalDays * dress.dailyPrice;

    const fitRiskAssessment = this.assessFitRisk(
      createRentalDto.userInfo,
      dress.sizeRange,
      createRentalDto.dressId,
    );

    const newRental: Rental = {
      id: Date.now().toString(),
      dressId: createRentalDto.dressId,
      dressName: dress.name,
      isOutfitRental: false,
      userInfo: createRentalDto.userInfo,
      startDate: createRentalDto.startDate,
      endDate: createRentalDto.endDate,
      totalDays,
      totalPrice,
      deposit: dress.deposit,
      status: 'pending',
      fitRiskAssessment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.rentals.push(newRental);
    return newRental;
  }

  private createOutfitRental(createRentalDto: CreateRentalDto): Rental {
    if (!createRentalDto.outfitId) {
      throw new BadRequestException('请选择套装方案');
    }

    const outfit = this.outfitsService.findOne(createRentalDto.outfitId);
    const availability = this.outfitsService.checkAvailability(
      createRentalDto.outfitId,
      createRentalDto.startDate,
      createRentalDto.endDate,
    );

    const hasCoreUnavailable = availability.unavailableItems.some((item) => item.isCore);
    if (hasCoreUnavailable) {
      const coreUnavailable = availability.unavailableItems.filter((item) => item.isCore);
      throw new BadRequestException(
        `核心单品不可租：${coreUnavailable.map((i) => i.name).join('、')}`,
      );
    }

    const dressItem = outfit.items.find((item) => item.type === 'dress');
    if (!dressItem) {
      throw new BadRequestException('套装方案不包含主裙');
    }

    const dress = this.dressesService.findOne(dressItem.id);

    if (this.consignmentsService.isDressLockedForRental(dressItem.id)) {
      throw new BadRequestException('套装中主裙正在寄售议价或已成交，无法预约租赁');
    }

    const start = new Date(createRentalDto.startDate);
    const end = new Date(createRentalDto.endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = totalDays * outfit.totalDailyPrice;

    const fitRiskAssessment = this.assessFitRisk(
      createRentalDto.userInfo,
      dress.sizeRange,
      dressItem.id,
    );

    const heightRisk = this.assessHeightRisk(createRentalDto.userInfo.height, outfit.recommendedHeightRange);
    if (heightRisk) {
      fitRiskAssessment.factors.push(heightRisk.factor);
      if (heightRisk.suggestion) {
        fitRiskAssessment.suggestions.push(heightRisk.suggestion);
      }
      fitRiskAssessment.score += heightRisk.score;
    }

    const sizeRisk = this.assessSizeRisk(createRentalDto.userInfo, outfit.recommendedSizeRange);
    if (sizeRisk) {
      fitRiskAssessment.factors.push(sizeRisk.factor);
      if (sizeRisk.suggestion) {
        fitRiskAssessment.suggestions.push(sizeRisk.suggestion);
      }
      fitRiskAssessment.score += sizeRisk.score;
    }

    fitRiskAssessment.score = Math.max(0, Math.min(100, fitRiskAssessment.score));
    if (fitRiskAssessment.score >= 60) {
      fitRiskAssessment.riskLevel = 'high';
    } else if (fitRiskAssessment.score >= 30) {
      fitRiskAssessment.riskLevel = 'medium';
    }

    const outfitItems: OutfitRentalItem[] = outfit.items.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      typeName: item.typeName,
      isCore: item.isCore,
      deposit: item.deposit,
      dailyPrice: item.dailyPrice,
    }));

    const newRental: Rental = {
      id: Date.now().toString(),
      dressId: dressItem.id,
      dressName: dress.name,
      outfitId: outfit.id,
      outfitName: outfit.themeName,
      outfitItems,
      isOutfitRental: true,
      userInfo: createRentalDto.userInfo,
      startDate: createRentalDto.startDate,
      endDate: createRentalDto.endDate,
      totalDays,
      totalPrice,
      deposit: outfit.totalDeposit,
      status: 'pending',
      fitRiskAssessment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.rentals.push(newRental);
    this.outfitsService.incrementRentalCount(outfit.id);
    return newRental;
  }

  private assessHeightRisk(
    height: number,
    heightRange: { min: number; max: number },
  ): { factor: string; suggestion?: string; score: number } | null {
    if (height < heightRange.min) {
      return {
        factor: `身高 ${height}cm 低于推荐区间 ${heightRange.min}-${heightRange.max}cm`,
        suggestion: '建议搭配高跟鞋，或考虑调整裙长',
        score: 10,
      };
    } else if (height > heightRange.max) {
      return {
        factor: `身高 ${height}cm 高于推荐区间 ${heightRange.min}-${heightRange.max}cm`,
        suggestion: '建议搭配长款衬裙，或考虑穿平底鞋',
        score: 15,
      };
    }
    return null;
  }

  private assessSizeRisk(
    userInfo: UserInfo,
    sizeRange: { min: string; max: string },
  ): { factor: string; suggestion?: string; score: number } | null {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const userSize = this.estimateUserSize(userInfo);
    const minIndex = sizeOrder.indexOf(sizeRange.min);
    const maxIndex = sizeOrder.indexOf(sizeRange.max);
    const userIndex = sizeOrder.indexOf(userSize);

    if (userIndex < minIndex) {
      return {
        factor: `预估尺码 ${userSize} 小于推荐区间 ${sizeRange.min}-${sizeRange.max}`,
        suggestion: '建议搭配腰带收腰，或考虑选择更小码的套装',
        score: 8,
      };
    } else if (userIndex > maxIndex) {
      return {
        factor: `预估尺码 ${userSize} 大于推荐区间 ${sizeRange.min}-${sizeRange.max}`,
        suggestion: '建议慎重考虑，可能会有紧绷感',
        score: 20,
      };
    }
    return null;
  }

  private estimateUserSize(userInfo: UserInfo): string {
    const bust = userInfo.bust;
    const waist = userInfo.waist;

    if (bust < 80 && waist < 62) return 'XS';
    if (bust < 86 && waist < 68) return 'S';
    if (bust < 94 && waist < 76) return 'M';
    if (bust < 102 && waist < 84) return 'L';
    if (bust < 110 && waist < 92) return 'XL';
    return 'XXL';
  }

  findAll(): Rental[] {
    return this.rentals;
  }

  findOne(id: string): Rental {
    const rental = this.rentals.find((r) => r.id === id);
    if (!rental) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    return rental;
  }

  update(id: string, updateRentalDto: UpdateRentalDto): Rental {
    const rentalIndex = this.rentals.findIndex((r) => r.id === id);
    if (rentalIndex === -1) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    this.rentals[rentalIndex] = {
      ...this.rentals[rentalIndex],
      ...updateRentalDto,
    } as Rental;
    return this.rentals[rentalIndex];
  }

  remove(id: string): void {
    const rentalIndex = this.rentals.findIndex((r) => r.id === id);
    if (rentalIndex === -1) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    this.rentals.splice(rentalIndex, 1);
  }

  assessFitRisk(
    userInfo: UserInfo,
    sizeRange: { bust: { min: number; max: number }; waist: { min: number; max: number }; hip: { min: number; max: number }; length: number },
    dressId: string,
  ): FitRiskAssessment {
    let score = 0;
    const factors: string[] = [];
    const suggestions: string[] = [];

    const bustRange = sizeRange.bust.max - sizeRange.bust.min;
    const waistRange = sizeRange.waist.max - sizeRange.waist.min;
    const hipRange = sizeRange.hip.max - sizeRange.hip.min;

    const bustMid = (sizeRange.bust.max + sizeRange.bust.min) / 2;
    const waistMid = (sizeRange.waist.max + sizeRange.waist.min) / 2;
    const hipMid = (sizeRange.hip.max + sizeRange.hip.min) / 2;

    if (userInfo.bust < sizeRange.bust.min) {
      score += 20;
      factors.push('胸围小于最小尺码');
      suggestions.push('可能会比较宽松，建议搭配胸垫');
    } else if (userInfo.bust > sizeRange.bust.max) {
      score += 30;
      factors.push('胸围超过最大尺码');
      suggestions.push('可能会紧绷，建议慎重考虑');
    } else {
      const bustDeviation = Math.abs(userInfo.bust - bustMid) / bustRange;
      score += bustDeviation * 15;
      if (bustDeviation < 0.3) {
        factors.push('胸围在尺码中间位置，非常合适');
      } else {
        factors.push('胸围在尺码范围内');
      }
    }

    if (userInfo.waist < sizeRange.waist.min) {
      score += 15;
      factors.push('腰围小于最小尺码');
      suggestions.push('腰部可能会松，可以系腰带装饰');
    } else if (userInfo.waist > sizeRange.waist.max) {
      score += 25;
      factors.push('腰围超过最大尺码');
      suggestions.push('腰部可能紧绷，建议选择更大码');
    } else {
      const waistDeviation = Math.abs(userInfo.waist - waistMid) / waistRange;
      score += waistDeviation * 10;
      factors.push('腰围在尺码范围内');
    }

    if (userInfo.hip < sizeRange.hip.min) {
      score += 10;
      factors.push('臀围小于最小尺码');
    } else if (userInfo.hip > sizeRange.hip.max) {
      score += 20;
      factors.push('臀围超过最大尺码');
      suggestions.push('臀部可能紧绷');
    } else {
      const hipDeviation = Math.abs(userInfo.hip - hipMid) / hipRange;
      score += hipDeviation * 8;
      factors.push('臀围在尺码范围内');
    }

    const estimatedLength = userInfo.height * 0.55;
    if (sizeRange.length < estimatedLength - 5) {
      score += 15;
      factors.push('裙长可能偏短');
      suggestions.push('建议搭配长款衬裙或安全裤');
    } else if (sizeRange.length > estimatedLength + 10) {
      score += 5;
      factors.push('裙长可能偏长');
      suggestions.push('可以穿高跟鞋调整比例');
    }

    const fittings = this.fittingsService.findByDressId(dressId);
    if (fittings.length > 0) {
      const avgFitScore = fittings.reduce((sum, f) => sum + f.fitScore, 0) / fittings.length;
      if (avgFitScore < 3) {
        score += 10;
        factors.push(`历史试穿平均合身度评分较低(${avgFitScore.toFixed(1)}/5)`);
        suggestions.push('建议参考其他用户的试穿反馈');
      } else if (avgFitScore >= 4) {
        score -= 5;
        factors.push(`历史试穿平均合身度评分良好(${avgFitScore.toFixed(1)}/5)`);
      }
    }

    score = Math.max(0, Math.min(100, score));

    let riskLevel: 'low' | 'medium' | 'high';
    if (score < 30) {
      riskLevel = 'low';
      if (suggestions.length === 0) {
        suggestions.push('尺码非常合适，可以放心穿着');
      }
    } else if (score < 60) {
      riskLevel = 'medium';
      suggestions.push('建议试穿后确认是否合适');
    } else {
      riskLevel = 'high';
      suggestions.unshift('合身风险较高，建议慎重选择');
    }

    return {
      riskLevel,
      score: Math.round(score),
      factors,
      suggestions,
    };
  }

  getFitRisk(dressId: string, userInfo: UserInfo): FitRiskAssessment {
    const dress = this.dressesService.findOne(dressId);
    return this.assessFitRisk(userInfo, dress.sizeRange, dressId);
  }

  getOutfitFitRisk(outfitId: string, userInfo: UserInfo): FitRiskAssessment {
    const outfit = this.outfitsService.findOne(outfitId);
    const dressItem = outfit.items.find((item) => item.type === 'dress');
    if (!dressItem) {
      throw new BadRequestException('套装方案不包含主裙');
    }
    const dress = this.dressesService.findOne(dressItem.id);
    return this.assessFitRisk(userInfo, dress.sizeRange, dressItem.id);
  }
}
