import {
  Plugin,
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  DataPublicPlugin,
  VisualizationsSetup,
  ExpressionsPublicPlugin
} from './imports';

import { definition } from './definition';
import { factory } from './factory';



export interface CalcMetricsPluginSetupDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  data: ReturnType<DataPublicPlugin['setup']>;
  __LEGACY?: any;
}

export class CalcMetricsVisPlugin implements Plugin<void, void> {
  
  public initializerContext: PluginInitializerContext;

  constructor(context: PluginInitializerContext) {
    this.initializerContext = context;
  }

  public setup(core: CoreSetup, { data, expressions, visualizations, __LEGACY }: CalcMetricsPluginSetupDependencies) {
    if (__LEGACY && 'function' === typeof __LEGACY.setup) {
      __LEGACY.setup();
    }
    expressions.registerFunction(factory);

    visualizations.types.createReactVisualization(definition());
  }

  public start(core: CoreStart): void {}

}
