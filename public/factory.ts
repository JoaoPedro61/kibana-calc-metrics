import {
  i18n,
  vislibColorMaps,
  InterpreterExpressionFunction,
  InterpreterKibanaDatatable,
  InterpreterRender,
  InterpreterRange,
  InterpreterStyle
} from './imports';


type Context = InterpreterKibanaDatatable;

const name = 'calcMetrics';

interface Arguments {
  percentage: boolean;
  colorScheme: string;
  colorMode: string;
  useRanges: boolean;
  invertColors: boolean;
  showLabels: boolean;
  bgFill: string;
  subText: string;
  colorRange: InterpreterRange[];
  font: InterpreterStyle;
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

type Return = InterpreterRender<RenderValue>;

export const factory = (): InterpreterExpressionFunction<
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
  help: i18n.translate('visTypeMetric.function.help', {
    defaultMessage: 'Metric visualization',
  }),
  args: {
    percentage: {
      types: ['boolean'],
      default: false,
      help: i18n.translate('visTypeMetric.function.percentage.help', {
        defaultMessage: 'Shows metric in percentage mode. Requires colorRange to be set.',
      }),
    },
    colorScheme: {
      types: ['string'],
      default: '"Green to Red"',
      options: Object.values(vislibColorMaps).map((value: any) => value.id),
      help: i18n.translate('visTypeMetric.function.colorScheme.help', {
        defaultMessage: 'Color scheme to use',
      }),
    },
    colorMode: {
      types: ['string'],
      default: '"None"',
      options: ['None', 'Label', 'Background'],
      help: i18n.translate('visTypeMetric.function.colorMode.help', {
        defaultMessage: 'Which part of metric to color',
      }),
    },
    colorRange: {
      types: ['range'],
      multi: true,
      help: i18n.translate('visTypeMetric.function.colorRange.help', {
        defaultMessage:
          'A range object specifying groups of values to which different colors should be applied.',
      }),
    },
    useRanges: {
      types: ['boolean'],
      default: false,
      help: i18n.translate('visTypeMetric.function.useRanges.help', {
        defaultMessage: 'Enabled color ranges.',
      }),
    },
    invertColors: {
      types: ['boolean'],
      default: false,
      help: i18n.translate('visTypeMetric.function.invertColors.help', {
        defaultMessage: 'Inverts the color ranges',
      }),
    },
    showLabels: {
      types: ['boolean'],
      default: true,
      help: i18n.translate('visTypeMetric.function.showLabels.help', {
        defaultMessage: 'Shows labels under the metric values.',
      }),
    },
    bgFill: {
      types: ['string'],
      default: '"#000"',
      aliases: ['backgroundFill', 'bgColor', 'backgroundColor'],
      help: i18n.translate('visTypeMetric.function.bgFill.help', {
        defaultMessage:
          'Color as html hex code (#123456), html color (red, blue) or rgba value (rgba(255,255,255,1)).',
      }),
    },
    font: {
      types: ['style'],
      help: i18n.translate('visTypeMetric.function.font.help', {
        defaultMessage: 'Font settings.',
      }),
      default: '{font size=60}',
    },
    subText: {
      types: ['string'],
      aliases: ['label', 'text', 'description'],
      default: '""',
      help: i18n.translate('visTypeMetric.function.subText.help', {
        defaultMessage: 'Custom text to show under the metric',
      }),
    },
    metric: {
      types: ['vis_dimension'],
      help: i18n.translate('visTypeMetric.function.metric.help', {
        defaultMessage: 'metric dimension configuration',
      }),
      required: true,
      multi: true,
    },
    bucket: {
      types: ['vis_dimension'],
      help: i18n.translate('visTypeMetric.function.bucket.help', {
        defaultMessage: 'bucket dimension configuration',
      }),
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
        visType: 'calcMetrics',
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

