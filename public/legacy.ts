import { PluginInitializerContext, npSetup, npStart, visualizationsSetup } from './imports';
import { CalcMetricsPluginSetupDependencies } from './plugin';
import { plugin } from './index';



const plugins: Readonly<CalcMetricsPluginSetupDependencies> = {
  expressions: npSetup.plugins.expressions,
  visualizations: visualizationsSetup,
  data: npSetup.plugins.data,
};

const pluginInstance = plugin({} as PluginInitializerContext);

export const setup = pluginInstance.setup(npSetup.core, plugins);
export const start = pluginInstance.start(npStart.core);
