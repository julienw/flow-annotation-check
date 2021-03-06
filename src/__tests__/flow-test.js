'use strict';

/**
 * @flow
 */

import path from 'path';
import {genCheckFlowStatus, genForceErrors} from '../flow';

const flowDetectedFixtures = [
  {status: 'flow strict', file: './fixtures/flow-strict.flow.js'},
  {status: 'flow strict-local', file: './fixtures/flow-strict-local.flow.js'},
  {status: 'flow', file: './fixtures/comment-blocks-09.flow.js'},
  {status: 'flow', file: './fixtures/comment-single-block-09.flow.js'},
  {status: 'flow', file: './fixtures/comment-single-block-10.flow.js'},
  {status: 'flow', file: './fixtures/comment-statement-09.flow.js'},
  {status: 'flow', file: "./fixtures/file-with-'single'-quotes.js"},
  {status: 'flow', file: './fixtures/file-with-"double"-quotes.js'},
  {status: 'flow', file: './fixtures/file-with-$-money.js'},
  {status: 'flow', file: './fixtures/file-with a-space.js'},
  {status: 'flow', file: './fixtures/file-with-\\-a-slash.js'},
  {status: 'flow', file: './fixtures/file-with-`backtick`-quotes.js'},
  {status: 'flow', file: './fixtures/pragma-multiple.flow.js'},
  {status: 'flow strict', file: './fixtures/pragma-multiple-strict.flow.js'},
];
const flowFailedFixtures = [
  {status: 'no flow', file: './fixtures/comment-blocks-10.js'},
  {status: 'no flow', file: './fixtures/comment-statement-10.js'},
  {status: 'no flow', file: './fixtures/comment-block-after-code.js'},
  {status: 'no flow', file: './fixtures/comment-statement-after-code.js'},
  {status: 'no flow', file: './fixtures/comment-block-after-code.js'},
  {status: 'no flow', file: './fixtures/use-strict-block-after-code.js'},
  {status: 'no flow', file: './fixtures/no-comments.js'},
  {status: 'flow weak', file: './fixtures/flow-weak.js'},
];
const magicStringFixtures = [
  {status: 'flow', file: './fixtures/use-babel-block.flow.js'},
  {status: 'flow', file: './fixtures/use-babel-statement.flow.js'},
  {status: 'flow', file: './fixtures/use-strict-block.flow.js'},
  {status: 'flow', file: './fixtures/use-strict-statement.flow.js'},
];

describe('genCheckFlowStatus', () => {
  function testCheckFlowStatus(fixture) {
    it(`should return ${fixture.status} for ${fixture.file}`, () => {
      return genCheckFlowStatus(
        'flow',
        path.resolve(__dirname, fixture.file)
      ).then((status) => {
        expect(status).toEqual(fixture.status);
      });
    });
  }

  flowDetectedFixtures.forEach(testCheckFlowStatus);
  flowFailedFixtures.forEach(testCheckFlowStatus);
  magicStringFixtures.forEach(testCheckFlowStatus);
});

describe('genForceErrors', () => {
  const dir = path.resolve(__dirname, './fixtures');
  const flags = {
    validate: false,
    absolute: true,
    level: 'flow',
    exclude: [],
    flow_path: 'flow',
    include: [],
    output: 'text',
    show_summary: false,
    list_files: 'all',
    html_file: null,
    csv_file: null,
    junit_file: null,
    json_file: null,
    summary_file: null,
    root: '.',
  };

  function testForceErrors(fixture) {
    const files = [path.resolve(__dirname, fixture.file)];

    switch (fixture.status) {
      case 'flow strict':
      case 'flow strict-local':
      case 'flow':
      case 'flow weak':
        it(`should list ${fixture.file} because flow checks it`, () => {
          return genForceErrors(dir, files, flags).then((results) => {
            expect(results).toEqual(expect.arrayContaining(files));
          });
        });
        break;
      case 'no flow':
        it(`should not list ${fixture.file} because flow can't see it`, () => {
          return genForceErrors(dir, files, flags).then((results) => {
            expect(results).not.toEqual(expect.arrayContaining(files));
          });
        });
        break;
      default:
        throw new Error(`Unexpected fixture.status ${fixture.status}`);
    }
  }

  flowDetectedFixtures.forEach(testForceErrors);
  flowFailedFixtures.forEach(testForceErrors);
  magicStringFixtures.forEach(testForceErrors);
});
