import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateConsignmentDto } from './dto/create-consignment.dto';
import { UpdateConsignmentDto } from './dto/update-consignment.dto';
import { NegotiateDto } from './dto/negotiate.dto';
import { SettleDto } from './dto/settle.dto';
import { ConsignmentRecord, NegotiationRecord } from './entities/consignment.entity';
import { DressesService } from '../dresses/dresses.service';

@Injectable()
export class ConsignmentsService {
  private consignments: ConsignmentRecord[] = [
    {
      id: '1',
      dressId: '1',
      dressName: 'Angelic Pretty 云境花影 JSK',
      brand: 'Angelic Pretty',
      size: 'M',
      print: '云朵与花朵印花',
      consignorName: '小樱',
      consignorPhone: '138****1234',
      consignmentPrice: 2800,
      minimumPrice: 2200,
      commissionRate: 0.3,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      defectDescription: '裙摆内侧有轻微勾丝',
      includedAccessories: [
        { name: '原配发带', quantity: 1, condition: '完好' },
        { name: '蝴蝶结胸针', quantity: 2, condition: '完好' },
      ],
      status: 'active',
      settlementStatus: 'pending',
      finalPrice: 0,
      platformCommission: 0,
      consignorAmount: 0,
      settlementDeadline: '',
      transactionDate: '',
      currentOffer: 0,
      buyerName: '',
      buyerPhone: '',
      negotiations: [],
      notes: '',
      createdAt: '2026-01-15',
      updatedAt: '2026-01-15',
    },
    {
      id: '2',
      dressId: '2',
      dressName: 'Baby, the Stars 玫瑰庭园 OP',
      brand: 'Baby, the Stars Shine Bright',
      size: 'L',
      print: '玫瑰藤蔓印花',
      consignorName: '莉莉丝',
      consignorPhone: '139****5678',
      consignmentPrice: 3500,
      minimumPrice: 2800,
      commissionRate: 0.25,
      startDate: '2026-03-01',
      endDate: '2027-03-01',
      defectDescription: '',
      includedAccessories: [
        { name: '原配头纱', quantity: 1, condition: '完好' },
        { name: '蕾丝手套', quantity: 1, condition: '轻微泛黄' },
      ],
      status: 'negotiating',
      settlementStatus: 'pending',
      finalPrice: 0,
      platformCommission: 0,
      consignorAmount: 0,
      settlementDeadline: '',
      transactionDate: '',
      currentOffer: 3200,
      buyerName: '小红',
      buyerPhone: '136****5555',
      negotiations: [
        {
          id: 'neg-1',
          buyerName: '小红',
          buyerPhone: '136****5555',
          offerPrice: 3200,
          notes: '希望可以包含所有配件',
          createdAt: '2026-06-10',
        },
      ],
      notes: '',
      createdAt: '2026-03-01',
      updatedAt: '2026-06-10',
    },
    {
      id: '3',
      dressId: '3',
      dressName: 'Meta 猫咪茶会 JSK',
      brand: 'Metamorphose',
      size: 'F 均码',
      print: '猫咪与茶具印花',
      consignorName: '喵喵',
      consignorPhone: '137****9012',
      consignmentPrice: 1800,
      minimumPrice: 1400,
      commissionRate: 0.35,
      startDate: '2026-02-15',
      endDate: '2026-08-15',
      defectDescription: '后背系带轻微起球，裙摆下摆有小污渍',
      includedAccessories: [
        { name: '猫咪徽章', quantity: 1, condition: '完好' },
      ],
      status: 'sold',
      settlementStatus: 'processing',
      finalPrice: 1600,
      platformCommission: 560,
      consignorAmount: 1040,
      settlementDeadline: '2026-07-15',
      transactionDate: '2026-06-05',
      currentOffer: 1600,
      buyerName: '茶茶',
      buyerPhone: '133****2222',
      negotiations: [
        {
          id: 'neg-2',
          buyerName: '茶茶',
          buyerPhone: '133****2222',
          offerPrice: 1500,
          notes: '考虑到有瑕疵',
          createdAt: '2026-06-01',
        },
        {
          id: 'neg-3',
          buyerName: '茶茶',
          buyerPhone: '133****2222',
          offerPrice: 1600,
          notes: '加价至1600',
          createdAt: '2026-06-03',
        },
      ],
      notes: '成交价1600，待结算',
      createdAt: '2026-02-15',
      updatedAt: '2026-06-05',
    },
    {
      id: '4',
      dressId: '4',
      dressName: 'Innocent World 古典书柜 JSK',
      brand: 'Innocent World',
      size: 'M',
      print: '书架与书籍印花',
      consignorName: '书虫小姐',
      consignorPhone: '136****3456',
      consignmentPrice: 2500,
      minimumPrice: 2000,
      commissionRate: 0.28,
      startDate: '2026-04-01',
      endDate: '2026-10-01',
      defectDescription: '',
      includedAccessories: [
        { name: '书型背包', quantity: 1, condition: '完好' },
        { name: '领结', quantity: 1, condition: '完好' },
      ],
      status: 'active',
      settlementStatus: 'pending',
      finalPrice: 0,
      platformCommission: 0,
      consignorAmount: 0,
      settlementDeadline: '',
      transactionDate: '',
      currentOffer: 0,
      buyerName: '',
      buyerPhone: '',
      negotiations: [],
      notes: '',
      createdAt: '2026-04-01',
      updatedAt: '2026-04-01',
    },
    {
      id: '5',
      dressId: '5',
      dressName: 'Alice and the Pirates 海盗船 OP',
      brand: 'Alice and the Pirates',
      size: 'L',
      print: '海盗船与宝箱印花',
      consignorName: '船长杰克',
      consignorPhone: '135****7890',
      consignmentPrice: 3200,
      minimumPrice: 2600,
      commissionRate: 0.32,
      startDate: '2026-05-01',
      endDate: '2026-11-01',
      defectDescription: '袖口蕾丝轻微磨损',
      includedAccessories: [
        { name: '海盗帽', quantity: 1, condition: '完好' },
        { name: '腰封', quantity: 1, condition: '完好' },
        { name: '项链', quantity: 1, condition: '完好' },
      ],
      status: 'active',
      settlementStatus: 'pending',
      finalPrice: 0,
      platformCommission: 0,
      consignorAmount: 0,
      settlementDeadline: '',
      transactionDate: '',
      currentOffer: 0,
      buyerName: '',
      buyerPhone: '',
      negotiations: [],
      notes: '',
      createdAt: '2026-05-01',
      updatedAt: '2026-05-01',
    },
  ];

  constructor(private readonly dressesService: DressesService) {}

  create(dto: CreateConsignmentDto): ConsignmentRecord {
    const dress = this.dressesService.findOne(dto.dressId);

    const record: ConsignmentRecord = {
      id: Date.now().toString(),
      dressId: dto.dressId,
      dressName: dress.name,
      brand: dress.brand,
      size: dress.size,
      print: dress.print,
      consignorName: dto.consignorName,
      consignorPhone: dto.consignorPhone,
      consignmentPrice: dto.consignmentPrice,
      minimumPrice: dto.minimumPrice,
      commissionRate: dto.commissionRate,
      startDate: dto.startDate,
      endDate: dto.endDate,
      defectDescription: dto.defectDescription || '',
      includedAccessories: dto.includedAccessories || [],
      status: 'active',
      settlementStatus: 'pending',
      finalPrice: 0,
      platformCommission: 0,
      consignorAmount: 0,
      settlementDeadline: '',
      transactionDate: '',
      currentOffer: 0,
      buyerName: '',
      buyerPhone: '',
      negotiations: [],
      notes: dto.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    this.consignments.push(record);

    this.dressesService.update(dress.id, {
      saleType: 'consignment',
      consignment: {
        ownerName: dto.consignorName,
        ownerPhone: dto.consignorPhone,
        consignmentStartDate: dto.startDate,
        consignmentEndDate: dto.endDate,
        commissionRate: dto.commissionRate,
        basePrice: dto.consignmentPrice,
        status: 'active',
        consignmentPrice: dto.consignmentPrice,
        minimumPrice: dto.minimumPrice,
        defectDescription: dto.defectDescription || '',
        includedAccessories: dto.includedAccessories || [],
        settlementStatus: 'pending',
      },
    });

    return record;
  }

  findAll(): ConsignmentRecord[] {
    return this.consignments;
  }

  findOne(id: string): ConsignmentRecord {
    const record = this.consignments.find((c) => c.id === id);
    if (!record) {
      throw new NotFoundException(`Consignment record with id ${id} not found`);
    }
    return record;
  }

  findByDressId(dressId: string): ConsignmentRecord | undefined {
    return this.consignments.find((c) => c.dressId === dressId);
  }

  findActiveByDressId(dressId: string): ConsignmentRecord | undefined {
    return this.consignments.find(
      (c) => c.dressId === dressId && (c.status === 'active' || c.status === 'negotiating'),
    );
  }

  isDressLockedForRental(dressId: string): boolean {
    const record = this.consignments.find(
      (c) => c.dressId === dressId && (c.status === 'sold' || c.status === 'negotiating'),
    );
    return !!record;
  }

  update(id: string, dto: UpdateConsignmentDto): ConsignmentRecord {
    const index = this.consignments.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Consignment record with id ${id} not found`);
    }
    this.consignments[index] = {
      ...this.consignments[index],
      ...dto,
      updatedAt: new Date().toISOString().split('T')[0],
    } as ConsignmentRecord;
    return this.consignments[index];
  }

  negotiate(id: string, dto: NegotiateDto): ConsignmentRecord {
    const record = this.findOne(id);
    if (record.status !== 'active' && record.status !== 'negotiating') {
      throw new BadRequestException('当前寄售状态不允许议价');
    }

    const negotiation: NegotiationRecord = {
      id: `neg-${Date.now()}`,
      buyerName: dto.buyerName,
      buyerPhone: dto.buyerPhone,
      offerPrice: dto.offerPrice,
      notes: dto.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    record.negotiations.push(negotiation);
    record.status = 'negotiating';
    record.currentOffer = dto.offerPrice;
    record.buyerName = dto.buyerName;
    record.buyerPhone = dto.buyerPhone;
    record.updatedAt = new Date().toISOString().split('T')[0];

    return record;
  }

  completeSale(id: string, finalPrice?: number): ConsignmentRecord {
    const record = this.findOne(id);
    if (record.status !== 'active' && record.status !== 'negotiating') {
      throw new BadRequestException('当前寄售状态不允许成交');
    }

    const price = finalPrice || record.currentOffer || record.consignmentPrice;
    if (price < record.minimumPrice) {
      throw new BadRequestException(
        `成交价 ¥${price} 低于最低成交价 ¥${record.minimumPrice}`,
      );
    }

    const platformCommission = parseFloat((price * record.commissionRate).toFixed(2));
    const consignorAmount = parseFloat((price - platformCommission).toFixed(2));

    const transactionDate = new Date().toISOString().split('T')[0];
    const settlementDeadlineDate = new Date();
    settlementDeadlineDate.setDate(settlementDeadlineDate.getDate() + 30);
    const settlementDeadline = settlementDeadlineDate.toISOString().split('T')[0];

    record.status = 'sold';
    record.finalPrice = price;
    record.platformCommission = platformCommission;
    record.consignorAmount = consignorAmount;
    record.settlementDeadline = settlementDeadline;
    record.transactionDate = transactionDate;
    record.settlementStatus = 'processing';
    record.updatedAt = transactionDate;

    this.dressesService.update(record.dressId, {
      consignment: {
        ...this.dressesService.findOne(record.dressId).consignment,
        status: 'ended',
        settlementStatus: 'processing',
      },
    });

    return record;
  }

  cancel(id: string): ConsignmentRecord {
    const record = this.findOne(id);
    if (record.status === 'sold' && record.settlementStatus === 'settled') {
      throw new BadRequestException('已结算的寄售无法取消');
    }

    record.status = 'cancelled';
    record.updatedAt = new Date().toISOString().split('T')[0];

    this.dressesService.update(record.dressId, {
      saleType: 'self_operated',
      consignment: {
        ...this.dressesService.findOne(record.dressId).consignment,
        status: 'ended',
      },
    });

    return record;
  }

  expire(id: string): ConsignmentRecord {
    const record = this.findOne(id);
    if (record.status === 'sold') {
      throw new BadRequestException('已成交的寄售无法标记为到期');
    }

    record.status = 'expired';
    record.updatedAt = new Date().toISOString().split('T')[0];

    this.dressesService.update(record.dressId, {
      consignment: {
        ...this.dressesService.findOne(record.dressId).consignment,
        status: 'ended',
      },
    });

    return record;
  }

  settle(id: string, dto: SettleDto): ConsignmentRecord {
    const record = this.findOne(id);
    if (record.status !== 'sold') {
      throw new BadRequestException('只有已成交的寄售才能进行结算');
    }

    record.settlementStatus = dto.settlementStatus;
    record.updatedAt = new Date().toISOString().split('T')[0];

    if (dto.settlementStatus === 'settled') {
      this.dressesService.update(record.dressId, {
        consignment: {
          ...this.dressesService.findOne(record.dressId).consignment,
          settlementStatus: 'settled',
        },
      });
    }

    return record;
  }

  remove(id: string): void {
    const index = this.consignments.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Consignment record with id ${id} not found`);
    }
    this.consignments.splice(index, 1);
  }

  getConsignmentStats() {
    const all = this.consignments;
    const active = all.filter((c) => c.status === 'active' || c.status === 'negotiating');
    const sold = all.filter((c) => c.status === 'sold');
    const expired = all.filter((c) => c.status === 'expired');
    const cancelled = all.filter((c) => c.status === 'cancelled');

    const onShelfCount = active.length;
    const totalTransactionAmount = sold.reduce((sum, c) => sum + c.finalPrice, 0);
    const totalPlatformCommission = sold.reduce((sum, c) => sum + c.platformCommission, 0);
    const expiredWithoutSaleCount = expired.length;

    const settledSold = sold.filter((c) => c.settlementStatus === 'settled');
    const processingSold = sold.filter((c) => c.settlementStatus === 'processing');
    const pendingSettlementAmount = processingSold.reduce((sum, c) => sum + c.consignorAmount, 0);

    const avgTransactionCycle =
      sold.length > 0
        ? sold.reduce((sum, c) => {
            const start = new Date(c.startDate);
            const end = new Date(c.transactionDate);
            return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / sold.length
        : 0;

    const brandRanking = this.getRankingByDimension('brand');
    const sizeRanking = this.getRankingByDimension('size');
    const printRanking = this.getRankingByDimension('print');
    const consignorRanking = this.getConsignorRanking();

    return {
      onShelfCount,
      totalTransactionAmount: parseFloat(totalTransactionAmount.toFixed(2)),
      totalPlatformCommission: parseFloat(totalPlatformCommission.toFixed(2)),
      avgTransactionCycle: parseFloat(avgTransactionCycle.toFixed(1)),
      expiredWithoutSaleCount,
      pendingSettlementAmount: parseFloat(pendingSettlementAmount.toFixed(2)),
      soldCount: sold.length,
      cancelledCount: cancelled.length,
      settledCount: settledSold.length,
      brandRanking,
      sizeRanking,
      printRanking,
      consignorRanking,
    };
  }

  private getRankingByDimension(dimension: 'brand' | 'size' | 'print') {
    const sold = this.consignments.filter((c) => c.status === 'sold');
    const map = new Map<string, { name: string; count: number; totalAmount: number }>();

    for (const c of sold) {
      const key = c[dimension];
      const existing = map.get(key) || { name: key, count: 0, totalAmount: 0 };
      existing.count++;
      existing.totalAmount += c.finalPrice;
      map.set(key, existing);
    }

    return Array.from(map.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .map((item) => ({
        ...item,
        totalAmount: parseFloat(item.totalAmount.toFixed(2)),
      }));
  }

  private getConsignorRanking() {
    const sold = this.consignments.filter((c) => c.status === 'sold');
    const map = new Map<string, { name: string; count: number; totalAmount: number }>();

    for (const c of sold) {
      const key = c.consignorName;
      const existing = map.get(key) || { name: key, count: 0, totalAmount: 0 };
      existing.count++;
      existing.totalAmount += c.finalPrice;
      map.set(key, existing);
    }

    return Array.from(map.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .map((item) => ({
        ...item,
        totalAmount: parseFloat(item.totalAmount.toFixed(2)),
      }));
  }
}
