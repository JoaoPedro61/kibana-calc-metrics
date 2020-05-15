import { PluginInitializerContext } from 'kibana/public';
import { npSetup, npStart } from 'ui/new_platform';

import { setup as visualizationsSetup } from './../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';
import { MetricVisPluginSetupDependencies } from './plugin';
import { LegacyDependenciesPlugin } from './shim';
import { plugin } from '.';



const plugins: Readonly<MetricVisPluginSetupDependencies> = {
  expressions: npSetup.plugins.expressions,
  visualizations: visualizationsSetup,
  data: npSetup.plugins.data,

  // Temporary solution
  // It will be removed when all dependent services are migrated to the new platform.
  __LEGACY: new LegacyDependenciesPlugin(),
};

const pluginInstance = plugin({} as PluginInitializerContext);

export const setup = pluginInstance.setup(npSetup.core, plugins);
export const start = pluginInstance.start(npStart.core);
