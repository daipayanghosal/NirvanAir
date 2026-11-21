import { describe, it, expect } from 'vitest';
import { DEMO_DURGAPUR_DATA } from '../services/api';

describe('Indian National Air Quality Index (NAQI) Breakpoint Standards', () => {
  function getNAQICategory(aqi: number) {
    if (aqi <= 50) return { category: 'Good', color: '#10b981' };
    if (aqi <= 100) return { category: 'Satisfactory', color: '#84cc16' };
    if (aqi <= 200) return { category: 'Moderate', color: '#eab308' };
    if (aqi <= 300) return { category: 'Poor', color: '#f97316' };
    if (aqi <= 400) return { category: 'Very Poor', color: '#ef4444' };
    return { category: 'Severe', color: '#7f1d1d' };
  }

  it('correctly classifies Good range (0-50)', () => {
    expect(getNAQICategory(0).category).toBe('Good');
    expect(getNAQICategory(25).category).toBe('Good');
    expect(getNAQICategory(50).category).toBe('Good');
  });

  it('correctly classifies Satisfactory range (51-100)', () => {
    expect(getNAQICategory(51).category).toBe('Satisfactory');
    expect(getNAQICategory(75).category).toBe('Satisfactory');
    expect(getNAQICategory(100).category).toBe('Satisfactory');
  });

  it('correctly classifies Moderate range (101-200)', () => {
    expect(getNAQICategory(101).category).toBe('Moderate');
    expect(getNAQICategory(150).category).toBe('Moderate');
    expect(getNAQICategory(200).category).toBe('Moderate');
  });

  it('correctly classifies Poor range (201-300)', () => {
    expect(getNAQICategory(201).category).toBe('Poor');
    expect(getNAQICategory(285).category).toBe('Poor');
    expect(getNAQICategory(300).category).toBe('Poor');
  });

  it('correctly classifies Very Poor range (301-400)', () => {
    expect(getNAQICategory(301).category).toBe('Very Poor');
    expect(getNAQICategory(350).category).toBe('Very Poor');
    expect(getNAQICategory(400).category).toBe('Very Poor');
  });

  it('correctly classifies Severe range (401-500+)', () => {
    expect(getNAQICategory(401).category).toBe('Severe');
    expect(getNAQICategory(450).category).toBe('Severe');
    expect(getNAQICategory(500).category).toBe('Severe');
  });
});

describe('Atmospheric Telemetry & Baseline Scenario Integrity', () => {
  it('validates Durgapur demo baseline structure', () => {
    expect(DEMO_DURGAPUR_DATA.status).toBe('success');
    expect(DEMO_DURGAPUR_DATA.location.name).toBe('Durgapur');
    expect(DEMO_DURGAPUR_DATA.location.state).toBe('West Bengal');
    expect(DEMO_DURGAPUR_DATA.location.country).toBe('India');
    expect(DEMO_DURGAPUR_DATA.air_quality.aqi).toBe(285);
    expect(DEMO_DURGAPUR_DATA.air_quality.scale).toBe('Indian NAQI');
    expect(DEMO_DURGAPUR_DATA.air_quality.category).toBe('Poor');
  });

  it('validates 24-hour diurnal trend intervals', () => {
    const trend = DEMO_DURGAPUR_DATA.hourly_24h;
    expect(trend).toBeDefined();
    expect(trend.length).toBeGreaterThanOrEqual(12);

    // Morning peak (08:00) during inversion should exceed midday (14:00)
    const morningItem = trend.find(t => t.time === '08:00');
    const middayItem = trend.find(t => t.time === '14:00');
    expect(morningItem?.aqi).toBeGreaterThan(middayItem?.aqi || 0);
  });

  it('verifies boundary-layer thermal inversion metadata', () => {
    const weather = DEMO_DURGAPUR_DATA.weather;
    expect(weather.inversion_risk).toBeDefined();
    expect(weather.inversion_risk.toLowerCase()).toContain('inversion');
    expect(weather.relative_humidity).toBeGreaterThan(60);
  });

  it('verifies multi-pollutant concentrations and units', () => {
    const pollutants = DEMO_DURGAPUR_DATA.air_quality.pollutants;
    expect(pollutants.pm2_5.value).toBe(184.5);
    expect(pollutants.pm2_5.unit).toBe('µg/m³');
    expect(pollutants.pm10.value).toBe(298.0);
    expect(pollutants.no2.value).toBe(48.2);
    expect(pollutants.so2.value).toBe(22.4);
    expect(pollutants.co.value).toBe(1.42);
    expect(pollutants.o3.value).toBe(38.6);
  });

  it('ensures nearest monitoring station metadata is present', () => {
    const station = DEMO_DURGAPUR_DATA.data_provenance.station;
    expect(station).toBeDefined();
    expect(station.name).toContain('Durgapur');
    expect(station.distance_km).toBeLessThan(10);
  });
});
