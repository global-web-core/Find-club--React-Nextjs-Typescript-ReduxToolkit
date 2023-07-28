import React, { useEffect, useState } from 'react';
import { ArrowNavigation } from '../../components';
import styles from './Pagination.module.css';
import { PaginationProps } from './Pagination.props';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { PaginationSlice } from '../../store/slices';
import { useAppDispatch, useAppSelector } from '../../store/hook';

export const Pagination = ({namePagination}: PaginationProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const currentPagination = useAppSelector(state => PaginationSlice.paginationSelect(state, namePagination));

	// useEffect(() => {
	// 	if (maxPage > 0 && namePagination) {
	// 		dispatch(PaginationSlice.setPagination({maxPage, namePagination}));
	// 	}

	// }, [namePagination, maxPage])

	return (
		<>
			{currentPagination?.currentPage > 0 && currentPagination?.maxPage > 0 &&
				<div className={styles.pagination}>
				<ArrowNavigation direction={'left'} onClick={() => dispatch(PaginationSlice.decrimentPagination( namePagination))}  disabled={currentPagination?.currentPage === 1} />
				<div>
					<span>{currentPagination?.currentPage}</span>
					<span>/</span>
					<span>{currentPagination?.maxPage}</span>
				</div>
				<ArrowNavigation direction={'right'}  onClick={() => dispatch(PaginationSlice.incrimentPagination( namePagination))} disabled={currentPagination?.currentPage === currentPagination?.maxPage} />
			</div>}
		</>
	);
};