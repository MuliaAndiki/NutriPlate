import { describe, expect, it } from 'bun:test';
import whoGrowthCalculationService from '../src/service/whoGrowth.service';

const sampleReference = {
  median: 76.1,
  sdMinus3: 68.0,
  sdMinus2: 70.7,
  sdMinus1: 73.4,
  sdPlus1: 78.8,
  sdPlus2: 81.5,
  sdPlus3: 84.2,
};

describe('WhoGrowthCalculationService', () => {
  describe('calculateZScore', () => {
    it('should return z-score of 0 for median value', () => {
      const result = whoGrowthCalculationService.calculateZScore(76.1, sampleReference);
      expect(result.zScore).toBe(0);
      expect(result.closestSD).toBe('0 SD');
    });

    it('should return positive z-score for above-median values', () => {
      const result = whoGrowthCalculationService.calculateZScore(78.8, sampleReference);
      expect(result.zScore).toBeGreaterThan(0);
    });

    it('should return negative z-score for below-median values', () => {
      const result = whoGrowthCalculationService.calculateZScore(73.4, sampleReference);
      expect(result.zScore).toBeLessThan(0);
    });

    it('should return approximately -2 for value at sdMinus2', () => {
      const result = whoGrowthCalculationService.calculateZScore(70.7, sampleReference);
      expect(result.zScore).toBeCloseTo(-2, 0);
      expect(result.closestSD).toBe('-2 SD');
    });

    it('should return approximately -3 for value at sdMinus3', () => {
      const result = whoGrowthCalculationService.calculateZScore(68.0, sampleReference);
      expect(result.zScore).toBeCloseTo(-3, 0);
    });

    it('should return z-score > 2 for value at sdPlus2', () => {
      const result = whoGrowthCalculationService.calculateZScore(81.5, sampleReference);
      expect(result.zScore).toBeGreaterThanOrEqual(2);
      expect(result.closestSD).toBe('+2 SD');
    });

    it('should return z-score > 3 for value above sdPlus3', () => {
      const result = whoGrowthCalculationService.calculateZScore(86.0, sampleReference);
      expect(result.zScore).toBeGreaterThan(3);
      expect(result.closestSD).toBe('+3 SD');
    });

    it('should return z-score < -3 for value below sdMinus3', () => {
      const result = whoGrowthCalculationService.calculateZScore(65.0, sampleReference);
      expect(result.zScore).toBeLessThan(-3);
    });

    it('should include rawValue and median in result', () => {
      const result = whoGrowthCalculationService.calculateZScore(76.1, sampleReference);
      expect(result.rawValue).toBe(76.1);
      expect(result.median).toBe(76.1);
      expect(result.method).toBe('SD_Based');
    });
  });

  describe('classifyGrowthStatus', () => {
    it('should classify z-score < -3 as SEVERELY_STUNTED', () => {
      const result = whoGrowthCalculationService.classifyGrowthStatus(-3.5, 76.1, 65);
      expect(result.stuntingStatus).toBe('SEVERELY_STUNTED');
      expect(result.severity).toBe('SEVERE');
    });

    it('should classify z-score between -3 and -2 as STUNTED', () => {
      const result = whoGrowthCalculationService.classifyGrowthStatus(-2.5, 76.1, 70);
      expect(result.stuntingStatus).toBe('STUNTED');
      expect(result.severity).toBe('MODERATE');
    });

    it('should classify z-score between -2 and +2 as NORMAL', () => {
      const result = whoGrowthCalculationService.classifyGrowthStatus(0, 76.1, 76.1);
      expect(result.stuntingStatus).toBe('NORMAL');
      expect(result.severity).toBe('NORMAL');
    });

    it('should classify z-score > +2 as TALL', () => {
      const result = whoGrowthCalculationService.classifyGrowthStatus(2.5, 76.1, 82);
      expect(result.stuntingStatus).toBe('TALL');
      expect(result.severity).toBe('NORMAL');
    });

    it('should calculate percentage of median correctly', () => {
      const result = whoGrowthCalculationService.classifyGrowthStatus(0, 100, 95);
      expect(result.percentageOfMedian).toBe(95);
    });
  });

  describe('generateRecommendation', () => {
    it('should return CRITICAL risk for SEVERELY_STUNTED', () => {
      const classification = {
        stuntingStatus: 'SEVERELY_STUNTED' as const,
        severity: 'SEVERE' as const,
        threshold: '< -3 SD',
        sdRange: 'Below -3 SD',
        percentageOfMedian: 85,
      };
      const result = whoGrowthCalculationService.generateRecommendation(classification, 12);
      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.referralNeeded).toBe(true);
      expect(result.nutritionIntervention).toBe(true);
      expect(result.followUpInDays).toBe(7);
    });

    it('should return HIGH risk for STUNTED', () => {
      const classification = {
        stuntingStatus: 'STUNTED' as const,
        severity: 'MODERATE' as const,
        threshold: '-2 to -3 SD',
        sdRange: '-3 to -2 SD',
        percentageOfMedian: 90,
      };
      const result = whoGrowthCalculationService.generateRecommendation(classification, 12);
      expect(result.riskLevel).toBe('HIGH');
      expect(result.followUpInDays).toBe(30);
    });

    it('should return LOW risk for NORMAL', () => {
      const classification = {
        stuntingStatus: 'NORMAL' as const,
        severity: 'NORMAL' as const,
        threshold: '-2 to +2 SD',
        sdRange: '-2 to +2 SD',
        percentageOfMedian: 100,
      };
      const result = whoGrowthCalculationService.generateRecommendation(classification, 12);
      expect(result.riskLevel).toBe('LOW');
      expect(result.referralNeeded).toBe(false);
      expect(result.nutritionIntervention).toBe(false);
    });

    it('should include actions array', () => {
      const classification = {
        stuntingStatus: 'NORMAL' as const,
        severity: 'NORMAL' as const,
        threshold: '-2 to +2 SD',
        sdRange: '-2 to +2 SD',
        percentageOfMedian: 100,
      };
      const result = whoGrowthCalculationService.generateRecommendation(classification, 12);
      expect(result.actions).toBeInstanceOf(Array);
      expect(result.actions.length).toBeGreaterThan(0);
    });
  });

  describe('validateAge', () => {
    it('should accept valid age 0', () => {
      expect(whoGrowthCalculationService.validateAge(0).valid).toBe(true);
    });

    it('should accept valid age 60', () => {
      expect(whoGrowthCalculationService.validateAge(60).valid).toBe(true);
    });

    it('should accept max valid age 120', () => {
      expect(whoGrowthCalculationService.validateAge(120).valid).toBe(true);
    });

    it('should reject negative age', () => {
      const result = whoGrowthCalculationService.validateAge(-1);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject age > 120', () => {
      const result = whoGrowthCalculationService.validateAge(121);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateMeasurements', () => {
    it('should accept valid measurements', () => {
      const result = whoGrowthCalculationService.validateMeasurements(80, 10, 12);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject height <= 0', () => {
      const result = whoGrowthCalculationService.validateMeasurements(0, 10, 12);
      expect(result.valid).toBe(false);
    });

    it('should reject weight <= 0', () => {
      const result = whoGrowthCalculationService.validateMeasurements(80, 0, 12);
      expect(result.valid).toBe(false);
    });

    it('should reject unrealistic height for young age', () => {
      const result = whoGrowthCalculationService.validateMeasurements(100, 10, 3);
      expect(result.valid).toBe(false);
    });

    it('should reject unrealistic low height for older child', () => {
      const result = whoGrowthCalculationService.validateMeasurements(50, 15, 72);
      expect(result.valid).toBe(false);
    });
  });
});
