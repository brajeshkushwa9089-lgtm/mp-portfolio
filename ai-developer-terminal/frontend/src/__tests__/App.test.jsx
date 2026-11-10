import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import TopBar from '../components/TopBar.jsx';
import TabNav from '../components/TabNav.jsx';

describe('Frontend Component Tests', () => {
  it('renders TopBar with Brajesh AI Studio brand and window controls', () => {
    render(
      <TopBar
        currentPath=""
        serverStatus="connected"
        onRefresh={() => {}}
        onOpenProjectBuilder={() => {}}
        activeTab="terminal"
        setActiveTab={() => {}}
      />
    );

    expect(screen.getByText('Brajesh AI Studio')).toBeInTheDocument();
    expect(screen.getByText('Studio Engine Online')).toBeInTheDocument();
    expect(screen.getByText('+ New Project')).toBeInTheDocument();
  });

  it('renders TabNav with Terminal, Editor, Builder, Preview, and AI tabs', () => {
    render(
      <TabNav
        activeTab="terminal"
        setActiveTab={() => {}}
        activeFile={null}
        previewRunning={false}
      />
    );

    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Code Editor')).toBeInTheDocument();
    expect(screen.getByText('Project Builder')).toBeInTheDocument();
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });
});

