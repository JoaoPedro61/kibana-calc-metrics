import { i18n } from '@kbn/i18n';

// @ts-ignore
import { Schemas } from '../../../src/legacy/ui/public/vis/editors/default/schemas';
import { vislibColorMaps } from '../../../src/legacy/ui/public/vislib/components/color/colormaps';
// @ts-ignore
import { ExtendedMetricVisComponent } from './components/extended_metric_vis_controller';


export const visTypeDefinition = () => {
  return {
    id: 'kbn_clt_mrs',
    name: 'kbn_clt_mrs',
    title: i18n.translate('visTypeMetric.metricTitle', { defaultMessage: 'Extended Metric' }),
    icon: 'visMetric',
    description: i18n.translate('visTypeMetric.metricDescription', {
      defaultMessage: 'Based on the core Metric-Plugin but gives you the ability' +
        'to output custom aggregates on metric-results.',
    }),
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
      collections: {
        metricColorMode: [
          {
            id: 'None',
            label: i18n.translate('visTypeMetric.colorModes.noneOptionLabel', {
              defaultMessage: 'None',
            }),
          },
          {
            id: 'Labels',
            label: i18n.translate('visTypeMetric.colorModes.labelsOptionLabel', {
              defaultMessage: 'Labels',
            }),
          },
          {
            id: 'Background',
            label: i18n.translate('visTypeMetric.colorModes.backgroundOptionLabel', {
              defaultMessage: 'Background',
            }),
          },
        ],
        colorSchemas: Object.values(vislibColorMaps).map((value: any) => ({
          id: value.id,
          label: value.label,
        })),
      },
      optionsTemplate: '<extended-metric-vis-params></extended-metric-vis-params>',
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: i18n.translate('visTypeMetric.schemas.metricTitle', { defaultMessage: 'Metric' }),
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
          title: i18n.translate('visTypeMetric.schemas.splitGroupTitle', {
            defaultMessage: 'Split group',
          }),
          min: 0,
          max: 1,
          aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
        },
      ]),
    },
  };
};
