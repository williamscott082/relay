/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule requestRelaySubscription
 * @flow
 */

'use strict';

import type {Disposable} from 'RelayCombinedEnvironmentTypes';
import type {RelayResponsePayload} from 'RelayNetworkTypes';
import type {GraphQLTaggedNode} from 'RelayStaticGraphQLTag';
import type {Environment, RecordSourceSelectorProxy} from 'RelayStoreTypes';
import type {Variables} from 'RelayTypes';

export type GraphQLSubscriptionConfig = {|
  subscription: GraphQLTaggedNode,
  variables: Variables,
  onCompleted?: ?() => void,
  onError?: ?(error: Error) => void,
  onNext?: ?(payload: RelayResponsePayload) => void,
  updater?: ?(proxy: RecordSourceSelectorProxy) => void,
|};

function requestRelaySubscription(
  environment: Environment,
  config: GraphQLSubscriptionConfig,
): Disposable {
  const {
    createOperationSelector,
    getOperation,
  } = environment.unstable_internal;
  const subscription = getOperation(config.subscription);
  const {
    onCompleted,
    onError,
    onNext,
    updater,
    variables,
  } = config;
  const operation = createOperationSelector(subscription, variables);
  return environment.sendSubscription({
    onCompleted,
    onError,
    onNext,
    updater,
    operation,
  });
}

module.exports = requestRelaySubscription;
