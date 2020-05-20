export { Plugin as ExpressionsPublicPlugin } from './../../../src/plugins/expressions/public';
export { PluginInitializerContext, CoreSetup, CoreStart, Plugin, IUiSettingsClient } from './../../../src/core/public';
import { Plugin as DataPublicPlugin } from '../../../src/plugins/data/public';
import { VisualizationsSetup } from 'plugins/visualizations';

import { visFn } from './vis_fn';
import { visTypeDefinition } from './vis_type';





export interface MetricVisPluginSetupDependencies {
  data: ReturnType<DataPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
}

export class MetricVisPlugin implements Plugin<void, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public setup(
    core: CoreSetup,
    { data, visualizations, expressions }: MetricVisPluginSetupDependencies
  ) {
    expressions.registerFunction(visFn);
    visualizations.createReactVisualization(visTypeDefinition());
  }

  public start(core: CoreStart) { }

}
