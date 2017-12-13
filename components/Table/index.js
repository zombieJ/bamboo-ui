import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { mapChildrenByType } from '../utils/componentUtil';
import { getValue } from '../utils/pathUtil';

import Column, { BAMBOO_TABLE_COLUMN } from './Column';
import Pagination from '../Pagination';

class Table extends React.Component {
	constructor() {
		super();
		this.state = {
			page: 1,
			list: [],
		};
	}

	componentWillMount() {
		this.checkUpdate({}, this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.checkUpdate(this.props, nextProps);
	}

	getPage = () => {
		const { page } = this.props;
		return page === undefined ? this.state.page : page;
	};

	getColumnList = () => {
		const { children } = this.props;
		return mapChildrenByType(children, BAMBOO_TABLE_COLUMN);
	};

	getList = () => {
		const { pageSize, async, data } = this.props;
		const { list } = this.state;
		const page = this.getPage();

		if (async) {
			return data;
		}

		return list.slice((page - 1) * pageSize, page * pageSize);
	};

	checkUpdate = (prevProps, nextProps) => {
		if (prevProps.data === nextProps.data) return;

		this.setState({
			list: (nextProps.data || []).concat(),
		}, () => {
			// TODO: Support sort function
		});
	};

	gotoPage = (page) => {
		const { onPageChange } = this.props;
		this.setState({ page });

		if (onPageChange) onPageChange(page);
	};

	render() {
		const { className, pageSize, bordered, data, ...props } = this.props;
		delete props.page;
		delete props.onPageChange;

		const page = this.getPage();

		const columnList = this.getColumnList().map(c => c.props);
		const list = this.getList();

		return (
			<div className="bmbo-table-container">
				<table
					className={classNames(
						'bmbo-table',
						bordered && 'bmbo-bordered',
						className,
					)}

					{...props}
				>
					<thead>
						<tr>
							{columnList.map((column, colIndex) => (
								<td key={colIndex}>
									{column.title || column.name}
								</td>
							))}
						</tr>
					</thead>

					<tbody>
						{list.map((item, rowIndex) => (
							<tr key={rowIndex}>
								{columnList.map(({ name, render, ...column }, colIndex) => (
									<td key={colIndex} {...column}>
										{render ? render(item) : getValue(item, name)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>

				<div className="bmbo-table-pagination">
					<Pagination
						page={page}
						pageSize={pageSize}
						count={(data || []).length}
						gotoPage={this.gotoPage}
					/>
				</div>
			</div>
		);
	}
}

Table.propTypes = {
	className: PropTypes.string,
	bordered: PropTypes.bool,
	children: PropTypes.node,

	data: PropTypes.array,
	page: PropTypes.number,
	pageSize: PropTypes.number,
	onPageChange: PropTypes.func,

	async: PropTypes.bool,
};

Table.defaultProps = {
	pageSize: 10,
};

Table.Column = Column;

export default Table;
