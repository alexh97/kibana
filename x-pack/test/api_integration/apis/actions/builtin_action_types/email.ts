/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';

import { KibanaFunctionalTestDefaultProviders } from '../../../../types/providers';

// eslint-disable-next-line import/no-default-export
export default function emailTest({ getService }: KibanaFunctionalTestDefaultProviders) {
  const supertest = getService('supertest');
  const esArchiver = getService('esArchiver');

  describe('create email action', () => {
    after(() => esArchiver.unload('empty_kibana'));

    it('should return 200 when creating an email action successfully', async () => {
      const { body: createdAction } = await supertest
        .post('/api/action')
        .set('kbn-xsrf', 'foo')
        .send({
          attributes: {
            description: 'An email action',
            actionTypeId: '.email',
            actionTypeConfig: {
              service: 'gmail',
              user: 'bob',
              password: 'supersecret',
              from: 'bob@example.com',
            },
          },
        })
        .expect(200);

      expect(createdAction).to.eql({
        id: createdAction.id,
      });

      expect(typeof createdAction.id).to.be('string');

      const { body: fetchedAction } = await supertest
        .get(`/api/action/${createdAction.id}`)
        .expect(200);

      expect(fetchedAction).to.eql({
        type: 'action',
        id: fetchedAction.id,
        attributes: {
          description: 'An email action',
          actionTypeId: '.email',
          actionTypeConfig: {
            from: 'bob@example.com',
            service: 'gmail',
          },
        },
        references: [],
        updated_at: fetchedAction.updated_at,
        version: fetchedAction.version,
      });
    });

    it('should respond with a 400 Bad Request when creating an email action with an invalid config', async () => {
      await supertest
        .post('/api/action')
        .set('kbn-xsrf', 'foo')
        .send({
          attributes: {
            description: 'An email action',
            actionTypeId: '.email',
            actionTypeConfig: {},
          },
        })
        .expect(400)
        .then((resp: any) => {
          expect(resp.body).to.eql({
            statusCode: 400,
            error: 'Bad Request',
            message:
              'The actionTypeConfig is invalid: [user]: expected value of type [string] but got [undefined]',
          });
        });
    });
  });

  // TODO: once we have the HTTP API fire action, test that with a webhook url pointing
  // back to the Kibana server
}
