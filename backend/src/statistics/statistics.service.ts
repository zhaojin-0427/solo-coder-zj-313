import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { DressesService } from '../dresses/dresses.service';
import { RentalsService } from '../rentals/rentals.service';
import { ReturnsService } from '../returns/returns.service';
import { FittingsService } from '../fittings/fittings.service';
import { DisputesService } from '../disputes/disputes.service';
import { OutfitsService } from '../outfits/outfits.service';
import { ConsignmentsService } from '../consignments/consignments.service';
import { MembersService } from '../members/members.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly dressesService: DressesService,
    @Inject(forwardRef(() => RentalsService))
    private readonly rentalsService: RentalsService,
    @Inject(forwardRef(() => ReturnsService))
    private readonly returnsService: ReturnsService,
    private readonly fittingsService: FittingsService,
    @Inject(forwardRef(() => DisputesService))
    private readonly disputesService: DisputesService,
    @Inject(forwardRef(() => OutfitsService))
    private readonly outfitsService: OutfitsService,
    private readonly consignmentsService: ConsignmentsService,
    @Inject(forwardRef(() => MembersService))
    private readonly membersService: MembersService,
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
    return this.consignmentsService.getConsignmentStats();
  }

  getDisputeStats() {
    return this.disputesService.getDisputeStats();
  }

  getMemberStats() {
    return this.membersService.getMemberStats();
  }

  getOutfitStats() {
    const outfitStats = this.outfitsService.getOutfitStats();
    const returnStats = this.returnsService.getOutfitReturnStats();
    const rentals = this.rentalsService.findAll();

    const outfitRentals = rentals.filter((r) => r.isOutfitRental);
    const singleRentals = rentals.filter((r) => !r.isOutfitRental);

    const totalOutfitRevenue = outfitRentals.reduce((sum, r) => sum + r.totalPrice, 0);
    const avgSetOrderPrice = outfitRentals.length > 0
      ? totalOutfitRevenue / outfitRentals.length
      : 0;

    const totalSingleRevenue = singleRentals.reduce((sum, r) => sum + r.totalPrice, 0);
    const avgSingleOrderPrice = singleRentals.length > 0
      ? totalSingleRevenue / singleRentals.length
      : 0;

    const priceComparison = {
      avgSetOrderPrice: parseFloat(avgSetOrderPrice.toFixed(2)),
      avgSingleOrderPrice: parseFloat(avgSingleOrderPrice.toFixed(2)),
      premiumPercentage: avgSingleOrderPrice > 0
        ? parseFloat((((avgSetOrderPrice - avgSingleOrderPrice) / avgSingleOrderPrice) * 100).toFixed(1))
        : 0,
    };

    const mostPopularScenarios = outfitStats.scenarioStats.slice(0, 5);

    const outfitRentalRates = outfitStats.rentalRates.map((item) => ({
      ...item,
      rentalRate: item.rentalCount > 0 ? parseFloat(((item.rentalCount / 30) * 100).toFixed(1)) : 0,
    }));

    return {
      overview: {
        ...outfitStats.overview,
        totalOutfitRentals: outfitRentals.length,
        completedOutfitRentals: outfitRentals.filter((r) => r.status === 'completed').length,
        totalOutfitRevenue: parseFloat(totalOutfitRevenue.toFixed(2)),
        avgSetOrderPrice: parseFloat(avgSetOrderPrice.toFixed(2)),
      },
      rentalRates: outfitRentalRates,
      priceComparison,
      mostPopularScenarios,
      accessoryLossStats: returnStats.accessoryLossStats,
      outfitReturnStats: {
        totalReturns: returnStats.totalOutfitReturns,
        completeReturns: returnStats.completeOutfitReturns,
        completeRate: returnStats.completeRate,
      },
    };
  }
}
