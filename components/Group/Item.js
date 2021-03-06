import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { BAMBOO_COMPONENT } from '../utils/componentUtil';
import { wrapperEventValue } from '../utils/eventUtil';

import Button from '../Button';
import { BAMBOO_FORM_RADIO } from '../Form/Radio';

export const BAMBOO_GROUP_ITEM = 'BAMBOO_GROUP_ITEM';


class Item extends React.Component {
	setRef = (ele) => {
		this.$ele = ele;
	};

	render() {
		const {
			style = {}, width, children, isFirst, isLast, value, onChange, className,
			...props
		} = this.props;
		if (width) style.width = width;

		let $child = React.Children.only(children);

		if (
			React.isValidElement($child) &&
			$child.type &&
			$child.type[BAMBOO_COMPONENT] === BAMBOO_FORM_RADIO
		) {
			const { onClick, type, transparent, ...restProps } = $child.props;
			const checked = restProps.value === value;

			$child = (
				<Button
					checked={checked}
					type={checked || !transparent ? type : 'weak'}
					transparent={transparent}
					{...restProps}
					ref={this.setRef}
					onClick={(...args) => {
						const event = args[0];
						if (onChange) onChange(wrapperEventValue(event, this.$ele, restProps.value));
						if (onClick) onClick(...args);
					}}
				/>
			);
		}

		return (
			<div
				className={classNames('bmbo-group-item', {
					'bmbo-first': isFirst && !isLast,
					'bmbo-last': isLast && !isFirst,
					'bmbo-middle': !isFirst && !isLast,
					className,
				})}
				style={style}
				{...props}
			>
				{$child}
			</div>
		);
	}
}

Item.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	style: PropTypes.object,
	width: PropTypes.string,
	isFirst: PropTypes.bool,
	isLast: PropTypes.bool,
	value: PropTypes.node,
	onChange: PropTypes.func,
};

Item[BAMBOO_COMPONENT] = BAMBOO_GROUP_ITEM;

export default Item;
