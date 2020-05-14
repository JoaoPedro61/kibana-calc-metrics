import { resolve } from 'path';
import { Legacy } from './../../kibana';
import { LegacyPluginApi, LegacyPluginInitializer } from './../../src/legacy/types';



const kbnCalcMetricsVisPluginInitializer: LegacyPluginInitializer = ({ Plugin }: LegacyPluginApi) => {
  return new Plugin({
    require: ['elasticsearch', 'kibana', 'visualizations', 'interpreter', 'data'],
    name: 'kbn-calc-metrics',
    uiExports: {
      visTypes: [
        'plugins/kbn-calc-metrics/legacy'
      ],
      hacks: [
        resolve(__dirname, 'public/legacy')
      ],
      injectDefaultVars: server => ({}),
    },
    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
    init: (server: Legacy.Server, options) => ({}),
  });
}

export default kbnCalcMetricsVisPluginInitializer;
