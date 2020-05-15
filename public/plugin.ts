export { Plugin as ExpressionsPublicPlugin } from './../../../src/plugins/expressions/public';
export { PluginInitializerContext, CoreSetup, CoreStart, Plugin, IUiSettingsClient } from './../../../src/core/public';
import { LegacyDependenciesPlugin } from './shim';
import { Plugin as DataPublicPlugin } from '../../../src/plugins/data/public';
import { VisualizationsSetup } from 'plugins/visualizations';

import { visFn } from './vis_fn';
// @ts-ignore
import { visTypeDefinition } from './vis_type';




/** @internal */
export interface MetricVisPluginSetupDependencies {
  data: ReturnType<DataPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  __LEGACY: LegacyDependenciesPlugin;
}



/** @internal */
export class MetricVisPlugin implements Plugin<void, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public setup(
    core: CoreSetup,
    { data, visualizations, expressions, __LEGACY }: MetricVisPluginSetupDependencies
  ) {
    __LEGACY.setup();

    expressions.registerFunction(visFn);
    visualizations.types.createReactVisualization(visTypeDefinition());
  }

  public start(core: CoreStart) {
    // nothing to do here yet
  }
}
