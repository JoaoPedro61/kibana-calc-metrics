import { PluginInitializerContext } from './imports';
import { CalcMetricsVisPlugin as Plugin } from './plugin';



export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext);
}
