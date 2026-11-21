import { describe, it, expect } from 'vitest';
import { fetchSwaps, computeSwapImpact } from '../services/api';

describe('Sustainable Swap Engine & Emission Impact Modeling', () => {
  it('retrieves default catalog of sustainable swaps', async () => {
    const swaps = await fetchSwaps();
    expect(swaps).toBeDefined();
    expect(swaps.length).toBeGreaterThanOrEqual(4);

    const ids = swaps.map(s => s.id);
    expect(ids).toContain('swap_commute_car_to_metro');
    expect(ids).toContain('swap_diesel_generator_to_inverter');
    expect(ids).toContain('swap_mosquito_coil_to_liquid_vaporizer');
    expect(ids).toContain('swap_open_waste_burning_to_compost');
  });

  it('validates emission factor formulas for car to metro swap', async () => {
    const swaps = await fetchSwaps();
    const carSwap = swaps.find(s => s.id === 'swap_commute_car_to_metro');
    expect(carSwap).toBeDefined();
    expect(carSwap?.environmental_benefit.co2_saved_kg_per_day).toBeGreaterThan(0);
    expect(carSwap?.environmental_benefit.pm25_avoided_g_per_day).toBeGreaterThan(0);
    expect(carSwap?.financial_implications.monthly_savings_inr).toBeGreaterThan(1000);
  });

  it('calculates 30-day cumulative impact for a single swap', async () => {
    const impact = await computeSwapImpact(['swap_commute_car_to_metro'], 30);
    expect(impact.total_co2_saved_kg).toBeGreaterThan(0);
    expect(impact.total_pm25_avoided_grams).toBeGreaterThan(0);
    expect(impact.total_financial_savings_inr).toBeGreaterThan(0);
    expect(impact.trees_equivalent).toBeGreaterThan(0);
  });

  it('scales impact linearly with duration in days', async () => {
    const impact30 = await computeSwapImpact(['swap_commute_car_to_metro'], 30);
    const impact60 = await computeSwapImpact(['swap_commute_car_to_metro'], 60);

    expect(impact60.total_co2_saved_kg).toBeCloseTo(impact30.total_co2_saved_kg * 2, 0);
    expect(impact60.total_financial_savings_inr).toBeCloseTo(impact30.total_financial_savings_inr * 2, 0);
  });

  it('aggregates multiple distinct swaps accurately', async () => {
    const impactSingle = await computeSwapImpact(['swap_commute_car_to_metro'], 30);
    const impactDouble = await computeSwapImpact(
      ['swap_commute_car_to_metro', 'swap_diesel_generator_to_inverter'],
      30
    );

    expect(impactDouble.total_co2_saved_kg).toBeGreaterThan(impactSingle.total_co2_saved_kg);
    expect(impactDouble.total_financial_savings_inr).toBeGreaterThan(impactSingle.total_financial_savings_inr);
    expect(impactDouble.total_pm25_avoided_grams).toBeGreaterThan(impactSingle.total_pm25_avoided_grams);
  });

  it('handles empty swap selection gracefully', async () => {
    const impact = await computeSwapImpact([], 30);
    expect(impact.total_co2_saved_kg).toBe(0);
    expect(impact.total_pm25_avoided_grams).toBe(0);
    expect(impact.total_financial_savings_inr).toBe(0);
    expect(impact.trees_equivalent).toBe(0);
  });
});
