import { describe, it, expect, vi } from 'vitest';
import { createDefaultWidgetConfigs, getWidgetOptions } from './helpers';
import {
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_APPS,
  WIDGET_TYPE_LINKS,
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_STOPWATCH,
} from '@/constants/widgetTypes';
import { DEFAULT_SEARCH_URL } from '@/components/blocks/SearchWidget/constants';
import { EXAMPLE_URL, EXAMPLE_URL_WITH_TRAILING_SLASH } from '@/constants/urls';

describe('WidgetSelectionDialog helpers', () => {
  describe('createDefaultWidgetConfigs', () => {
    const mockT = vi.fn((key: string) => key);

    beforeEach(() => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('mock-uuid-123');
    });

    it('should create config for search widget', () => {
      const configs = createDefaultWidgetConfigs(mockT);
      expect(configs[WIDGET_TYPE_SEARCH]).toHaveProperty('elements');
      expect(configs[WIDGET_TYPE_SEARCH].elements).toHaveLength(1);
      expect(configs[WIDGET_TYPE_SEARCH].elements[0]).toHaveProperty('id');
      expect(configs[WIDGET_TYPE_SEARCH].elements[0]).toHaveProperty('url', DEFAULT_SEARCH_URL);
    });

    it('should create config for apps widget', () => {
      const configs = createDefaultWidgetConfigs(mockT);
      expect(configs[WIDGET_TYPE_APPS]).toHaveProperty('elements');
      expect(configs[WIDGET_TYPE_APPS].elements).toHaveLength(1);
      expect(configs[WIDGET_TYPE_APPS].elements[0]).toHaveProperty('id');
      expect(configs[WIDGET_TYPE_APPS].elements[0]).toHaveProperty(
        'url',
        EXAMPLE_URL_WITH_TRAILING_SLASH
      );
    });

    it('should create config for links widget', () => {
      const configs = createDefaultWidgetConfigs(mockT);
      expect(configs[WIDGET_TYPE_LINKS]).toHaveProperty('title');
      expect(configs[WIDGET_TYPE_LINKS]).toHaveProperty('elements');
      expect(configs[WIDGET_TYPE_LINKS].elements).toHaveLength(1);
      expect(configs[WIDGET_TYPE_LINKS].elements[0]).toHaveProperty('id');
      expect(configs[WIDGET_TYPE_LINKS].elements[0]).toHaveProperty('label');
      expect(configs[WIDGET_TYPE_LINKS].elements[0]).toHaveProperty('url', EXAMPLE_URL);
    });

    it('should create config for clock widget', () => {
      const configs = createDefaultWidgetConfigs(mockT);
      expect(configs[WIDGET_TYPE_CLOCK]).toEqual({});
    });

    it('should create config for stopwatch widget', () => {
      const configs = createDefaultWidgetConfigs(mockT);
      expect(configs[WIDGET_TYPE_STOPWATCH]).toEqual({});
    });

    it('should use translation function for links widget', () => {
      createDefaultWidgetConfigs(mockT);
      expect(mockT).toHaveBeenCalledWith('ui.newCategory');
      expect(mockT).toHaveBeenCalledWith('ui.exampleLink');
    });
  });

  describe('getWidgetOptions', () => {
    const mockT = vi.fn((key: string) => key);

    it('should return all widget options', () => {
      const options = getWidgetOptions(mockT);
      expect(options).toHaveLength(5);
    });

    it('should return search widget option with correct structure', () => {
      const options = getWidgetOptions(mockT);
      const searchOption = options.find(opt => opt.type === WIDGET_TYPE_SEARCH);
      expect(searchOption).toBeDefined();
      expect(searchOption?.label).toBe('widgets.search.label');
      expect(searchOption?.description).toBe('widgets.search.description');
      expect(searchOption?.variants).toHaveLength(3);
    });

    it('should return apps widget option with all variants', () => {
      const options = getWidgetOptions(mockT);
      const appsOption = options.find(opt => opt.type === WIDGET_TYPE_APPS);
      expect(appsOption).toBeDefined();
      expect(appsOption?.variants.length).toBeGreaterThan(10);
    });

    it('should return links widget option', () => {
      const options = getWidgetOptions(mockT);
      const linksOption = options.find(opt => opt.type === WIDGET_TYPE_LINKS);
      expect(linksOption).toBeDefined();
      expect(linksOption?.variants).toHaveLength(4);
    });

    it('should return clock widget option with single variant', () => {
      const options = getWidgetOptions(mockT);
      const clockOption = options.find(opt => opt.type === WIDGET_TYPE_CLOCK);
      expect(clockOption).toBeDefined();
      expect(clockOption?.variants).toHaveLength(1);
      expect(clockOption?.variants[0]).toEqual({ rowSpan: 1, columnSpan: 1 });
    });

    it('should return stopwatch widget option with single variant', () => {
      const options = getWidgetOptions(mockT);
      const stopwatchOption = options.find(opt => opt.type === WIDGET_TYPE_STOPWATCH);
      expect(stopwatchOption).toBeDefined();
      expect(stopwatchOption?.variants).toHaveLength(1);
      expect(stopwatchOption?.variants[0]).toEqual({ rowSpan: 1, columnSpan: 1 });
    });

    it('should call translation function for all labels and descriptions', () => {
      getWidgetOptions(mockT);
      expect(mockT).toHaveBeenCalledWith('widgets.search.label');
      expect(mockT).toHaveBeenCalledWith('widgets.search.description');
      expect(mockT).toHaveBeenCalledWith('widgets.apps.label');
      expect(mockT).toHaveBeenCalledWith('widgets.links.label');
      expect(mockT).toHaveBeenCalledWith('widgets.clock.label');
      expect(mockT).toHaveBeenCalledWith('widgets.stopwatch.label');
    });
  });
});
