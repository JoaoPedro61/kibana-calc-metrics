import { Schemas } from 'plugins/vis_default_editor';
import { colorSchemas as vislibColorMaps } from '../../../src/plugins/charts/public';
import { ExtendedMetricVisComponent } from './components/extended_metric_vis_controller';

import { OptionsComponent } from './components';


export const visTypeDefinition = () => {
  return {
    id: 'kbn_clt_mrs',
    name: 'kbn_clt_mrs',
    title: 'Extended Metric',
    icon: 'visMetric',
    description: 'Based on the core Metric-Plugin but gives you the ability to output custom aggregates on metric-results.',
    visConfig: {
      component: ExtendedMetricVisComponent,
      defaults: {
        addTooltip: true,
        addLegend: false,
        type: 'metric',
        metric: {
          percentageMode: false,
          useRanges: false,
          colorSchema: 'Green to Red',
          metricColorMode: 'None',
          colorsRange: [{ from: 0, to: 10000 }],
          labels: {
            show: true,
          },
          invertColors: false,
          style: {
            bgFill: '#000',
            bgColor: false,
            labelColor: false,
            subText: '',
            fontSize: 60,
          },
        },
      },
    },
    editorConfig: {
      optionsTemplate: OptionsComponent,
      collections: {
        metricColorMode: [
          {
            id: 'None',
            label: 'None',
          },
          {
            id: 'Labels',
            label: 'Labels',
          },
          {
            id: 'Background',
            label: 'Background',
          },
        ],
        colorSchemas: vislibColorMaps,
      },
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Metric',
          min: 1,
          aggFilter: [
            '!std_dev',
            '!geo_centroid',
            '!derivative',
            '!serial_diff',
            '!moving_avg',
            '!cumulative_sum',
            '!geo_bounds',
          ],
          aggSettings: {
            top_hits: {
              allowStrings: true,
            },
          },
          defaults: [
            {
              type: 'count',
              schema: 'metric',
            },
          ],
        },
        {
          group: 'buckets',
          name: 'group',
          title: 'Split group',
          min: 0,
          max: 1,
          aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
        },
      ]),
    },
  };
};
