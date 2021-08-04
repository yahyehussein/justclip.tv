import Grid from "@shared/grid";
import Layout from "@shared/layout";
import React from "react";
import Site from "@shared/site";

const Terms = (): JSX.Element => {
  return (
    <>
      <Site title="Terms"></Site>
      <Grid fluid>
        <div className="header">
          <div className="header_title">TERMS AND CONDITIONS</div>{" "}
          <div className="term">
            <ol>
              {" "}
              <li>
                <strong>Introduction</strong>
              </li>{" "}
            </ol>{" "}
            <p>
              These Website Standard Terms and Conditions written on this
              webpage shall manage your use of this website. These Terms will be
              applied fully and affect to your use of this Website. By using
              this Website, you agreed to accept all terms and conditions
              written in here. You must not use this Website if you disagree
              with any of these Website Standard Terms and Conditions.
            </p>
            <ol>
              <li>
                <strong>Intellectual Property Rights</strong>
              </li>
            </ol>{" "}
            <p>
              Other than the content you own, under these Terms, justclip and/or
              its licensors own all the intellectual property rights and
              materials contained in this Website.
            </p>{" "}
            <p>
              You are granted limited license only for purposes of viewing the
              material contained on this Website.
            </p>{" "}
            <ol>
              <li>
                <strong>Restrictions</strong>
              </li>
            </ol>{" "}
            <p>You are specifically restricted from all of the following</p>{" "}
            <ul>
              {" "}
              <li>
                using this Website in any way that is or may be damaging to this
                Website;
              </li>{" "}
              <li>
                using this Website in any way that impacts user access to this
                Website;
              </li>{" "}
              <li>
                using this Website contrary to applicable laws and regulations,
                or in any way may cause harm to the Website, or to any person or
                business entity;
              </li>{" "}
              <li>
                engaging in any data mining, data harvesting, data extracting or
                any other similar activity in relation to this Website;
              </li>{" "}
              <li>
                using this Website to engage in any advertising or marketing.
              </li>{" "}
            </ul>{" "}
            <p>
              Certain areas of this Website are restricted from being access by
              you and justclip may further restrict access by you to any areas
              of this Website, at any time, in absolute discretion. Any user ID
              and password you may have for this Website are confidential and
              you must maintain confidentiality as well.
            </p>{" "}
            <ol>
              <li>
                <strong>Your Content</strong>
              </li>
            </ol>{" "}
            <p>
              In these Website Standard Terms and Conditions, “Your Content”
              shall mean any audio, video text, images or other material you
              choose to display on this Website. By displaying Your Content, you
              grant justclip a non-exclusive, worldwide irrevocable, sub
              licensable license to use, reproduce, adapt, publish, translate
              and distribute it in any and all media. justclip reserves the
              right to remove any of Your Content from this Website at any time
              without notice.
            </p>{" "}
            <ol>
              <li>
                <strong>No warranties</strong>
              </li>
            </ol>{" "}
            <p>
              This Website is provided “as is,” with all faults, and justclip
              express no representations or warranties, of any kind related to
              this Website or the materials contained on this Website. Also,
              nothing contained on this Website shall be interpreted as advising
              you.
            </p>{" "}
            <ol>
              <li>
                <strong>Limitation of liability</strong>
              </li>
            </ol>{" "}
            <p>
              In no event shall justclip , nor any of its officers, directors
              and employees, shall be held liable for anything arising out of or
              in any way connected with your use of this{" "}
              <a
                href="https://freedirectorysubmissionsites.com/"
                target="_blank"
                rel="noreferrer"
              >
                Website
              </a>{" "}
              whether such liability is under contract. &nbsp;justclip ,
              including its officers, directors and employees shall not be held
              liable for any indirect, consequential or special liability
              arising out of or in any way related to your use of this Website.
            </p>{" "}
            <ol>
              <li>
                <strong>Indemnification</strong>
              </li>
            </ol>{" "}
            <p>
              You hereby indemnify to the fullest extent justclip from and
              against any and/or all liabilities, costs, demands, causes of
              action, damages and expenses arising in any way related to your
              breach of any of the provisions of these Terms.
            </p>{" "}
            <ol>
              <li>
                <strong>Severability</strong>
              </li>
            </ol>{" "}
            <p>
              If any provision of these Terms is found to be invalid under any
              applicable law, such provisions shall be deleted without affecting
              the remaining provisions herein.
            </p>{" "}
            <ol>
              <li>
                <strong>Variation of Terms</strong>
              </li>
            </ol>{" "}
            <p>
              justclip is permitted to revise these Terms at any time as it sees
              fit, and by using this Website you are expected to review these
              Terms on a regular basis.
            </p>{" "}
            <ol>
              <li>
                <strong>Assignment</strong>
              </li>
            </ol>{" "}
            <p>
              The justclip is allowed to assign, transfer, and subcontract its
              rights and/or obligations under these Terms without any
              notification. However, you are not allowed to assign, transfer, or
              subcontract any of your rights and/or obligations under these
              Terms.
            </p>{" "}
            <ol>
              <li>
                <strong>Entire Agreement</strong>
              </li>
            </ol>{" "}
            <p>
              These Terms constitute the entire agreement between justclip and
              you in relation to your use of this Website, and supersede all
              prior agreements and understandings.
            </p>{" "}
            <ol>
              <li>
                <strong>Governing Law &amp; Jurisdiction</strong>
              </li>
            </ol>{" "}
            <p>
              These Terms will be governed by English law. You and we both agree
              that the courts of England, Wales and Scotland will have exclusive
              jurisdiction and you submit to the non-exclusive jurisdiction of
              courts of England, Wales and Scotland for the resolution of any
              disputes.
            </p>
          </div>
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Terms.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Terms;
