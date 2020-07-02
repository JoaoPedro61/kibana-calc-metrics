/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


import { VisComponent } from './components/visualization';
import { OptionsComponent } from './components/options';

import { Schemas } from '../../../../src/plugins/vis_default_editor/public';
import { colorSchemas as vislibColorMaps } from '../../../../src/plugins/charts/public';
import { ExpressionsStart } from '../../../../src/plugins/expressions/public';
import { VisualizationsSetup } from '../../../../src/plugins/visualizations/public';
import { DataPublicPluginStart } from '../../../../src/plugins/data/public';


export interface DatepickerPluginVisualizationDeps {
  [x: string]: any;
  expressions: ExpressionsStart;
  data: DataPublicPluginStart;
  visualizations: VisualizationsSetup;
}

export function renderVis(id: string, name: string, deps: DatepickerPluginVisualizationDeps): void {
  const _fac = () => ({
    name,
    type: 'render',
    context: {
      types: ['kibana_datatable'],
    },
    help: 'Metric visualization',
    args: {
      percentage: {
        types: ['boolean'],
        default: false,
        help: 'Shows metric in percentage mode. Requires colorRange to be set.',
      },
      colorScheme: {
        types: ['string'],
        default: '"Green to Red"',
        options: Object.values(vislibColorMaps).map((value: any) => value.id),
        help: 'Color scheme to use.',
      },
      colorMode: {
        types: ['string'],
        default: '"None"',
        options: ['None', 'Label', 'Background'],
        help: 'Which part of metric to color.',
      },
      colorRange: {
        types: ['range'],
        multi: true,
        help: 'A range object specifying groups of values to which different colors should be applied.',
      },
      useRanges: {
        types: ['boolean'],
        default: false,
        help: 'Enabled color ranges.',
      },
      invertColors: {
        types: ['boolean'],
        default: false,
        help: 'Inverts the color ranges.',
      },
      showLabels: {
        types: ['boolean'],
        default: true,
        help: 'Shows labels under the metric values.',
      },
      bgFill: {
        types: ['string'],
        default: '"#000"',
        aliases: ['backgroundFill', 'bgColor', 'backgroundColor'],
        help: 'Color as html hex code (#123456), html color (red, blue) or rgba value (rgba(255,255,255,1)).',
      },
      font: {
        types: ['style'],
        help: 'Font settings.',
        default: '{font size=60}',
      },
      subText: {
        types: ['string'],
        aliases: ['label', 'text', 'description'],
        default: '""',
        help: 'Custom text to show under the metric.',
      },
      metric: {
        types: ['vis_dimension'],
        help: 'Metric dimension configuration.',
        required: true,
        multi: true,
      },
      bucket: {
        types: ['vis_dimension'],
        help: 'Bucket dimension configuration.',
      },
    },
    fn(context: any, args: any) {
      const dimensions: any = {
        metrics: args.metric,
      };

      if (args.bucket) {
        dimensions.bucket = args.bucket;
      }

      if (args.percentage && (!args.colorRange || args.colorRange.length === 0)) {
        throw new Error('colorRange must be provided when using percentage');
      }

      const fontSize = Number.parseInt(args.font.spec.fontSize, 10);

      return {
        type: 'render',
        as: 'visualization',
        value: {
          visData: context,
          visType: 'metric',
          visConfig: {
            metric: {
              percentageMode: args.percentage,
              useRanges: args.useRanges,
              colorSchema: args.colorScheme,
              metricColorMode: args.colorMode,
              colorsRange: args.colorRange,
              labels: {
                show: args.showLabels,
              },
              invertColors: args.invertColors,
              style: {
                bgFill: args.bgFill,
                bgColor: args.colorMode === 'Background',
                labelColor: args.colorMode === 'Labels',
                subText: args.subText,
                fontSize,
              },
            },
            dimensions,
          },
          params: {
            listenOnChange: true,
          },
        },
      };
    },
  });

  const _def = (deps: any) => ({
    name,
    id,
    type: 'render',
    title: 'Extended Metric',
    icon: 'visMetric',
    description: 'Based on the core Metric-Plugin but gives you the ability to output custom aggregates on metric-results.',
    visConfig: {
      component: VisComponent,
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
      dependencies: {
        data: deps.data
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
  });
  try {
    (deps.expressions as any).registerFunction(_fac);
  } catch (_) {
    console.log('_', _);
  }
  deps.visualizations.createReactVisualization(_def(deps));
}
