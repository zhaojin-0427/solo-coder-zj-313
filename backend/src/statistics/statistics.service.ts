import { Injectable } from '@nestjs/common';
import { DressesService } from '../dresses/dresses.service';
import { RentalsService } from '../rentals/rentals.service';
import { ReturnsService } from '../returns/returns.service';
import { FittingsService } from '../fittings/fittings.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly dressesService: DressesService,
    private readonly rentalsService: RentalsService,
    private readonly returnsService: ReturnsService,
    private readonly fittingsService: FittingsService,
  ) {}

  getOverview() {
    const dresses = this.dressesService.findAll();
    const rentals = this.rentalsService.findAll();
    const returns = this.returnsService.findAll();
    const fittings = this.fittingsService.findAll();

    const totalDresses = dresses.length;
    const availableDresses = dresses.filter((d) => d.status === 'available').length;
    const rentedDresses = dresses.filter((d) => d.status === 'rented').length;
    const cleaningDresses = dresses.filter((d) => d.status === 'cleaning').length;

    const totalRentals = rentals.length;
    const completedRentals = rentals.filter((r) => r.status === 'completed').length;
    const inProgressRentals = rentals.filter((r) => r.status === 'in_progress').length;
    const cancelledRentals = rentals.filter((r) => r.status === 'cancelled').length;

    const rentalRate = totalRentals > 0 ? (completedRentals / totalRentals) * 100 : 0;
    const cancellationRate = totalRentals > 0 ? (cancelledRentals / totalRentals) * 100 : 0;

    const totalCleaningCost = returns.reduce((sum, r) => sum + r.cleaningCost, 0);
    const avgCleaningCost = returns.length > 0 ? totalCleaningCost / returns.length : 0;

    const totalAccessoriesDeduction = returns.reduce(
      (sum, r) => sum + r.totalAccessoriesDeduction,
      0,
    );
    const lostAccessoriesCount = returns.reduce(
      (sum, r) => sum + r.accessories.filter((a) => !a.isComplete).length,
      0,
    );

    const avgFitScore = fittings.length > 0
      ? fittings.reduce((sum, f) => sum + f.fitScore, 0) / fittings.length
      : 0;

    const totalRevenue = rentals.reduce((sum, r) => sum + r.totalPrice, 0);

    return {
      dresses: {
        total: totalDresses,
        available: availableDresses,
        rented: rentedDresses,
        cleaning: cleaningDresses,
      },
      rentals: {
        total: totalRentals,
        completed: completedRentals,
        inProgress: inProgressRentals,
        cancelled: cancelledRentals,
        rentalRate: parseFloat(rentalRate.toFixed(1)),
        cancellationRate: parseFloat(cancellationRate.toFixed(1)),
      },
      cleaning: {
        totalCost: totalCleaningCost,
        averageCost: parseFloat(avgCleaningCost.toFixed(2)),
      },
      accessories: {
        totalDeduction: totalAccessoriesDeduction,
        lostCount: lostAccessoriesCount,
      },
      fitting: {
        averageFitScore: parseFloat(avgFitScore.toFixed(2)),
        totalFeedbacks: fittings.length,
      },
      finance: {
        totalRevenue,
      },
    };
  }

  getDressStats(dressId: string) {
    const dress = this.dressesService.findOne(dressId);
    const dressRentals = this.rentalsService.findAll().filter((r) => r.dressId === dressId);
    const dressReturns = this.returnsService.findAll().filter((r) => r.dressId === dressId);
    const dressFittings = this.fittingsService.findByDressId(dressId);

    const rentalCount = dressRentals.length;
    const completedCount = dressRentals.filter((r) => r.status === 'completed').length;

    const totalRevenue = dressRentals.reduce((sum, r) => sum + r.totalPrice, 0);
    const totalRentalDays = dressRentals.reduce((sum, r) => sum + r.totalDays, 0);

    const avgFitScore = dressFittings.length > 0
      ? dressFittings.reduce((sum, f) => sum + f.fitScore, 0) / dressFittings.length
      : 0;

    const totalCleaningCost = dressReturns.reduce((sum, r) => sum + r.cleaningCost, 0);
    const totalDamageDeduction = dressReturns.reduce(
      (sum, r) => sum + r.totalDamageDeduction,
      0,
    );

    let consignmentDays = 0;
    if (dress.consignment.consignmentStartDate && dress.consignment.consignmentEndDate) {
      const start = new Date(dress.consignment.consignmentStartDate);
      const end = new Date(dress.consignment.consignmentEndDate);
      consignmentDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    return {
      dressId,
      dressName: dress.name,
      rentals: {
        totalCount: rentalCount,
        completedCount,
        totalRentalDays,
        totalRevenue,
      },
      returns: {
        totalCount: dressReturns.length,
        totalCleaningCost,
        totalDamageDeduction,
      },
      fitting: {
        feedbackCount: dressFittings.length,
        averageFitScore: parseFloat(avgFitScore.toFixed(2)),
      },
      consignment: {
        status: dress.consignment.status,
        commissionRate: dress.consignment.commissionRate,
        basePrice: dress.consignment.basePrice,
        totalDays: consignmentDays,
        ownerName: dress.consignment.ownerName,
      },
    };
  }

  getConsignmentStats() {
    const dresses = this.dressesService.findAll();
    const consignmentDresses = dresses.filter(
      (d) => d.consignment.status === 'active',
    );

    const totalConsignmentValue = consignmentDresses.reduce(
      (sum, d) => sum + d.consignment.basePrice,
      0,
    );

    const avgCommissionRate = consignmentDresses.length > 0
      ? consignmentDresses.reduce((sum, d) => sum + d.consignment.commissionRate, 0) /
        consignmentDresses.length
      : 0;

    const consignmentStats = consignmentDresses.map((dress) => {
      const dressRentals = this.rentalsService
        .findAll()
        .filter((r) => r.dressId === dress.id);
      const totalRevenue = dressRentals.reduce((sum, r) => sum + r.totalPrice, 0);
      const commissionIncome = totalRevenue * dress.consignment.commissionRate;

      const start = new Date(dress.consignment.consignmentStartDate);
      const end = new Date(dress.consignment.consignmentEndDate);
      const totalDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        dressId: dress.id,
        dressName: dress.name,
        ownerName: dress.consignment.ownerName,
        basePrice: dress.consignment.basePrice,
        commissionRate: dress.consignment.commissionRate,
        totalRentalRevenue: totalRevenue,
        commissionIncome: parseFloat(commissionIncome.toFixed(2)),
        rentalCount: dressRentals.length,
        consignmentDays: totalDays,
      };
    });

    return {
      totalConsignmentDresses: consignmentDresses.length,
      totalConsignmentValue,
      averageCommissionRate: parseFloat((avgCommissionRate * 100).toFixed(1)),
      details: consignmentStats,
    };
  }
}
