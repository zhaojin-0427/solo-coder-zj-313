import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';
import { Outfit, OutfitAvailabilityCheckResult } from './entities/outfit.entity';
import { DressesService } from '../dresses/dresses.service';
import { RentalsService } from '../rentals/rentals.service';

@Injectable()
export class OutfitsService {
  private outfits: Outfit[] = [
    {
      id: '1',
      themeName: '云端花嫁',
      applicableScenario: '婚纱照',
      recommendedHeightRange: { min: 155, max: 175 },
      recommendedSizeRange: { min: 'S', max: 'L' },
      items: [
        {
          id: '1',
          name: 'Angelic Pretty 云境花影 JSK',
          type: 'dress',
          typeName: '主裙',
          isCore: true,
          deposit: 500,
          dailyPrice: 89,
          status: 'available',
        },
        {
          id: 'acc-1',
          name: '白色蕾丝头纱',
          type: 'accessory',
          typeName: '配件',
          isCore: false,
          deposit: 100,
          dailyPrice: 15,
          status: 'available',
        },
        {
          id: 'kc-1',
          name: '珍珠蝴蝶结发带',
          type: 'kc',
          typeName: 'KC',
          isCore: false,
          deposit: 80,
          dailyPrice: 10,
          status: 'available',
        },
        {
          id: 'petticoat-1',
          name: '白色蓬蓬裙撑',
          type: 'petticoat',
          typeName: '衬裙',
          isCore: false,
          deposit: 60,
          dailyPrice: 8,
          status: 'available',
        },
        {
          id: 'shoes-1',
          name: '白色蕾丝高跟鞋',
          type: 'shoes_bag',
          typeName: '鞋包',
          isCore: false,
          deposit: 150,
          dailyPrice: 20,
          status: 'available',
        },
        {
          id: 'wig-1',
          name: '浅金色长卷发假发',
          type: 'wig',
          typeName: '假发',
          isCore: false,
          deposit: 120,
          dailyPrice: 18,
          status: 'available',
        },
        {
          id: 'prop-1',
          name: '复古手捧花',
          type: 'photo_prop',
          typeName: '摄影道具',
          isCore: false,
          deposit: 50,
          dailyPrice: 5,
          status: 'available',
        },
      ],
      totalDeposit: 1060,
      totalDailyPrice: 165,
      rentalSlots: [
        { startDate: '2026-06-18', endDate: '2026-06-25', isAvailable: true },
        { startDate: '2026-07-01', endDate: '2026-07-10', isAvailable: true },
        { startDate: '2026-07-15', endDate: '2026-07-25', isAvailable: false },
      ],
      description: '梦幻云端主题，适合婚纱照拍摄，搭配浅金色假发和白色高跟鞋更显气质',
      coverImage: 'outfit1.jpg',
      status: 'active',
      rentalCount: 8,
      createdAt: '2026-03-01',
    },
    {
      id: '2',
      themeName: '玫瑰晚宴',
      applicableScenario: '生日派对',
      recommendedHeightRange: { min: 158, max: 180 },
      recommendedSizeRange: { min: 'M', max: 'XL' },
      items: [
        {
          id: '2',
          name: 'Baby, the Stars 玫瑰庭园 OP',
          type: 'dress',
          typeName: '主裙',
          isCore: true,
          deposit: 800,
          dailyPrice: 120,
          status: 'rented',
        },
        {
          id: 'acc-2',
          name: '酒红色丝绒颈饰',
          type: 'accessory',
          typeName: '配件',
          isCore: false,
          deposit: 80,
          dailyPrice: 12,
          status: 'available',
        },
        {
          id: 'kc-2',
          name: '玫瑰花朵礼帽',
          type: 'kc',
          typeName: 'KC',
          isCore: false,
          deposit: 100,
          dailyPrice: 15,
          status: 'available',
        },
        {
          id: 'petticoat-2',
          name: '黑色蓬蓬裙撑',
          type: 'petticoat',
          typeName: '衬裙',
          isCore: false,
          deposit: 60,
          dailyPrice: 8,
          status: 'available',
        },
        {
          id: 'shoes-2',
          name: '酒红色尖头高跟鞋',
          type: 'shoes_bag',
          typeName: '鞋包',
          isCore: false,
          deposit: 180,
          dailyPrice: 25,
          status: 'available',
        },
        {
          id: 'bag-2',
          name: '黑色缎面手提包',
          type: 'shoes_bag',
          typeName: '鞋包',
          isCore: false,
          deposit: 120,
          dailyPrice: 18,
          status: 'available',
        },
      ],
      totalDeposit: 1340,
      totalDailyPrice: 198,
      rentalSlots: [
        { startDate: '2026-06-20', endDate: '2026-06-30', isAvailable: true },
        { startDate: '2026-07-05', endDate: '2026-07-15', isAvailable: true },
      ],
      description: '优雅酒红色系，适合生日派对和晚宴场合，搭配黑色裙撑更显华丽',
      coverImage: 'outfit2.jpg',
      status: 'active',
      rentalCount: 12,
      createdAt: '2026-02-15',
    },
    {
      id: '3',
      themeName: '海盗冒险',
      applicableScenario: '漫展',
      recommendedHeightRange: { min: 160, max: 185 },
      recommendedSizeRange: { min: 'M', max: 'XL' },
      items: [
        {
          id: '5',
          name: 'Alice and the Pirates 海盗船 OP',
          type: 'dress',
          typeName: '主裙',
          isCore: true,
          deposit: 700,
          dailyPrice: 99,
          status: 'available',
        },
        {
          id: 'acc-3',
          name: '海盗三角帽',
          type: 'accessory',
          typeName: '配件',
          isCore: false,
          deposit: 100,
          dailyPrice: 15,
          status: 'available',
        },
        {
          id: 'acc-4',
          name: '黑色皮质腰封',
          type: 'accessory',
          typeName: '配件',
          isCore: false,
          deposit: 80,
          dailyPrice: 12,
          status: 'available',
        },
        {
          id: 'kc-3',
          name: '骷髅发饰套装',
          type: 'kc',
          typeName: 'KC',
          isCore: false,
          deposit: 60,
          dailyPrice: 8,
          status: 'available',
        },
        {
          id: 'petticoat-3',
          name: '黑色鱼骨裙撑',
          type: 'petticoat',
          typeName: '衬裙',
          isCore: false,
          deposit: 80,
          dailyPrice: 10,
          status: 'available',
        },
        {
          id: 'shoes-3',
          name: '黑色马丁靴',
          type: 'shoes_bag',
          typeName: '鞋包',
          isCore: false,
          deposit: 150,
          dailyPrice: 20,
          status: 'available',
        },
        {
          id: 'wig-3',
          name: '黑色长直发假发',
          type: 'wig',
          typeName: '假发',
          isCore: false,
          deposit: 100,
          dailyPrice: 15,
          status: 'maintenance',
        },
        {
          id: 'prop-2',
          name: '复古望远镜道具',
          type: 'photo_prop',
          typeName: '摄影道具',
          isCore: false,
          deposit: 40,
          dailyPrice: 5,
          status: 'available',
        },
        {
          id: 'prop-3',
          name: '海盗地图道具',
          type: 'photo_prop',
          typeName: '摄影道具',
          isCore: false,
          deposit: 30,
          dailyPrice: 5,
          status: 'available',
        },
      ],
      totalDeposit: 1340,
      totalDailyPrice: 189,
      rentalSlots: [
        { startDate: '2026-06-25', endDate: '2026-07-05', isAvailable: true },
        { startDate: '2026-07-20', endDate: '2026-08-01', isAvailable: true },
        { startDate: '2026-08-01', endDate: '2026-08-07', isAvailable: false },
      ],
      description: '帅气海盗主题，适合漫展出片，搭配黑色假发和马丁靴气场十足',
      coverImage: 'outfit3.jpg',
      status: 'active',
      rentalCount: 6,
      createdAt: '2026-04-10',
    },
    {
      id: '4',
      themeName: '猫咪茶会',
      applicableScenario: '日常出街',
      recommendedHeightRange: { min: 150, max: 170 },
      recommendedSizeRange: { min: 'S', max: 'L' },
      items: [
        {
          id: '3',
          name: 'Meta 猫咪茶会 JSK',
          type: 'dress',
          typeName: '主裙',
          isCore: true,
          deposit: 300,
          dailyPrice: 65,
          status: 'available',
        },
        {
          id: 'kc-4',
          name: '猫咪耳朵发箍',
          type: 'kc',
          typeName: 'KC',
          isCore: false,
          deposit: 50,
          dailyPrice: 8,
          status: 'available',
        },
        {
          id: 'acc-5',
          name: '猫咪铃铛项链',
          type: 'accessory',
          typeName: '配件',
          isCore: false,
          deposit: 40,
          dailyPrice: 6,
          status: 'available',
        },
        {
          id: 'petticoat-4',
          name: '生成色日常裙撑',
          type: 'petticoat',
          typeName: '衬裙',
          isCore: false,
          deposit: 50,
          dailyPrice: 6,
          status: 'available',
        },
        {
          id: 'shoes-4',
          name: '圆头玛丽珍鞋',
          type: 'shoes_bag',
          typeName: '鞋包',
          isCore: false,
          deposit: 120,
          dailyPrice: 15,
          status: 'available',
        },
        {
          id: 'bag-4',
          name: '猫咪造型斜挎包',
          type: 'shoes_bag',
          typeName: '鞋包',
          isCore: false,
          deposit: 80,
          dailyPrice: 12,
          status: 'available',
        },
      ],
      totalDeposit: 640,
      totalDailyPrice: 112,
      rentalSlots: [
        { startDate: '2026-06-15', endDate: '2026-06-30', isAvailable: true },
        { startDate: '2026-07-01', endDate: '2026-07-20', isAvailable: true },
      ],
      description: '可爱日常风，适合出街和下午茶，不夸张但又充满细节',
      coverImage: 'outfit4.jpg',
      status: 'active',
      rentalCount: 15,
      createdAt: '2026-01-20',
    },
  ];

  constructor(
    private readonly dressesService: DressesService,
    @Inject(forwardRef(() => RentalsService))
    private readonly rentalsService: RentalsService,
  ) {}

  create(createOutfitDto: CreateOutfitDto): Outfit {
    const rentalSlots = createOutfitDto.rentalSlots.map((slot) => ({
      ...slot,
      isAvailable: slot.isAvailable ?? true,
    }));

    const items = createOutfitDto.items.map((item) => ({
      ...item,
      isCore: item.isCore ?? item.type === 'dress',
    }));

    const newOutfit: Outfit = {
      id: Date.now().toString(),
      ...createOutfitDto,
      items,
      rentalSlots,
      coverImage: createOutfitDto.coverImage || 'default-outfit.jpg',
      status: createOutfitDto.status ?? 'active',
      rentalCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.outfits.push(newOutfit);
    return newOutfit;
  }

  findAll(): Outfit[] {
    return this.outfits;
  }

  findOne(id: string): Outfit {
    const outfit = this.outfits.find((o) => o.id === id);
    if (!outfit) {
      throw new NotFoundException(`Outfit with id ${id} not found`);
    }
    return outfit;
  }

  update(id: string, updateOutfitDto: UpdateOutfitDto): Outfit {
    const outfitIndex = this.outfits.findIndex((o) => o.id === id);
    if (outfitIndex === -1) {
      throw new NotFoundException(`Outfit with id ${id} not found`);
    }

    const updated = {
      ...this.outfits[outfitIndex],
      ...updateOutfitDto,
    } as Outfit;

    if (updateOutfitDto.rentalSlots) {
      updated.rentalSlots = updateOutfitDto.rentalSlots.map((slot) => ({
        startDate: slot.startDate,
        endDate: slot.endDate,
        isAvailable: slot.isAvailable ?? true,
      }));
    }

    if (updateOutfitDto.items) {
      updated.items = updateOutfitDto.items.map((item) => ({
        ...item,
        isCore: item.isCore ?? item.type === 'dress',
      }));
    }

    this.outfits[outfitIndex] = updated;
    return this.outfits[outfitIndex];
  }

  remove(id: string): void {
    const outfitIndex = this.outfits.findIndex((o) => o.id === id);
    if (outfitIndex === -1) {
      throw new NotFoundException(`Outfit with id ${id} not found`);
    }
    this.outfits.splice(outfitIndex, 1);
  }

  checkAvailability(
    outfitId: string,
    startDate: string,
    endDate: string,
  ): OutfitAvailabilityCheckResult {
    const outfit = this.findOne(outfitId);
    const unavailableItems: OutfitAvailabilityCheckResult['unavailableItems'] = [];
    const conflictingRentals: OutfitAvailabilityCheckResult['conflictingRentals'] = [];

    for (const item of outfit.items) {
      if (item.type === 'dress') {
        try {
          const dress = this.dressesService.findOne(item.id);
          if (dress.status !== 'available') {
            unavailableItems.push({
              name: item.name,
              typeName: item.typeName,
              reason: `当前状态：${this.getStatusText(dress.status)}`,
              isCore: item.isCore,
            });
          }

          const hasSlotAvailable = dress.rentalSlots.some(
            (slot) =>
              slot.isAvailable &&
              slot.startDate <= startDate &&
              slot.endDate >= endDate,
          );

          if (!hasSlotAvailable) {
            const conflictingSlot = dress.rentalSlots.find(
              (slot) =>
                !slot.isAvailable &&
                this.dateRangesOverlap(
                  slot.startDate,
                  slot.endDate,
                  startDate,
                  endDate,
                ),
            );
            if (conflictingSlot) {
              conflictingRentals.push({
                itemName: item.name,
                startDate: conflictingSlot.startDate,
                endDate: conflictingSlot.endDate,
              });
            }
            unavailableItems.push({
              name: item.name,
              typeName: item.typeName,
              reason: '所选档期不可用',
              isCore: item.isCore,
            });
          }
        } catch (e) {
          unavailableItems.push({
            name: item.name,
            typeName: item.typeName,
            reason: '服饰信息不存在',
            isCore: item.isCore,
          });
        }
      } else {
        if (item.status !== 'available') {
          unavailableItems.push({
            name: item.name,
            typeName: item.typeName,
            reason: `当前状态：${this.getStatusText(item.status)}`,
            isCore: item.isCore,
          });
        }
      }
    }

    const hasSlotAvailable = outfit.rentalSlots.some(
      (slot) =>
        slot.isAvailable &&
        slot.startDate <= startDate &&
        slot.endDate >= endDate,
    );

    if (!hasSlotAvailable) {
      const conflictingSlot = outfit.rentalSlots.find(
        (slot) =>
          !slot.isAvailable &&
          this.dateRangesOverlap(
            slot.startDate,
            slot.endDate,
            startDate,
            endDate,
          ),
      );
      if (conflictingSlot) {
        conflictingRentals.push({
          itemName: outfit.themeName + '（套装档期）',
          startDate: conflictingSlot.startDate,
          endDate: conflictingSlot.endDate,
        });
      }
    }

    const hasCoreUnavailable = unavailableItems.some((item) => item.isCore);
    const isAvailable =
      !hasCoreUnavailable &&
      unavailableItems.length === 0 &&
      hasSlotAvailable;

    return {
      isAvailable,
      unavailableItems,
      conflictingRentals,
    };
  }

  findAvailable(startDate: string, endDate: string): Outfit[] {
    return this.outfits.filter((outfit) => {
      if (outfit.status !== 'active') return false;

      const checkResult = this.checkAvailability(
        outfit.id,
        startDate,
        endDate,
      );
      return checkResult.isAvailable;
    });
  }

  incrementRentalCount(outfitId: string): void {
    const outfit = this.findOne(outfitId);
    outfit.rentalCount++;
  }

  updateItemStatus(outfitId: string, itemId: string, status: Outfit['items'][0]['status']): void {
    const outfit = this.findOne(outfitId);
    const item = outfit.items.find((i) => i.id === itemId);
    if (item) {
      item.status = status;
    }
  }

  getOutfitStats() {
    const totalOutfits = this.outfits.length;
    const activeOutfits = this.outfits.filter((o) => o.status === 'active').length;
    const totalRentalCount = this.outfits.reduce((sum, o) => sum + o.rentalCount, 0);

    const outfitRentalRates = this.outfits
      .filter((o) => o.status === 'active')
      .map((o) => ({
        outfitId: o.id,
        themeName: o.themeName,
        rentalCount: o.rentalCount,
        rentalRate: o.rentalCount > 0 ? parseFloat(((o.rentalCount / 30) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.rentalCount - a.rentalCount);

    const scenarioStats = this.getScenarioStats();
    const avgSetPrice = this.outfits.length > 0
      ? this.outfits.reduce((sum, o) => sum + o.totalDailyPrice, 0) / this.outfits.length
      : 0;
    const avgSetDeposit = this.outfits.length > 0
      ? this.outfits.reduce((sum, o) => sum + o.totalDeposit, 0) / this.outfits.length
      : 0;

    const accessoryLossStats = this.getAccessoryLossStats();

    return {
      overview: {
        totalOutfits,
        activeOutfits,
        totalRentalCount,
        avgSetPrice: parseFloat(avgSetPrice.toFixed(2)),
        avgSetDeposit: parseFloat(avgSetDeposit.toFixed(2)),
      },
      rentalRates: outfitRentalRates,
      scenarioStats,
      accessoryLossStats,
    };
  }

  getScenarioStats() {
    const scenarioMap = new Map<
      string,
      { count: number; totalRevenue: number }
    >();

    const allRentals = this.rentalsService.findAll();
    const outfitRentals = allRentals.filter((r) => (r as any).outfitId);

    for (const rental of outfitRentals) {
      const outfitId = (rental as any).outfitId;
      const outfit = this.outfits.find((o) => o.id === outfitId);
      if (outfit) {
        const scenario = outfit.applicableScenario;
        const existing = scenarioMap.get(scenario) || {
          count: 0,
          totalRevenue: 0,
        };
        existing.count++;
        existing.totalRevenue += rental.totalPrice;
        scenarioMap.set(scenario, existing);
      }
    }

    for (const outfit of this.outfits) {
      if (!scenarioMap.has(outfit.applicableScenario)) {
        scenarioMap.set(outfit.applicableScenario, {
          count: 0,
          totalRevenue: 0,
        });
      }
    }

    return Array.from(scenarioMap.entries())
      .map(([scenario, data]) => ({
        scenario,
        rentalCount: data.count,
        totalRevenue: parseFloat(data.totalRevenue.toFixed(2)),
      }))
      .sort((a, b) => b.rentalCount - a.rentalCount);
  }

  getAccessoryLossStats() {
    const allReturns = this.rentalsService.findAll();
    const lossMap = new Map<string, { lossCount: number; totalCount: number }>();

    for (const outfit of this.outfits) {
      for (const item of outfit.items) {
        if (item.type !== 'dress') {
          lossMap.set(item.name, { lossCount: 0, totalCount: outfit.rentalCount });
        }
      }
    }

    return Array.from(lossMap.entries())
      .map(([accessory, data]) => ({
        accessory,
        lossCount: data.lossCount,
        totalCount: data.totalCount,
        lossRate: data.totalCount > 0
          ? parseFloat(((data.lossCount / data.totalCount) * 100).toFixed(2))
          : 0,
      }))
      .sort((a, b) => b.lossCount - a.lossCount || b.lossRate - a.lossRate)
      .slice(0, 10);
  }

  private dateRangesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean {
    const s1 = new Date(start1).getTime();
    const e1 = new Date(end1).getTime();
    const s2 = new Date(start2).getTime();
    const e2 = new Date(end2).getTime();
    return s1 <= e2 && e1 >= s2;
  }

  private getStatusText(status: string): string {
    const map: Record<string, string> = {
      available: '可租',
      rented: '已租出',
      cleaning: '清洗中',
      maintenance: '维护中',
    };
    return map[status] || status;
  }
}
