import { resolve } from 'path';



const calcMetricsPluginInitializer = ({Plugin}) => new Plugin({
  id: 'kbn_clt_mrs',
  require: ['kibana', 'elasticsearch', 'visualizations', 'interpreter'],
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
