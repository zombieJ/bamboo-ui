import React from 'react';

import {
	Row, Col,
	Form, Input, Radio, Checkbox, Slider,
} from '../../../components';

import { TYPE_LIST, SIZE_LIST } from '../../utils/enum';
import { toString } from '../../utils/propsUtil';

const MARKS_SAMPLE = {
	20: {
		title: '粘附',
		stick: 3,
	},
	60: '合格',
	75: '良好',
	90: '优秀',
};

class SliderPage extends React.Component {
	constructor() {
		super();
		this.state = {
			value: 0,

			form: {
				type: 'primary',
				size: 'md',
				value: 50,
				min: 0,
				max: 100,
				step: 1,
				hasStep: true,
				multi: 2,
				hasMulti: false,
				disabled: false,
				transparent: false,
				hasMarks: true,
			},
		};
	}

	onFormChanged = () => {
		const { form } = this.state;
		const { value, hasMulti, multi } = form;

		if (hasMulti && multi > 1 && !Array.isArray(value)) {
			this.setState({
				form: {
					...form,
					value: [value],
				},
			});
		} else if ((!hasMulti || multi <= 1) && Array.isArray(value)) {
			this.setState({
				form: {
					...form,
					value: value[0],
				},
			});
		}
	};

	getSampleCode = () => {
		const form = { ...this.state.form };
		form.min = Number(form.min);
		form.max = Number(form.max);
		form.step = Number(form.step);
		form.multi = Number(form.multi);

		if (!form.hasStep) form.step = null;
		if (!form.hasMulti) delete form.multi;

		const markStr = form.hasMarks ? ' marks={markList}' : '';

		delete form.hasStep;
		delete form.hasMulti;
		delete form.hasMarks;

		const defaultProps = {
			type: 'primary',
			size: 'md',
			min: 0,
			max: 100,
			step: 1,
		};

		return `<Slider${toString(form, defaultProps)}${markStr} />`
			.replace(/\t/g, '   ').trim();
	};

	render() {
		const { form } = this.state;

		return (
			<div>
				<h1>滑动条</h1>
				<p>
					提供了单值以及范围选取的功能。
				</p>

				<Form instance={this}>
					<Form.Field name="value">
						<Slider type="primary" />
					</Form.Field>
				</Form>

				<h2>试一试</h2>
				<Form instance={this} path="form" onChanged={this.onFormChanged}>
					<div className="measurement">
						<div className="preview">
							<Form.Field name="value">
								<Slider
									type={form.type}
									size={form.size}
									step={form.hasStep ? form.step : null}
									min={form.min}
									max={form.max}
									multi={form.hasMulti ? form.multi : false}
									disabled={form.disabled}
									transparent={form.transparent}
									marks={form.hasMarks ? MARKS_SAMPLE : undefined}
								/>
							</Form.Field>
							Current Value: {JSON.stringify(form.value)}
						</div>

						<div className="form">
							<Form.Field name="type" title="Type">
								{TYPE_LIST.map(({ name, isDefault }) => (
									<Radio key={name} value={name}>
										{name}
										{isDefault && ' (default)'}
									</Radio>
								))}
							</Form.Field>
							<Form.Field name="size" title="Size">
								{SIZE_LIST.map(({ name, displayName, isDefault }) => (
									<Radio key={name} value={name}>
										{displayName}
										{isDefault && ' (default)'}
									</Radio>
								))}
							</Form.Field>
							<Form.Field name="value" title="Value">
								{(!form.hasMulti || form.multi <= 1) && <Input type="number" />}
								{(form.hasMulti && form.multi > 1) &&
									<Input disabled value={JSON.stringify(form.value)} />}
							</Form.Field>
							<Form.Field name="min" title="Min">
								<Input type="number" />
							</Form.Field>
							<Form.Field name="max" title="Max">
								<Input type="number" />
							</Form.Field>

							<Form.Field name="hasStep" title="Use Step">
								<Checkbox>Use Step</Checkbox>
							</Form.Field>
							{form.hasStep && <Form.Field name="step" title="Step ( > 0)">
								<Input type="number" />
							</Form.Field>}

							<Form.Field name="hasMulti" title="Use Multi">
								<Checkbox>Use Multi</Checkbox>
							</Form.Field>
							{form.hasMulti && <Form.Field name="multi" title="Multi ( >= 1)">
								<Input type="number" />
							</Form.Field>}

							<Form.Field name="disabled" title="Disabled">
								<Checkbox>disabled</Checkbox>
							</Form.Field>
							<Form.Field name="transparent" title="Transparent">
								<Checkbox>transparent</Checkbox>
							</Form.Field>
							<Form.Field name="hasMarks" title="Marks">
								<Checkbox>marks</Checkbox>
								{form.hasMarks && <pre>
									{'Marks Sample:\n'}
									{'const markList = '}
									{JSON.stringify(MARKS_SAMPLE, null, 3)}
								</pre>}
							</Form.Field>
						</div>

						<pre className="code">{this.getSampleCode()}</pre>
					</div>
				</Form>
			</div>
		);
	}
}

SliderPage.propTypes = {
};

export default SliderPage;
