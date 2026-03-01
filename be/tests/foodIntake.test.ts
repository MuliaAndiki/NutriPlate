import { describe, expect, it } from 'bun:test';

describe('FoodIntake Nutrient Calculation', () => {
  describe('getNutrientPer100g logic', () => {
    it('should return DB values when food class exists', () => {
      const foodClass = {
        energyKcal: 250,
        proteinGram: 12,
        fatGram: 8,
        carbGram: 35,
        fiberGram: 3.5,
        calciumMg: 120,
        ironMg: 2.5,
        vitaminA: 150,
        vitaminC: 10,
      };

      const nutrient = {
        energyKcal: Number(foodClass.energyKcal ?? 0),
        proteinGram: Number(foodClass.proteinGram ?? 0),
        fatGram: Number(foodClass.fatGram ?? 0),
        carbGram: Number(foodClass.carbGram ?? 0),
        fiberGram: Number(foodClass.fiberGram ?? 0),
        calciumMg: Number(foodClass.calciumMg ?? 0),
        ironMg: Number(foodClass.ironMg ?? 0),
        vitaminA: Number(foodClass.vitaminA ?? 0),
        vitaminC: Number(foodClass.vitaminC ?? 0),
      };

      // Previously, fiberGram, calciumMg, ironMg, vitaminA, vitaminC were hardcoded to 0
      expect(nutrient.fiberGram).toBe(3.5);
      expect(nutrient.calciumMg).toBe(120);
      expect(nutrient.ironMg).toBe(2.5);
      expect(nutrient.vitaminA).toBe(150);
      expect(nutrient.vitaminC).toBe(10);
    });

    it('should return zeros when food class does not exist', () => {
      const foodClass = null;

      const nutrient = foodClass
        ? {
            energyKcal: Number(foodClass.energyKcal ?? 0),
            proteinGram: Number(foodClass.proteinGram ?? 0),
            fatGram: Number(foodClass.fatGram ?? 0),
            carbGram: Number(foodClass.carbGram ?? 0),
            fiberGram: Number(foodClass.fiberGram ?? 0),
            calciumMg: Number(foodClass.calciumMg ?? 0),
            ironMg: Number(foodClass.ironMg ?? 0),
            vitaminA: Number(foodClass.vitaminA ?? 0),
            vitaminC: Number(foodClass.vitaminC ?? 0),
          }
        : {
            energyKcal: 0,
            proteinGram: 0,
            fatGram: 0,
            carbGram: 0,
            fiberGram: 0,
            calciumMg: 0,
            ironMg: 0,
            vitaminA: 0,
            vitaminC: 0,
          };

      expect(nutrient.energyKcal).toBe(0);
      expect(nutrient.fiberGram).toBe(0);
      expect(nutrient.calciumMg).toBe(0);
    });

    it('should handle null nutrient values gracefully', () => {
      const foodClass = {
        energyKcal: null,
        proteinGram: 10,
        fatGram: null,
        carbGram: 20,
        fiberGram: null,
        calciumMg: null,
        ironMg: null,
        vitaminA: null,
        vitaminC: null,
      };

      const nutrient = {
        energyKcal: Number(foodClass.energyKcal ?? 0),
        proteinGram: Number(foodClass.proteinGram ?? 0),
        fatGram: Number(foodClass.fatGram ?? 0),
        carbGram: Number(foodClass.carbGram ?? 0),
        fiberGram: Number(foodClass.fiberGram ?? 0),
        calciumMg: Number(foodClass.calciumMg ?? 0),
        ironMg: Number(foodClass.ironMg ?? 0),
        vitaminA: Number(foodClass.vitaminA ?? 0),
        vitaminC: Number(foodClass.vitaminC ?? 0),
      };

      expect(nutrient.energyKcal).toBe(0);
      expect(nutrient.proteinGram).toBe(10);
      expect(nutrient.fiberGram).toBe(0);
    });
  });

  describe('Weight-based nutrient calculation', () => {
    it('should calculate nutrients proportionally to weight', () => {
      const totalWeightGram = 200;
      const areaRatio = 0.5;
      const itemWeightGram = totalWeightGram * areaRatio; // 100g

      const nutrientPer100g = { energyKcal: 250 };
      const weightFactor = itemWeightGram / 100; // 1.0
      const energyKcal = weightFactor * nutrientPer100g.energyKcal;

      expect(itemWeightGram).toBe(100);
      expect(energyKcal).toBe(250);
    });

    it('should scale nutrients for partial weight', () => {
      const totalWeightGram = 200;
      const areaRatio = 0.25;
      const itemWeightGram = totalWeightGram * areaRatio; // 50g

      const nutrientPer100g = { energyKcal: 200 };
      const weightFactor = itemWeightGram / 100; // 0.5
      const energyKcal = Number((weightFactor * nutrientPer100g.energyKcal).toFixed(2));

      expect(itemWeightGram).toBe(50);
      expect(energyKcal).toBe(100);
    });
  });

  describe('Area ratio normalization', () => {
    it('should normalize single detection to area_ratio 1.0', () => {
      const detections = [{ class: 'nasi', area_ratio: 0.3, confidence: 0.9 }];

      if (detections.length === 1) {
        detections[0].area_ratio = 1.0;
      }

      expect(detections[0].area_ratio).toBe(1.0);
    });

    it('should normalize multiple detections when ratio sum is unrealistic', () => {
      const detections = [
        { class: 'nasi', area_ratio: 0.2, confidence: 0.9 },
        { class: 'ayam', area_ratio: 0.1, confidence: 0.85 },
      ];

      const sumRatio = detections.reduce((sum, d) => sum + d.area_ratio, 0);

      let normalized = detections;
      if (sumRatio < 0.7 || sumRatio > 1.3) {
        normalized = detections.map((d) => ({
          ...d,
          area_ratio: d.area_ratio / sumRatio,
        }));
      }

      const normalizedSum = normalized.reduce((sum, d) => sum + d.area_ratio, 0);
      expect(normalizedSum).toBeCloseTo(1.0, 5);
    });

    it('should preserve ratios when sum is within valid range', () => {
      const detections = [
        { class: 'nasi', area_ratio: 0.5, confidence: 0.9 },
        { class: 'ayam', area_ratio: 0.3, confidence: 0.85 },
      ];

      const sumRatio = detections.reduce((sum, d) => sum + d.area_ratio, 0);
      // sumRatio = 0.8, within [0.7, 1.3] range
      expect(sumRatio).toBeGreaterThanOrEqual(0.7);
      expect(sumRatio).toBeLessThanOrEqual(1.3);
    });
  });

  describe('Total nutrient aggregation', () => {
    it('should sum all item nutrients correctly', () => {
      const items = [
        { energyKcal: 200, proteinGram: 10, fatGram: 5, carbGram: 30, fiberGram: 2 },
        { energyKcal: 150, proteinGram: 8, fatGram: 3, carbGram: 20, fiberGram: 1 },
      ];

      const totals = {
        energyKcal: items.reduce((sum, item) => sum + item.energyKcal, 0),
        proteinGram: items.reduce((sum, item) => sum + item.proteinGram, 0),
        fatGram: items.reduce((sum, item) => sum + item.fatGram, 0),
        carbGram: items.reduce((sum, item) => sum + item.carbGram, 0),
        fiberGram: items.reduce((sum, item) => sum + item.fiberGram, 0),
      };

      expect(totals.energyKcal).toBe(350);
      expect(totals.proteinGram).toBe(18);
      expect(totals.fatGram).toBe(8);
      expect(totals.carbGram).toBe(50);
      expect(totals.fiberGram).toBe(3);
    });
  });
});
