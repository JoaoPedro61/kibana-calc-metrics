export { npSetup, npStart } from 'ui/new_platform';
export { getFormat } from 'ui/visualize/loader/pipeline_helpers/utilities';
export { AggGroupNames, VisOptionsProps } from 'ui/vis';
// @ts-ignore
export { Schemas } from 'ui/vis/editors/default/schemas';
// @ts-ignore
//
export { i18n } from '@kbn/i18n';

// @ts-ignore
export { vislibColorMaps } from '../../../src/legacy/ui/public/vislib/components/color/colormaps';

export { legacyResponseHandlerProvider } from 'ui/vis/response_handlers/legacy';

// @ts-ignore
export { PrivateProvider } from 'ui/private/private';
// @ts-ignore
export { PaginateDirectiveProvider } from 'ui/directives/paginate';
// @ts-ignore
export { PaginateControlsDirectiveProvider } from 'ui/directives/paginate';
// @ts-ignore
export { watchMultiDecorator } from 'ui/directives/watch_multi/watch_multi';

// @ts-ignore
export { KbnAccessibleClickProvider } from 'ui/accessibility/kbn_accessible_click';
// @ts-ignore
export { StateManagementConfigProvider } from 'ui/state_management/config_provider';

// export { setup as visualizationsSetup, VisualizationsSetup, visualizations } from './../../../src/legacy/core_plugins/visualizations/public';
// export { setup as visualizationsSetup, VisualizationsSetup, visualizations } from 'plugins/visualizations';
// export { VisualizationsSetup } from './../../../src/visualizations/public';
export { Status, VisualizationsSetup, SchemaConfig } from './../../../src/legacy/core_plugins/visualizations/public';
export { setup as visualizationsSetup } from './../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';

export { Plugin as ExpressionsPublicPlugin, ExpressionFunction, Render } from './../../../src/plugins/expressions/public';

export { PluginInitializerContext, CoreSetup, CoreStart, Plugin, IUiSettingsClient } from './../../../src/core/public';

export { Plugin as DataPublicPlugin } from './../../../src/plugins/data/public';

export {
  ExpressionFunction as InterpreterExpressionFunction,
  KibanaDatatable as InterpreterKibanaDatatable,
  Render as InterpreterRender,
  Range as InterpreterRange,
  Style as InterpreterStyle
} from 'plugins/interpreter';

export {
  NumberInputOption,
  SwitchOption,
  SelectOption,
} from './../../../src/legacy/core_plugins/kbn_vislib_vis_types/public/components/common';

export {
	changeTimeFilter,
	extractTimeFilter
} from './../../../src/plugins/data/public/query/timefilter';
