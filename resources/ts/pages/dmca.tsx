import Grid from "@shared/grid";
import Layout from "@shared/layout";
import React from "react";
import Site from "@shared/site";

const Dmca = (): JSX.Element => {
  return (
    <>
      <Site title="Terms"></Site>
      <Grid fluid>
        <div className="header">
          <div className="header_title">Copyright Dispute Policy</div>{" "}
          <div className="term">
            <div className="update-date">Effective date: July 26, 2021</div>{" "}
            <br />{" "}
            <div>
              In accordance with the DMCA, we’ve adopted the policy below toward
              copyright infringement. We reserve the right to (1) block access
              to or remove material that we believe in good faith to be
              copyrighted material that has been illegally copied and
              distributed by any of our advertisers, affiliates, content
              providers, members or users and (2) remove and discontinue service
              to repeat offenders.{" "}
            </div>{" "}
            <br />{" "}
            <div>
              {" "}
              Remember that your use of justclip’s Services is at all times
              subject to the Terms of Use [https://justclip.tv/terms], which
              incorporates this Copyright Dispute Policy. Any terms we use in
              this Policy without defining them have the definitions given to
              them in the Terms of Use [https://justclip.tv/terms].{" "}
            </div>{" "}
            <br />{" "}
            <div className="list-content">
              <div className="content">
                <div className="content-desc">
                  (1){" "}
                  <em className="underline">
                    Procedure for Reporting Copyright Infringements{" "}
                  </em>
                  . If you believe that material or content residing on or
                  accessible through the Services infringes your copyright (or
                  the copyright of someone whom you are authorized to act on
                  behalf of), please send a notice of copyright infringement
                  containing the following information to the justclip’s
                  Designated Agent to Receive Notification of Claimed
                  Infringement (our “Designated Agent,” whose contact details
                  are listed below):
                </div>{" "}
                <div className="sub-content">
                  (a) A physical or electronic signature of a person authorized
                  to act on behalf of the owner of the copyright that has been
                  allegedly infringed;
                </div>{" "}
                <div className="sub-content">
                  (b) Identification of works or materials being infringed;
                </div>{" "}
                <div className="sub-content">
                  (c) Identification of the material that is claimed to be
                  infringing including information regarding the location of the
                  infringing materials that the copyright owner seeks to have
                  removed, with sufficient detail so that justclip is capable of
                  finding and verifying its existence;
                </div>{" "}
                <div className="sub-content">
                  (d) Contact information about the notifier including address,
                  telephone number and, if available, email address;
                </div>{" "}
                <div className="sub-content">
                  (e) A statement that the notifier has a good faith belief that
                  the material identified in (1)(c) is not authorized by the
                  copyright owner, its agent, or the law; and
                </div>{" "}
                <div className="sub-content">
                  (f) A statement made under penalty of perjury that the
                  information provided is accurate and the notifying party is
                  authorized to make the complaint on behalf of the copyright
                  owner.
                </div>
              </div>{" "}
              <br />{" "}
              <div className="content">
                <div className="content-desc">
                  (2) Once Proper Bona Fide Infringement Notification Is
                  Received by the Designated Agent. Upon receipt of a proper
                  notice of copyright infringement, we reserve the right to:
                </div>{" "}
                <div className="sub-content">
                  (a) remove or disable access to the infringing material;
                </div>{" "}
                <div className="sub-content">
                  (b) notify the content provider who is accused of infringement
                  that we have removed or disabled access to the applicable
                  material; and
                </div>{" "}
                <div className="sub-content">
                  (c) terminate such content provider&apos;s access to the
                  Services if he or she is a repeat offender.
                </div>
              </div>{" "}
              <br />{" "}
              <div className="content">
                <div className="content-desc">
                  (3) Procedure to Supply a Counter-Notice to the Designated
                  Agent. If the content provider believes that the material that
                  was removed (or to which access was disabled) is not
                  infringing, or the content provider believes that it has the
                  right to post and use such material from the copyright owner,
                  the copyright owner&apos;s agent, or, pursuant to the law, the
                  content provider may send us a counter-notice containing the
                  following information to the Designated Agent:
                </div>{" "}
                <div className="sub-content">
                  (a) A physical or electronic signature of the content
                  provider;
                </div>{" "}
                <div className="sub-content">
                  (b) Identification of the material that has been removed or to
                  which access has been disabled and the location at which the
                  material appeared before it was removed or disabled;
                </div>{" "}
                <div className="sub-content">
                  (c) A statement that the content provider has a good faith
                  belief that the material was removed or disabled as a result
                  of mistake or misidentification of the material; and
                </div>{" "}
                <div className="sub-content">
                  (d) Content provider&apos;s name, address, telephone number,
                  and, if available, email address, and a statement that such
                  person or entity consents to the jurisdiction of the Federal
                  Court for the judicial district in which the content
                  provider’s address is located, or, if the content
                  provider&apos;s address is located outside the United States,
                  for any judicial district in which justclip is located, and
                  that such person or entity will accept service of process from
                  the person who provided notification of the alleged
                  infringement.
                </div>
              </div>{" "}
              <br />{" "}
              <div className="content">
                <div className="content-desc">
                  If a counter-notice is received by the Designated Agent,
                  justclip may, in its discretion, send a copy of the
                  counter-notice to the original complaining party informing
                  that person that justclip may replace the removed material or
                  cease disabling it in 10 business days. Unless the copyright
                  owner files an action seeking a court order against the
                  content provider accused of committing infringement, the
                  removed material may be replaced or access to it restored in
                  10 to 14 business days or more after receipt of the
                  counter-notice, at justclip’s discretion.
                </div>
              </div>
            </div>{" "}
            <div>
              <b>
                Please contact justclip’s Designated Agent at the following
                address:{" "}
              </b>
            </div>{" "}
            <div className="address">
              <br />
              justclip.tv@gmail.com
            </div>
          </div>
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Dmca.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Dmca;
