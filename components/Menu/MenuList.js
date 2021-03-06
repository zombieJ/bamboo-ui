import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
	ANIMATE_STATUS_NONE, ANIMATE_STATUS_SHOWING, ANIMATE_STATUS_SHOWN,
	getEnablePosition, createPortal,
} from '../utils/uiUtil';
import Sequence from '../utils/Sequence';

import MenuItem from './MenuItem';

class MenuList extends React.Component {
	constructor() {
		super();
		this.state = {
			animateStatus: ANIMATE_STATUS_NONE,
		};
		this.seq = new Sequence();
	}

	componentDidMount() {
		const { x, y, width = 0, height = 0 } = this.props;
		const rect = this.$list.getBoundingClientRect();

		this.seq.next(() => {
			this.setState({
				...getEnablePosition({ left: x, top: y, width, height }, rect, 'r'),
				animateStatus: ANIMATE_STATUS_SHOWING,
			});
		}).next(() => {
			this.setState({
				animateStatus: ANIMATE_STATUS_SHOWN,
			});
		});
	}

	componentWillUnmount() {
		this.seq.destroy();
	}

	onMouseDown = (event) => {
		event.stopPropagation();
	};

	setRef = (ele) => {
		this.$list = ele;
	};

	render() {
		const { list = [] } = this.props;
		const { menuSize } = this.context;

		const { x, y, animateStatus } = this.state;

		return createPortal(
			<ul
				ref={this.setRef}
				className={classNames(
					'bmbo-box-absolute',
					'bmbo-menu-list',
					{
						'bmbo-hidden': animateStatus === ANIMATE_STATUS_NONE,
						'bmbo-showing': animateStatus === ANIMATE_STATUS_SHOWING,
					},
					`bmbo-${menuSize || 'md'}`,
				)}
				style={{ left: `${x}px`, top: `${y}px` }}
				role="presentation"
				tabIndex={-1}
				onMouseDown={this.onMouseDown}
			>
				{list.map((item, index) => {
					if (!item) return null;
					return <MenuItem key={index} item={item} />;
				})}
			</ul>,
		);
	}
}

MenuList.propTypes = {
	list: PropTypes.array,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
};

MenuList.contextTypes = {
	menuSize: PropTypes.string,
};

export default MenuList;
