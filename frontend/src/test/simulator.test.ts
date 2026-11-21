import { describe, it, expect } from 'vitest';
import { runSimulation } from '../services/api';

describe('Community What-If Scenario Simulator Engine', () => {
  it('computes standard neighborhood baseline scenario for 100 households', async () => {
    const res = await runSimulation({
      num_households: 100,
      vehicle_reduction_percent: 20,
      diesel_genset_reduction_percent: 30,
      waste_composting_percent: 25,
      energy_conservation_percent: 15
    });

    expect(res.parameters.num_households).toBe(100);
    expect(res.results.vehicle_km_avoided).toBeGreaterThan(0);
    expect(res.results.fuel_saved_litres).toBeGreaterThan(0);
    expect(res.results.co2_avoided_kg).toBeGreaterThan(0);
    expect(res.results.pm25_emissions_prevented_kg).toBeGreaterThan(0);
    expect(res.results.estimated_community_savings_inr).toBeGreaterThan(0);
    expect(res.scientific_integrity_disclaimer).toBeDefined();
  });

  it('scales linearly when expanding from 100 to 500 households', async () => {
    const res100 = await runSimulation({
      num_households: 100,
      vehicle_reduction_percent: 20,
      diesel_genset_reduction_percent: 30,
      waste_composting_percent: 25,
      energy_conservation_percent: 15
    });

    const res500 = await runSimulation({
      num_households: 500,
      vehicle_reduction_percent: 20,
      diesel_genset_reduction_percent: 30,
      waste_composting_percent: 25,
      energy_conservation_percent: 15
    });

    expect(res500.results.co2_avoided_kg).toBeCloseTo(res100.results.co2_avoided_kg * 5, 0);
    expect(res500.results.fuel_saved_litres).toBeCloseTo(res100.results.fuel_saved_litres * 5, 0);
    expect(res500.results.vehicle_km_avoided).toBeCloseTo(res100.results.vehicle_km_avoided * 5, 0);
  });

  it('increases emission avoidance when vehicle reduction percentage rises', async () => {
    const res20 = await runSimulation({
      num_households: 100,
      vehicle_reduction_percent: 20,
      diesel_genset_reduction_percent: 0,
      waste_composting_percent: 0,
      energy_conservation_percent: 0
    });

    const res40 = await runSimulation({
      num_households: 100,
      vehicle_reduction_percent: 40,
      diesel_genset_reduction_percent: 0,
      waste_composting_percent: 0,
      energy_conservation_percent: 0
    });

    expect(res40.results.vehicle_km_avoided).toBeCloseTo(res20.results.vehicle_km_avoided * 2, 0);
    expect(res40.results.fuel_saved_litres).toBeCloseTo(res20.results.fuel_saved_litres * 2, 0);
  });

  it('preserves scientific disclaimer distinguishing projections from linear AQI reduction', async () => {
    const res = await runSimulation({
      num_households: 100,
      vehicle_reduction_percent: 20,
      diesel_genset_reduction_percent: 30,
      waste_composting_percent: 25,
      energy_conservation_percent: 15
    });

    expect(res.scientific_integrity_disclaimer).toContain('linear drop');
  });
});
