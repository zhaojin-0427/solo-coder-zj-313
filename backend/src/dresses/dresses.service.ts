import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDressDto } from './dto/create-dress.dto';
import { UpdateDressDto } from './dto/update-dress.dto';
import { Dress } from './entities/dress.entity';

@Injectable()
export class DressesService {
  private dresses: Dress[] = [
    {
      id: '1',
      name: 'Angelic Pretty 云境花影 JSK',
      brand: 'Angelic Pretty',
      series: '云境花影',
      print: '云朵与花朵印花',
      silhouette: 'JSK 无袖连衣裙',
      color: 'sax 蓝色',
      size: 'M',
      sizeRange: {
        bust: { min: 82, max: 92 },
        waist: { min: 64, max: 74 },
        hip: { min: 86, max: 96 },
        length: 92,
      },
      flaws: [
        { location: '裙摆内侧', description: '轻微勾丝', severity: 'minor' },
      ],
      accessories: [
        { name: '原配发带', quantity: 1, condition: '完好' },
        { name: '蝴蝶结胸针', quantity: 2, condition: '完好' },
      ],
      rentalSlots: [
        { startDate: '2026-06-20', endDate: '2026-06-25', isAvailable: true },
        { startDate: '2026-07-01', endDate: '2026-07-07', isAvailable: false },
      ],
      consignment: {
        ownerName: '小樱',
        ownerPhone: '138****1234',
        consignmentStartDate: '2026-01-01',
        consignmentEndDate: '2026-12-31',
        commissionRate: 0.3,
        basePrice: 2800,
        status: 'active',
      },
      dailyPrice: 89,
      deposit: 500,
      status: 'available',
      coverImage: 'dress1.jpg',
      description: '超可爱的云朵印花jsk，搭配蓬蓬裙撑效果更佳',
      createdAt: '2026-01-15',
    },
    {
      id: '2',
      name: 'Baby, the Stars 玫瑰庭园 OP',
      brand: 'Baby, the Stars Shine Bright',
      series: '玫瑰庭园',
      print: '玫瑰藤蔓印花',
      silhouette: 'OP 有袖连衣裙',
      color: '酒红色',
      size: 'L',
      sizeRange: {
        bust: { min: 88, max: 100 },
        waist: { min: 70, max: 82 },
        hip: { min: 92, max: 104 },
        length: 98,
      },
      flaws: [],
      accessories: [
        { name: '原配头纱', quantity: 1, condition: '完好' },
        { name: '蕾丝手套', quantity: 1, condition: '轻微泛黄' },
      ],
      rentalSlots: [
        { startDate: '2026-06-18', endDate: '2026-06-22', isAvailable: false },
        { startDate: '2026-07-10', endDate: '2026-07-15', isAvailable: true },
      ],
      consignment: {
        ownerName: '莉莉丝',
        ownerPhone: '139****5678',
        consignmentStartDate: '2026-03-01',
        consignmentEndDate: '2027-03-01',
        commissionRate: 0.25,
        basePrice: 3500,
        status: 'active',
      },
      dailyPrice: 120,
      deposit: 800,
      status: 'rented',
      coverImage: 'dress2.jpg',
      description: '经典酒红色玫瑰印花，优雅又有气场',
      createdAt: '2026-02-20',
    },
    {
      id: '3',
      name: 'Meta 猫咪茶会 JSK',
      brand: 'Metamorphose',
      series: '猫咪茶会',
      print: '猫咪与茶具印花',
      silhouette: 'JSK 背带裙',
      color: '生成色',
      size: 'F 均码',
      sizeRange: {
        bust: { min: 80, max: 98 },
        waist: { min: 62, max: 80 },
        hip: { min: 84, max: 102 },
        length: 90,
      },
      flaws: [
        { location: '后背系带', description: '轻微起球', severity: 'minor' },
        { location: '裙摆下摆', description: '小污渍', severity: 'moderate' },
      ],
      accessories: [
        { name: '猫咪徽章', quantity: 1, condition: '完好' },
      ],
      rentalSlots: [
        { startDate: '2026-06-25', endDate: '2026-06-30', isAvailable: true },
      ],
      consignment: {
        ownerName: '喵喵',
        ownerPhone: '137****9012',
        consignmentStartDate: '2026-02-15',
        consignmentEndDate: '2026-08-15',
        commissionRate: 0.35,
        basePrice: 1800,
        status: 'active',
      },
      dailyPrice: 65,
      deposit: 300,
      status: 'available',
      coverImage: 'dress3.jpg',
      description: '可爱的猫咪茶会主题，日常穿也不夸张',
      createdAt: '2026-01-05',
    },
    {
      id: '4',
      name: 'Innocent World 古典书柜 JSK',
      brand: 'Innocent World',
      series: '古典书柜',
      print: '书架与书籍印花',
      silhouette: 'JSK 无袖连衣裙',
      color: '绀色',
      size: 'M',
      sizeRange: {
        bust: { min: 84, max: 94 },
        waist: { min: 66, max: 76 },
        hip: { min: 88, max: 98 },
        length: 95,
      },
      flaws: [],
      accessories: [
        { name: '书型背包', quantity: 1, condition: '完好' },
        { name: '领结', quantity: 1, condition: '完好' },
      ],
      rentalSlots: [
        { startDate: '2026-07-05', endDate: '2026-07-12', isAvailable: true },
      ],
      consignment: {
        ownerName: '书虫小姐',
        ownerPhone: '136****3456',
        consignmentStartDate: '2026-04-01',
        consignmentEndDate: '2026-10-01',
        commissionRate: 0.28,
        basePrice: 2500,
        status: 'active',
      },
      dailyPrice: 78,
      deposit: 500,
      status: 'cleaning',
      coverImage: 'dress4.jpg',
      description: '古典学院风，适合图书馆和下午茶',
      createdAt: '2026-03-10',
    },
    {
      id: '5',
      name: 'Alice and the Pirates 海盗船 OP',
      brand: 'Alice and the Pirates',
      series: '海盗船',
      print: '海盗船与宝箱印花',
      silhouette: 'OP 长袖连衣裙',
      color: '黑色',
      size: 'L',
      sizeRange: {
        bust: { min: 90, max: 102 },
        waist: { min: 72, max: 84 },
        hip: { min: 94, max: 106 },
        length: 100,
      },
      flaws: [
        { location: '袖口蕾丝', description: '轻微磨损', severity: 'minor' },
      ],
      accessories: [
        { name: '海盗帽', quantity: 1, condition: '完好' },
        { name: '腰封', quantity: 1, condition: '完好' },
        { name: '项链', quantity: 1, condition: '完好' },
      ],
      rentalSlots: [
        { startDate: '2026-08-01', endDate: '2026-08-07', isAvailable: true },
      ],
      consignment: {
        ownerName: '船长杰克',
        ownerPhone: '135****7890',
        consignmentStartDate: '2026-05-01',
        consignmentEndDate: '2026-11-01',
        commissionRate: 0.32,
        basePrice: 3200,
        status: 'active',
      },
      dailyPrice: 99,
      deposit: 700,
      status: 'available',
      coverImage: 'dress5.jpg',
      description: '帅气的海盗主题，酷女孩必备',
      createdAt: '2026-04-20',
    },
  ];

  create(createDressDto: CreateDressDto): Dress {
    const rentalSlots = createDressDto.rentalSlots.map((slot) => ({
      ...slot,
      isAvailable: slot.isAvailable ?? true,
    }));
    const newDress: Dress = {
      id: Date.now().toString(),
      ...createDressDto,
      rentalSlots,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.dresses.push(newDress);
    return newDress;
  }

  findAll(): Dress[] {
    return this.dresses;
  }

  findOne(id: string): Dress {
    const dress = this.dresses.find((d) => d.id === id);
    if (!dress) {
      throw new NotFoundException(`Dress with id ${id} not found`);
    }
    return dress;
  }

  update(id: string, updateDressDto: UpdateDressDto): Dress {
    const dressIndex = this.dresses.findIndex((d) => d.id === id);
    if (dressIndex === -1) {
      throw new NotFoundException(`Dress with id ${id} not found`);
    }
    const updated: Dress = {
      ...this.dresses[dressIndex],
      ...updateDressDto,
    } as Dress;
    if (updateDressDto.rentalSlots) {
      updated.rentalSlots = updateDressDto.rentalSlots.map((slot) => ({
        startDate: slot.startDate,
        endDate: slot.endDate,
        isAvailable: slot.isAvailable ?? true,
      }));
    }
    this.dresses[dressIndex] = updated;
    return this.dresses[dressIndex];
  }

  remove(id: string): void {
    const dressIndex = this.dresses.findIndex((d) => d.id === id);
    if (dressIndex === -1) {
      throw new NotFoundException(`Dress with id ${id} not found`);
    }
    this.dresses.splice(dressIndex, 1);
  }

  findAvailable(startDate: string, endDate: string): Dress[] {
    return this.dresses.filter((dress) => {
      return dress.rentalSlots.some(
        (slot) =>
          slot.isAvailable &&
          slot.startDate <= startDate &&
          slot.endDate >= endDate,
      );
    });
  }
}
