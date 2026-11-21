import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { OnboardingModal } from '../components/OnboardingModal';
import { DEMO_DURGAPUR_DATA, DEFAULT_USER_PROFILE } from '../services/api';

describe('Component Layout, Navigation & Accessibility Landmarks', () => {
  it('renders Navbar with NirvanAir brand and NAQI badge', () => {
    const onUpdateLoc = vi.fn();
    const onToggleDemo = vi.fn();
    const onToggleStd = vi.fn();
    const onOpenOnboard = vi.fn();

    render(
      <Navbar
        envData={DEMO_DURGAPUR_DATA}
        userProfile={DEFAULT_USER_PROFILE}
        isDemoMode={true}
        onToggleDemoMode={onToggleDemo}
        aqiStandard="NAQI"
        onToggleAqiStandard={onToggleStd}
        onUpdateLocation={onUpdateLoc}
        onOpenOnboarding={onOpenOnboard}
        onOpenSettings={vi.fn()}
        activeTab="overview"
        onSelectTab={vi.fn()}
      />
    );

    expect(screen.getByText(/NirvanAir/i)).toBeInTheDocument();
    expect(screen.getByText(/285/i)).toBeInTheDocument();
    expect(screen.getByText(/Poor/i)).toBeInTheDocument();
  });

  it('renders Sidebar with all 8 intelligence module navigation tabs', () => {
    const onSelectTab = vi.fn();

    render(
      <Sidebar
        activeTab="overview"
        onSelectTab={onSelectTab}
        swapsCount={2}
      />
    );

    expect(screen.getByText(/Home Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Daily Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Indoor Air Doctor/i)).toBeInTheDocument();
    expect(screen.getByText(/Sustainable Swaps/i)).toBeInTheDocument();
    expect(screen.getByText(/Family Protection/i)).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Community'))).toBeInTheDocument();
    expect(screen.getByText(/NirvanAir Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings & API/i)).toBeInTheDocument();

    // Click on Planner tab
    const plannerBtn = screen.getByText(/AI Daily Planner/i).closest('button');
    if (plannerBtn) {
      fireEvent.click(plannerBtn);
      expect(onSelectTab).toHaveBeenCalledWith('planner');
    }
  });

  it('renders Onboarding Modal and handles step progression', () => {
    const onClose = vi.fn();
    const onComplete = vi.fn();

    render(
      <OnboardingModal
        isOpen={true}
        onClose={onClose}
        userProfile={DEFAULT_USER_PROFILE}
        onComplete={onComplete}
      />
    );

    expect(screen.getByText(/Welcome to NirvanAir/i)).toBeInTheDocument();
    expect(screen.getByText(/Next Step/i)).toBeInTheDocument();

    // Click Next Step
    const nextBtn = screen.getByText(/Next Step/i);
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Household Composition/i)).toBeInTheDocument();
  });
});
