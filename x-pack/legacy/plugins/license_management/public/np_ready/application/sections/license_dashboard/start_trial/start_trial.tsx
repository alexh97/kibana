/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';

import {
  EuiButtonEmpty,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCard,
  EuiLink,
  EuiOverlayMask,
  EuiText,
  EuiModal,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalBody,
  EuiModalHeaderTitle,
} from '@elastic/eui';

import { FormattedMessage } from '@kbn/i18n/react';
import { TelemetryOptIn } from '../../../components/telemetry_opt_in';
import { EXTERNAL_LINKS } from '../../../../../../common/constants';
import { getDocLinks } from '../../../lib/docs_links';
import { TelemetryPluginSetup, shouldShowTelemetryOptIn } from '../../../lib/telemetry';

interface Props {
  loadTrialStatus: () => void;
  startLicenseTrial: () => void;
  telemetry?: TelemetryPluginSetup;
  shouldShowStartTrial: boolean;
}

interface State {
  showConfirmation: boolean;
  isOptingInToTelemetry: boolean;
}

export class StartTrial extends Component<Props, State> {
  cancelRef: any;
  confirmRef: any;

  state: State = {
    showConfirmation: false,
    isOptingInToTelemetry: false,
  };

  UNSAFE_componentWillMount() {
    this.props.loadTrialStatus();
  }

  onOptInChange = (isOptingInToTelemetry: boolean) => {
    this.setState({ isOptingInToTelemetry });
  };

  onStartLicenseTrial = () => {
    const { telemetry, startLicenseTrial } = this.props;
    if (this.state.isOptingInToTelemetry && telemetry) {
      telemetry.telemetryService.setOptIn(true);
    }
    startLicenseTrial();
  };

  cancel = () => {
    this.setState({ showConfirmation: false });
  };
  acknowledgeModal() {
    const { showConfirmation, isOptingInToTelemetry } = this.state;
    const { telemetry } = this.props;

    if (!showConfirmation) {
      return null;
    }

    return (
      <EuiOverlayMask>
        <EuiModal className="licManagement__modal" onClose={this.cancel}>
          <EuiModalHeader>
            <EuiModalHeaderTitle data-test-subj="confirmModalTitleText">
              <FormattedMessage
                id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalTitle"
                defaultMessage="Start your free 30-day trial"
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText data-test-subj="confirmModalBodyText">
              <div>
                <EuiText>
                  <p>
                    <FormattedMessage
                      id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription"
                      defaultMessage="This trial is for the full set of {platinumLicenseFeaturesLinkText} of the Elastic Stack.
                      You'll get immediate access to:"
                      values={{
                        platinumLicenseFeaturesLinkText: (
                          <EuiLink href={EXTERNAL_LINKS.SUBSCRIPTIONS} target="_blank">
                            <FormattedMessage
                              id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.platinumLicenseFeaturesLinkText"
                              defaultMessage="Platinum features"
                            />
                          </EuiLink>
                        ),
                      }}
                    />
                  </p>
                  <ul>
                    <li>
                      <FormattedMessage
                        id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.mashingLearningFeatureTitle"
                        defaultMessage="Machine learning"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.alertingFeatureTitle"
                        defaultMessage="Alerting"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.graphCapabilitiesFeatureTitle"
                        defaultMessage="Graph capabilities"
                      />
                    </li>
                    <li>
                      <FormattedMessage
                        id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.dataBaseConnectivityFeatureTitle"
                        defaultMessage="{jdbcStandard} and {odbcStandard} connectivity for {sqlDataBase}"
                        values={{
                          jdbcStandard: 'JDBC',
                          odbcStandard: 'ODBC',
                          sqlDataBase: 'SQL',
                        }}
                      />
                    </li>
                  </ul>
                  <p>
                    <FormattedMessage
                      id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.securityFeaturesConfigurationDescription"
                      defaultMessage="Advanced security features, such as authentication ({authenticationTypeList}),
                      field- and document-level security, and auditing, require configuration.
                      See the {securityDocumentationLinkText} for instructions."
                      values={{
                        authenticationTypeList: 'AD/LDAP, SAML, PKI, SAML/SSO',
                        securityDocumentationLinkText: (
                          <EuiLink href={getDocLinks().securityDocumentationLink} target="_blank">
                            <FormattedMessage
                              id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.securityDocumentationLinkText"
                              defaultMessage="documentation"
                            />
                          </EuiLink>
                        ),
                      }}
                    />
                  </p>
                  <p>
                    <FormattedMessage
                      id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.termsAndConditionsDescription"
                      defaultMessage="By starting this trial, you agree that it is subject to these {termsAndConditionsLinkText}."
                      values={{
                        termsAndConditionsLinkText: (
                          <EuiLink href={EXTERNAL_LINKS.TRIAL_LICENSE} target="_blank">
                            <FormattedMessage
                              id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModalDescription.termsAndConditionsLinkText"
                              defaultMessage="terms and conditions"
                            />
                          </EuiLink>
                        ),
                      }}
                    />
                  </p>
                </EuiText>
              </div>
            </EuiText>
          </EuiModalBody>

          <EuiModalFooter>
            <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
              <EuiFlexItem grow={false}>
                {shouldShowTelemetryOptIn(telemetry) && (
                  <TelemetryOptIn
                    telemetry={telemetry}
                    isStartTrial={true}
                    onOptInChange={this.onOptInChange}
                    isOptingInToTelemetry={isOptingInToTelemetry}
                  />
                )}
              </EuiFlexItem>
              <EuiFlexItem grow={false} className="licManagement__ieFlex">
                <EuiFlexGroup responsive={false}>
                  <EuiFlexItem grow={false} className="licManagement__ieFlex">
                    <EuiButtonEmpty
                      data-test-subj="confirmModalCancelButton"
                      onClick={this.cancel}
                      buttonRef={this.cancelRef}
                    >
                      <FormattedMessage
                        id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModal.cancelButtonLabel"
                        defaultMessage="Cancel"
                      />
                    </EuiButtonEmpty>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false} className="licManagement__ieFlex">
                    <EuiButton
                      data-test-subj="confirmModalConfirmButton"
                      onClick={this.onStartLicenseTrial}
                      fill
                      buttonRef={this.confirmRef}
                      color="primary"
                    >
                      <FormattedMessage
                        id="xpack.licenseMgmt.licenseDashboard.startTrial.confirmModal.startTrialButtonLabel"
                        defaultMessage="Start my trial"
                      />
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }

  render() {
    const { shouldShowStartTrial } = this.props;
    if (!shouldShowStartTrial) {
      return null;
    }
    const description = (
      <span>
        <FormattedMessage
          id="xpack.licenseMgmt.licenseDashboard.startTrial.platinumFeaturesExperienceDescription"
          defaultMessage="Experience what machine learning, advanced security,
          and all our other {platinumLicenseFeaturesLinkText} have to offer."
          values={{
            platinumLicenseFeaturesLinkText: (
              <EuiLink href={EXTERNAL_LINKS.SUBSCRIPTIONS} target="_blank">
                <FormattedMessage
                  id="xpack.licenseMgmt.licenseDashboard.startTrial.platinumLicenseFeaturesLinkText"
                  defaultMessage="Platinum features"
                />
              </EuiLink>
            ),
          }}
        />
      </span>
    );

    const footer = (
      <EuiButton
        data-test-subj="startTrialButton"
        onClick={() => this.setState({ showConfirmation: true })}
      >
        <FormattedMessage
          id="xpack.licenseMgmt.licenseDashboard.startTrial.startTrialButtonLabel"
          defaultMessage="Start trial"
        />
      </EuiButton>
    );
    return (
      <EuiFlexItem>
        {this.acknowledgeModal()}
        <EuiCard
          title={
            <FormattedMessage
              id="xpack.licenseMgmt.licenseDashboard.startTrialTitle"
              defaultMessage="Start a 30-day trial"
            />
          }
          description={description}
          footer={footer}
        />
      </EuiFlexItem>
    );
  }
}
