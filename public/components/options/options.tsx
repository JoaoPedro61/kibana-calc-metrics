import React, { Fragment, useRef, useState, useEffect } from 'react';
import * as _ from 'lodash';


import {
	EuiPanel,
	EuiTitle,
	EuiSpacer,
	EuiForm,
	EuiFormRow,
	EuiFieldText,
	EuiFormLabel,
	EuiSwitch,
	EuiTextArea,
	EuiAccordion,
	EuiFlexGroup,
	EuiFlexItem,
	EuiButton,
	EuiButtonIcon,
	EuiText,
	EuiFormControlLayoutDelimited,
	EuiSelect,
	EuiButtonEmpty,
	EuiRange
} from '@elastic/eui';



export function OptionsComponent({ setValue, setValidity, stateParams, uiState, vis }) {

	let { metric: __MTRS } = stateParams;

	const collections = vis.type.editorConfig.collections;

	if (__MTRS) {
		if ((!__MTRS.formulas || __MTRS.formulas.length === 0)) {
			let _metric = { ...__MTRS };
			
			__MTRS = {
				..._metric,
				formulas: [
					{
						label: "Calculated Value",
						formula: ""
					}
				]
			};
		}
		if (!__MTRS.hasOwnProperty(`counter`)) {
			__MTRS.counter = 0;
		} else {
			if (__MTRS.counter > 1000) {
				__MTRS.counter = 0;
			}
		}
		setValue(`metric`, {...__MTRS});
	}

	const [ customColors, setCustomColors ] = useState<any>(false);

	const [ currentStateOfMetric, setNextStateOfMetric ] = useState<any>({...__MTRS});

	useEffect(() => {
		let didCancel = false;
		if (!didCancel) {
			uiState.once(`colorChanged`, () => {
				if (!customColors) {
					setCustomColors(true);
				}
			});
		}
		return () => {
			didCancel = true;
		};
	}, [])
	
	function _setColorMode(mode: string) {
		const _metric = {...currentStateOfMetric};
		let didUpdate = true;
		if (_metric.metricColorMode !== mode) {
			_metric.metricColorMode = mode;
			switch (mode) {
				case 'Labels':
					_metric.style.labelColor = true;
					_metric.style.bgColor = false;
					break;
				case 'Background':
					_metric.style.labelColor = false;
					_metric.style.bgColor = true;
					break;
				case 'None':
					_metric.style.labelColor = false;
					_metric.style.bgColor = false;
					break;
			}
		} else {
			didUpdate = false;
		}
		if (didUpdate) {
			setValue(_metric);
			setNextStateOfMetric(_metric);
		}
	}

	function _setColorSchema(value: string) {
		const _metric = { ...currentStateOfMetric };

		_metric.colorSchema = value;
		setValue(`metric`, _metric);
		setNextStateOfMetric(_metric);
	}

	function _setInvertColors(value: boolean) {
		const _metric = { ...currentStateOfMetric };
		_metric.invertColors = value;
		setValue(`metric`, _metric);
		setNextStateOfMetric(_metric);
	}

	function _setFontSize(value: string) {
		if (/^\d+.$/.test(value)) {
			try {
				const _metric = { ...currentStateOfMetric };
				const parsed = parseInt(value, 10);
				_metric.style.fontSize = parsed;

				_metric.counter += 1;
				setValue(`metric`, _metric);
				setNextStateOfMetric(_metric);
			} catch(e) {
				throw new Error(e);
			}
		}
	}

	function _resetColors(): void {
		uiState.set(`vis.colors`, null);
		if (customColors) {
			setCustomColors(false);
		}
	}

	function _addRange(): void {
		const _metric = { ...currentStateOfMetric };
		const prev: any = _.last(_metric.colorsRange);
		const from =  prev ?  prev.to : 0;
		const to = prev ? from + (prev.to - prev.from) : 100;
		_metric.colorsRange.push({ from, to });

		_metric.counter += 1;
		setValue(`metric`, _metric);
		setNextStateOfMetric(_metric);
	}

	function _removeRange(index: number): void {
		const _metric = { ...currentStateOfMetric };
		_metric.colorsRange.splice(index, 1);

		_metric.counter += 1;
		setValue(`metric`, _metric);
		setNextStateOfMetric(_metric);
	}

	function _getGreaterThan(index: number): number {
		if (index === 0) return -Infinity;
		return currentStateOfMetric.colorsRange[index - 1].to;
	}

	function _setFormulaValue(index: number, target: string, value: any): void {
		const _metric = { ...currentStateOfMetric };
		if (_metric) {
			if (_metric.formulas.length) {
				if (_metric.formulas[index]) {
					if (_metric.formulas[index][target] !== value) {
						_metric.formulas[index][target] = value;

						_metric.counter += 1;
						setValue(`metric`, _metric);
						setNextStateOfMetric(_metric);
					}
				}
			}
		}
	}

	function _setPercentageMode(value: boolean): void {
		const _metric = { ...currentStateOfMetric };
		_metric.percentageMode = value;

		setValue(`metric`, _metric);
		setNextStateOfMetric(_metric);
	}

	function _setMetricLabelsShow(value: boolean): void {
		const _metric = { ...currentStateOfMetric };
		_metric.labels.show = value;

		_metric.counter += 1;
		setValue(`metric`, _metric);
		setNextStateOfMetric(_metric);
	}

	function _setColorRangeValue(index: number, target: string, value: number | string): void {
		try {
			let parsed: number;
			if (typeof value === `string`) {
				parsed = parseInt(value, 10);
			} else {
				parsed = value;
			}
			const _metric = { ...currentStateOfMetric };
			if (_metric) {
				if (_metric.formulas.length) {
					if (_metric.formulas[index]) {
						if (_metric.formulas[index][target] !== parsed) {
							_metric.formulas[index][target] = parsed;
							_metric.counter += 1;
							setValue(`metric`, _metric);
							setNextStateOfMetric(_metric);
						}
					}
				}
			}
		} catch(e) {
			throw new Error(e);
		}
	}

	function _generate_formulas() {
		const panels = (currentStateOfMetric.formulas || []).map((item: any, index: number) => {
			return (
				<Fragment key={`formula-${index}`}>
					<EuiPanel>
						<EuiTitle size="xxs">
							<h2>#{index}</h2>
						</EuiTitle>
						<EuiSpacer size="s" />
						<EuiForm>
							<EuiFormRow label="Name" fullWidth>
								<EuiFieldText 
									required
									fullWidth
									compressed
									defaultValue={item.label}
									onBlur={e => _setFormulaValue(index, `label`, e.target.value)}
								/>
							</EuiFormRow>
							<EuiSpacer size="s" />
							<EuiFormRow label="Formula" fullWidth>
								<EuiTextArea 
									required
									fullWidth
									compressed
									placeholder="metrics['value1'] * metrics['value2']"
									defaultValue={item.formula}
									onBlur={e => _setFormulaValue(index, `formula`, e.target.value)}
									rows={2}
								/>
							</EuiFormRow>
						</EuiForm>
					</EuiPanel>
				</Fragment>
			)
		});

		return (
			<Fragment>
				{panels}
			</Fragment>
		);
	}

	function _generate_metric_options_ranges() {
    const length = (currentStateOfMetric.colorsRange || []).length;
		const ranges = (currentStateOfMetric.colorsRange || []).map((item: any, index: number) => {
			let buttonFrag = (<></>);
      if (length > 1) {
        buttonFrag = (
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              color="danger"
              onClick={() => _removeRange(index)}
              aria-label="Remove this range"
            />
            <div style={{height: '4px'}}></div>
          </EuiFlexItem>
        );
      }

			return (
				<Fragment key={`color_range_${index}`}>
					<EuiSpacer size="s" />
					<EuiPanel paddingSize="s">
						<EuiFlexGroup alignItems="flexEnd" justifyContent="spaceBetween" gutterSize="s">
							<EuiFlexItem>
                <EuiSpacer size="s" />
                <EuiFormLabel>To / From</EuiFormLabel>
                <EuiFormControlLayoutDelimited
                  compressed={true}
                  fullWidth
                  startControl={
                    <input
                      type="number"
                      className="euiFieldNumber"
                      name="from"
                      defaultValue={item.from}
											min={_getGreaterThan(index)}
											max={item.from}
											placeholder="From"
											required
											step="any"
                      onBlur={e => _setColorRangeValue(index, `from`, e.target.value)}
                    />
                  }
                  endControl={
                    <input
                      type="number"
                      className="euiFieldNumber"
                      name="to"
                      defaultValue={item.to}
											placeholder="To"
											required
											min={item.from}
											step="any"
                      onBlur={e => _setColorRangeValue(index, `to`, e.target.value)}
                    />
                  }
                />
              </EuiFlexItem>
              {buttonFrag}
						</EuiFlexGroup>
					</EuiPanel>
				</Fragment>
			);
		});

		return (
			<Fragment>
				<EuiForm>
					{ranges}
					<EuiSpacer size="m" />
					<EuiFlexGroup gutterSize="none" alignItems="center" justifyContent="center">
						<EuiFlexItem>
							<EuiButton size="s" fullWidth={true} onClick={() => _addRange()}>
								<EuiText>Add range</EuiText>
							</EuiButton>
						</EuiFlexItem>
					</EuiFlexGroup>
				</EuiForm>
			</Fragment>
		);
	}

	function _generateColorOptions() {
		let fragment = (<></>);

		let diffOfNone = (<></>);

		let resetColors = (<></>);
		
		if (customColors) {
			resetColors = (
				<Fragment>
					<EuiButtonEmpty size="xs" onClick={() => _resetColors()}>
						Reset Colors
					</EuiButtonEmpty>
				</Fragment>
			);
		}

		if (currentStateOfMetric.metricColorMode !== `None`) {
			diffOfNone = (
				<Fragment>
					<EuiFormRow
						fullWidth
						label="Color Scheme"
						labelAppend={resetColors}
					>
						<EuiSelect 
							required
							fullWidth
							compressed
							options={collections.colorSchemas}
							value={currentStateOfMetric.colorSchema}
							onChange={e => _setColorSchema(e.target.value)}
						/>
					</EuiFormRow>
					<EuiSpacer size="s" />
				</Fragment>
			);
		}

		if (currentStateOfMetric.colorsRange.length > 1) {
			fragment = (
				<Fragment>
					<EuiSpacer size="m" />
					<EuiFormRow fullWidth>
						<EuiAccordion
							id={`metricOptionsColors`}
							buttonContent={
								(
									<EuiTitle size="xs">
										<h2>Colors options</h2>
									</EuiTitle>
								)
							}
						>
							<EuiSpacer size="s" />
							<EuiForm>
								<EuiFormRow label="Use color for" fullWidth>
									<EuiSelect 
										required
										fullWidth
										compressed
										options={collections.metricColorMode.map((item: Partial<any>) => ({ ...item, value: item.id, text: item.label }))}
										value={currentStateOfMetric.metricColorMode}
										onChange={e => _setColorMode(e.target.value)}
									/>
								</EuiFormRow>
								<EuiSpacer size="s" />
								{diffOfNone}
								<EuiFormRow fullWidth>
									<EuiSwitch
										label="Reverse color scheme"
										checked={currentStateOfMetric.invertColors}
										compressed
										onChange={e => _setInvertColors(e.target.checked)}
									/>
								</EuiFormRow>
								<EuiSpacer size="s" />
							</EuiForm>
						</EuiAccordion>
					</EuiFormRow>
				</Fragment>
			);
		}

		return fragment;
	}

	return (
		<Fragment>
			<EuiPanel>
				<EuiTitle size="xs">
				  <h2>Formulas</h2>
				</EuiTitle>
				<EuiSpacer size="s" />
				{_generate_formulas()}
				<EuiSpacer size="m" />
				<EuiTitle size="xs">
				  <h2>Options</h2>
				</EuiTitle>
				<EuiSpacer size="m" />
				<EuiForm>
					<EuiFormRow fullWidth>
						<EuiSwitch
							label="Percentage Mode"
							checked={currentStateOfMetric.percentageMode}
							compressed
							onChange={e => _setPercentageMode(e.target.checked)}
						/>
					</EuiFormRow>
					<EuiSpacer size="s" />
					<EuiFormRow fullWidth>
						<EuiSwitch
							compressed
							label="Show labels"
							checked={currentStateOfMetric.labels.show}
							onChange={e => _setMetricLabelsShow(e.target.checked)}
						/>
					</EuiFormRow>
					<EuiSpacer size="m" />
					<EuiFormRow fullWidth>
						<EuiAccordion
							id={`metricOptionsRanges`}
							buttonContent={
								(
									<EuiTitle size="xs">
										<h2>Colors ranges</h2>
									</EuiTitle>
								)
							}
						>
							<EuiSpacer size="s" />
							{_generate_metric_options_ranges()}
						</EuiAccordion>
					</EuiFormRow>
					{_generateColorOptions()}
					<EuiSpacer size="m" />
					<EuiFormRow fullWidth>
						<EuiAccordion
							id={`metricOptionsStyle`}
							buttonContent={
								(
									<EuiTitle size="xs">
										<h2>Styles</h2>
									</EuiTitle>
								)
							}
						>
							<EuiSpacer size="s" />
							<EuiFormRow
								label={`Font Size ${currentStateOfMetric.style.fontSize}pt`}
								fullWidth
							>
								<EuiRange
									min={12}
									max={120}
									step={1}
									compressed
									value={currentStateOfMetric.style.fontSize}
									onChange={e => {_setFontSize((e as any).target.value)}}
									showLabels
								/>
							</EuiFormRow>
						</EuiAccordion>
					</EuiFormRow>
				</EuiForm>
			</EuiPanel>
		</Fragment>
	);
}
