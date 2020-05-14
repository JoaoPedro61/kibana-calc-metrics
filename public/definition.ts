import {
  i18n,
  Schemas,
  vislibColorMaps,
  Status
} from './imports';
import { ComponentVis } from './components/component.vis';
import { ComponentVisOptions } from './components/component.vis.options';



export const definition = (dependencies?) => {
  return {
    type: 'kbn-calc-metrics',
    name: 'kbn-calc-metrics',
    icon: 'metricbeatApp',
    title: 'Metrics Calc',
    description: 'Offers some features to perform calculations between aggregate data.',
    requiresUpdateStatus: [
      Status.AGGS,
      Status.DATA,
      Status.TIME,
      Status.UI_STATE,
      Status.TIME,
      Status.RESIZE
    ],
    visConfig: {
      component: ComponentVis,
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
      optionsTemplate: ComponentVisOptions,
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
    }
  };
};
