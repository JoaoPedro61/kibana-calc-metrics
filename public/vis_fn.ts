import { i18n } from '@kbn/i18n';

// @ts-ignore
import { vislibColorMaps } from '../../../src/plugins/charts/public';
import { ExpressionFunction, KibanaDatatable, Render, Range, Style } from './../../../src/plugins/interpreter/public';

type Context = KibanaDatatable;

const name = 'calcMetricVis';

interface Arguments {
  percentage: boolean;
  colorScheme: string;
  colorMode: string;
  useRanges: boolean;
  invertColors: boolean;
  showLabels: boolean;
  bgFill: string;
  subText: string;
  colorRange: Range[];
  font: Style;
  metric: any[]; // these aren't typed yet
  bucket: any; // these aren't typed yet
}

interface VisParams {
  dimensions: DimensionsVisParam;
  metric: MetricVisParam;
}

interface DimensionsVisParam {
  metrics: any;
  bucket?: any;
}

interface MetricVisParam {
  percentageMode: Arguments['percentage'];
  useRanges: Arguments['useRanges'];
  colorSchema: Arguments['colorScheme'];
  metricColorMode: Arguments['colorMode'];
  colorsRange: Arguments['colorRange'];
  labels: {
    show: Arguments['showLabels'];
  };
  invertColors: Arguments['invertColors'];
  style: {
    bgFill: Arguments['bgFill'];
    bgColor: boolean;
    labelColor: boolean;
    subText: Arguments['subText'];
    fontSize: number;
  };
}

interface RenderValue {
  visType: 'metric';
  visData: Context;
  visConfig: VisParams;
  params: any;
}

type Return = Render<RenderValue>;

export const visFn = (): ExpressionFunction<
  typeof name,
  Context,
  Arguments,
  Return
> => ({
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
  fn(context: Context, args: Arguments) {
    const dimensions: DimensionsVisParam = {
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
