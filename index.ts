import { resolve } from 'path';



const calcMetricsPluginInitializer = ({Plugin}) => new Plugin({
  id: 'kbn-calc-metrics',
  require: ['kibana', 'elasticsearch', 'visualizations', 'interpreter', 'data'],
  publicDir: resolve(__dirname, 'public'),
  uiExports: {
    styleSheetPaths: resolve(__dirname, 'public/index.css'),
    hacks: [
      resolve(__dirname, 'public/legacy')
    ],
    injectDefaultVars: server => ({})
  },
  init: server => ({}),

  config(Joi) {
    return Joi.object({
      enabled: Joi.boolean().default(true)
    }).default();
  }

});

export default calcMetricsPluginInitializer;
