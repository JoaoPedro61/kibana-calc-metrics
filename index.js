import exampleRoute from './server/routes/example';

export default function(kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'kbn_calc_metrics',
    uiExports: {
      hacks: ['plugins/kbn_calc_metrics/hack'],
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    // eslint-disable-next-line no-unused-vars
    init(server, options) {
      // Add server routes and initialize the plugin here
      exampleRoute(server);
    },
  });
}
