'use strict';

/**
 * @flow
 */

import type {FlowStatus} from './types';

function isValidFlowStatus(
  status: FlowStatus,
  threwError: boolean,
): boolean {
  switch(status) {
    case 'flow strict':
      return threwError;
    case 'flow strict-local':
      return threwError;
    case 'flow':
      return threwError;
    case 'flow weak':
      return threwError;
    case 'no flow':
      return !threwError;
    default:
      throw new Error(`Invalid flow status '${status}'`);
  };
}

export default isValidFlowStatus;
