/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FunctionComponent } from 'react';
import { Action } from 'typescript-fsa';
import { EuiFlexItem } from '@elastic/eui';
import { InventoryAWSAccount } from '../../../../common/http_api/inventory_meta_api';
import { findToolbar } from '../../../../common/inventory_models/toolbars';
import {
  InfraNodeType,
  InfraSnapshotMetricInput,
  InfraSnapshotGroupbyInput,
} from '../../../graphql/types';
import { ToolbarWrapper } from './toolbar_wrapper';

import { waffleOptionsSelectors } from '../../../store';
import { InfraGroupByOptions } from '../../../lib/lib';
import { WithWaffleViewState } from '../../../containers/waffle/with_waffle_view_state';
import { SavedViewsToolbarControls } from '../../saved_views/toolbar_control';
import { inventoryViewSavedObjectType } from '../../../../common/saved_objects/inventory_view';
import { IIndexPattern } from '../../../../../../../../src/plugins/data/public';

export interface ToolbarProps {
  createDerivedIndexPattern: (type: 'logs' | 'metrics' | 'both') => IIndexPattern;
  changeMetric: (payload: InfraSnapshotMetricInput) => Action<InfraSnapshotMetricInput>;
  changeGroupBy: (payload: InfraSnapshotGroupbyInput[]) => Action<InfraSnapshotGroupbyInput[]>;
  changeCustomOptions: (payload: InfraGroupByOptions[]) => Action<InfraGroupByOptions[]>;
  customOptions: ReturnType<typeof waffleOptionsSelectors.selectCustomOptions>;
  groupBy: ReturnType<typeof waffleOptionsSelectors.selectGroupBy>;
  metric: ReturnType<typeof waffleOptionsSelectors.selectMetric>;
  nodeType: ReturnType<typeof waffleOptionsSelectors.selectNodeType>;
}

const wrapToolbarItems = (ToolbarItems: FunctionComponent<ToolbarProps>) => {
  return (
    <ToolbarWrapper>
      {props => (
        <>
          <ToolbarItems {...props} />
          <EuiFlexItem grow={true} />
          <EuiFlexItem grow={false}>
            <WithWaffleViewState indexPattern={props.createDerivedIndexPattern('metrics')}>
              {({ defaultViewState, viewState, onViewChange }) => (
                <SavedViewsToolbarControls
                  defaultViewState={defaultViewState}
                  viewState={viewState}
                  onViewChange={onViewChange}
                  viewType={inventoryViewSavedObjectType}
                />
              )}
            </WithWaffleViewState>
          </EuiFlexItem>
        </>
      )}
    </ToolbarWrapper>
  );
};

interface Props {
  nodeType: InfraNodeType;
  regions: string[];
  accounts: InventoryAWSAccount[];
}
export const Toolbar = ({ nodeType }: Props) => {
  const ToolbarItems = findToolbar(nodeType);
  return wrapToolbarItems(ToolbarItems);
};
