/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// @ts-ignore
import { isJobIdValid } from '../../../common/util/job_utils';

// TODO
export const moveToAnalyticsWizard = () => {};

export const isAnalyticsIdValid = isJobIdValid;

export type IndexName = string;
export type IndexPattern = string;
export type DataFrameAnalyticsId = string;

export interface CreateRequestBody {
  // Description attribute is not supported yet
  // description?: string;
  dest: {
    index: IndexName;
    results_field: string;
  };
}

export interface DataFrameAnalyticsOutlierConfig extends CreateRequestBody {
  id: DataFrameAnalyticsId;
  analysis: {
    outlier_detection: {};
  };
  analyzed_fields: {
    includes: string[];
    excludes: string[];
  };
  model_memory_limit: string;
  create_time: number;
  version: string;
}

export enum REFRESH_ANALYTICS_LIST_STATE {
  ERROR = 'error',
  IDLE = 'idle',
  LOADING = 'loading',
  REFRESH = 'refresh',
}
export const refreshAnalyticsList$ = new BehaviorSubject<REFRESH_ANALYTICS_LIST_STATE>(
  REFRESH_ANALYTICS_LIST_STATE.IDLE
);

export const useRefreshAnalyticsList = (
  callback: {
    isLoading?(d: boolean): void;
    onRefresh?(): void;
  } = {}
) => {
  useEffect(() => {
    const distinct$ = refreshAnalyticsList$.pipe(distinctUntilChanged());

    const subscriptions: Subscription[] = [];

    if (typeof callback.onRefresh === 'function') {
      // initial call to refresh
      callback.onRefresh();

      subscriptions.push(
        distinct$
          .pipe(filter(state => state === REFRESH_ANALYTICS_LIST_STATE.REFRESH))
          .subscribe(() => typeof callback.onRefresh === 'function' && callback.onRefresh())
      );
    }

    if (typeof callback.isLoading === 'function') {
      subscriptions.push(
        distinct$.subscribe(
          state =>
            typeof callback.isLoading === 'function' &&
            callback.isLoading(state === REFRESH_ANALYTICS_LIST_STATE.LOADING)
        )
      );
    }

    return () => {
      subscriptions.map(sub => sub.unsubscribe());
    };
  }, []);

  return {
    refresh: () => {
      // A refresh is followed immediately by setting the state to loading
      // to trigger data fetching and loading indicators in one go.
      refreshAnalyticsList$.next(REFRESH_ANALYTICS_LIST_STATE.REFRESH);
      refreshAnalyticsList$.next(REFRESH_ANALYTICS_LIST_STATE.LOADING);
    },
  };
};