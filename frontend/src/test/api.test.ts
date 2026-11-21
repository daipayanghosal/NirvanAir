import { describe, it, expect } from 'vitest';
import {
  DEMO_DURGAPUR_DATA,
  DEFAULT_USER_PROFILE,
  fetchNirvanAirBriefing,
  fetchDailyPlan,
  sendChatMessage
} from '../services/api';

describe('Frontend API Services & Fallback Heuristic Robustness', () => {
  it('generates grounded daily briefing from local heuristic engine when offline', async () => {
    const briefing = await fetchNirvanAirBriefing(DEMO_DURGAPUR_DATA, DEFAULT_USER_PROFILE);
    expect(briefing).toBeDefined();
    expect(briefing.headline).toContain('Durgapur');
    expect(briefing.summary).toBeDefined();
    expect(briefing.summary.length).toBeGreaterThan(20);
    expect(briefing.priority_actions_today.length).toBeGreaterThanOrEqual(2);
    expect(briefing.generated_by).toBeDefined();
  });

  it('constructs multi-segment diurnal schedule adapting to smog inversion', async () => {
    const timeline = await fetchDailyPlan(DEMO_DURGAPUR_DATA, DEFAULT_USER_PROFILE);
    expect(timeline).toBeDefined();
    expect(timeline.length).toBeGreaterThanOrEqual(6);

    const segments = timeline.map(s => s.segment);
    expect(segments.some(s => s.toLowerCase().includes('morning routine'))).toBe(true);
    expect(segments.some(s => s.toLowerCase().includes('exercise') || s.toLowerCase().includes('fitness'))).toBe(true);
    expect(segments.some(s => s.toLowerCase().includes('commute'))).toBe(true);
    expect(segments.some(s => s.toLowerCase().includes('errands') || s.toLowerCase().includes('shopping'))).toBe(true);
    expect(segments.some(s => s.toLowerCase().includes('evening') || s.toLowerCase().includes('cooking'))).toBe(true);
    expect(segments.some(s => s.toLowerCase().includes('sleep'))).toBe(true);
  });

  it('shifts morning workout indoors during high particulate pollution', async () => {
    const timeline = await fetchDailyPlan(DEMO_DURGAPUR_DATA, DEFAULT_USER_PROFILE);
    const workout = timeline.find(s => s.segment.toLowerCase().includes('fitness') || s.segment.toLowerCase().includes('exercise'));
    expect(workout).toBeDefined();
    const action = (workout?.suggested_action || workout?.suggested_activity || "");
    expect(action.toLowerCase()).toContain('indoor');
    expect(workout?.expected_benefit).toBeDefined();
    expect(workout?.alternative || workout?.alternative_if_impractical).toBeDefined();
  });

  it('handles conversational AI assistant queries with structured cards', async () => {
    const query = 'Is it safe to go jogging today?';
    const response = await sendChatMessage(query, DEMO_DURGAPUR_DATA, DEFAULT_USER_PROFILE);
    
    expect(response).toBeDefined();
    expect(response.answer_markdown).toBeDefined();
    expect(response.actionable_cards).toBeDefined();
    expect(response.actionable_cards.length).toBeGreaterThan(0);

    const card = response.actionable_cards[0];
    expect(card.title).toBeDefined();
    expect(card.suggested_action).toBeDefined();
    expect(card.reasoning).toBeDefined();
    expect(card.expected_benefit).toBeDefined();
    expect(card.confidence).toBeGreaterThan(0);
    expect(card.data_sources).toBeDefined();
  });
});
