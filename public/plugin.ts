/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { i18n } from '@kbn/i18n';
import { CoreSetup, CoreStart, Plugin, PluginInitializerContext } from '../../../src/core/public';
import {
  DatepickerPluginSetup,
  DatepickerPluginStart,
  AppPluginStartDependencies,
} from './types';
import { PLUGIN_NAME, PLUGIN_ID } from '../common';

import { renderVis } from './application';


export class DatepickerPlugin implements Plugin<DatepickerPluginSetup, DatepickerPluginStart> {

  constructor(private readonly initializerContext: PluginInitializerContext) { }

  public setup(core: CoreSetup, { data, expressions, visualizations }: AppPluginStartDependencies): DatepickerPluginSetup {
    renderVis(PLUGIN_ID, PLUGIN_NAME, { data, expressions, visualizations });
    return {
      getGreeting() {
        return i18n.translate('kbnDatepicker.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): DatepickerPluginStart {
    return {};
  }

  public stop() {}

}
