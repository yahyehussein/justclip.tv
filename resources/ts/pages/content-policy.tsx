import Grid from "@shared/grid";
import Layout from "@shared/layout";
import React from "react";
import Site from "@shared/site";

const ContentPolicy = (): JSX.Element => {
  return (
    <>
      <Site title="Content Policy"></Site>
      <Grid fluid>
        <div className="header">
          <div className="header_title">CONTENT POLICY</div>{" "}
          <div className="term">
            <p className="text-2xl">1. Harassment</p>
            <br />
            <p id="personal_attacks" className="text-2xl">
              1.1. Personal attacks
            </p>
            <br />
            <p>
              Do not upload things with the primary intention of attacking other
              users. It’s the Internet, arguments happen, but the line is drawn
              when you are uploading ad hominem attacks in place of actual
              discourse. When was the last time someone changed your opinion by
              calling you a moron? This rule is moderated more loosely when the
              upload in question is directed at online personalities such as
              broadcasters. This is because we understand that people tend to be
              more expressive when talking about them, and not making this
              exception would result in users having to skirt around the rules
              to express their opinions. However, this is not a free pass to
              harass broadcasters; keep your criticism constructive, rather than
              exuding blind hate. If you are the victim of this rule, do not
              retaliate by throwing insults back. Instead, report it to the
              moderators then laugh about how you’re still allowed to upload and
              they are not.
            </p>
            <br />
            <p id="discrimination" className="text-2xl">
              1.2. Discrimination
            </p>
            <br />
            <p>
              Attacking people based on the following characteristics is not
              allowed: sex, gender, sexual orientation, disability, race,
              nationality, ancestry, and religion. Civil discussion regarding
              such topics is acceptable, but using these characteristics as
              ammunition is not.
            </p>
            <br />
            <p id="unsourced_allegations" className="text-2xl">
              1.3. Unsourced allegations
            </p>
            <br />
            <p>
              Making unproven claims or allegations against someone with the
              sole intent of fueling or creating drama or damaging the public
              reputation of said person is not allowed. Allegations carry the
              burden of proof; if making such a claim, we require you back it up
              with evidence in the same clip. This is punishable in cases where
              we believe that misinformation is being spread due to malice
              rather than ignorance.
            </p>
            <br />
            <p id="out_of_context_content" className="text-2xl">
              1.4. Out of context content
            </p>
            <br />
            <p>
              Do not upload clips. about public figures that are taken out of
              context with the intention of harassing someone or causing drama.
            </p>
            <br />
            <p id="witch_hunting" className="text-2xl">
              1.5. Witch hunting
            </p>
            <br />
            <p>
              Do not incite large-scale action against a particular person or
              group of people, e.g. calling for people to mass report a Twitch
              channel.
            </p>
            <br />
            <p id="doxing" className="text-2xl">
              1.6. Doxing
            </p>
            <br />
            <p>
              Uploading personal information of a broadcaster is not allowed.
              Personal information includes (but is not limited to) the
              following: full names, locations more specific than their city (or
              equivalent), phone numbers, email addresses, and IP addresses.
              Exceptions are made when it is reasonable to assume the
              broadcaster consents to the information being posted - for
              example, if viewers often call a broadcaster by their real name,
              or if a broadcaster encourages their viewers to visit their house.
              If any information is released by official outside sources (e.g.
              news media), it may be posted. As a rule of thumb, if you’re
              unsure, either ask the moderators or simply refrain from posting
              it.
            </p>
            <br />
            <p id="politics" className="text-2xl">
              3. Politics
            </p>
            <br />
            <p>
              Politics are out of scope for Justclip, so any content related to
              politics will be removed. Including content that isn&apos;t
              inherently political, but carries a political intent or message
              nonetheless. This affects, for example, streams with a campaigning
              background regardless of the content shown, and podcasts.
              Exceptions are made when the content directly relates to gaming
              and/or streaming. Examples of such exceptions are the
              Blizzard-Hong Kong controversy in 2019, or streamers talking about
              the effect of Article 13 on the industry.
            </p>
            <br />
            <p className="text-2xl">4. Quality</p>
            <br />
            <p id="clickbait" className="text-2xl">
              4.1. Clickbait
            </p>
            <br />
            <p>
              Do not use titles to exaggerate the content of your clip to
              generate views. Additionally, clips whose titles contain excessive
              caps, emoji, exclamation marks, etc. will be removed. Jokes do not
              fall under this rule, so “broadcaster pulls out their cock on
              stream” would be an acceptable title if the broadcaster shows
              their pet chicken, for example.
            </p>
            <br />
            <p id="title_spoiling" className="text-2xl">
              4.2. Title spoiling
            </p>
            <br />
            <p>Clip title should not spoil the outcome of the clip.</p>
            <br />
            <p id="not_gaming_related" className="text-2xl">
              4.3. Not Gaming Related
            </p>
            <br />
            <p>
              Clips that are not primarily centralized around games and the
              people who play them!
            </p>
            <br />
            <p className="text-2xl">5. Spam</p>
            <br />
            <p id="self_promotion" className="text-2xl">
              5.1. Self-promotion
            </p>
            <br />
            <p>
              Justclip should not be used as a platform for promotion. For this
              reason, do not upload videos of channels that you own, moderate,
              or otherwise have a personal stake in. If your goal is to promote
              something or someone, you are breaking this rule.
            </p>
            <br />
            <p id="vote_manipulation" className="text-2xl">
              5.2. Vote manipulation
            </p>
            <br />
            <p>
              Do not encourage users to vote (up or down) any upload in any
              capacity for any reason.
            </p>
            <br />
            <p className="text-2xl">6. Restricted content</p>
            <br />
            <p id="he_said_it_clips" className="text-2xl">
              6.1. &quot;He said it&quot; clips
            </p>
            <br />
            <p>
              We do not allow clips about racist donations, stream snipers
              saying racist things, etc. Clips featuring the broadcaster “saying
              it” are allowed, however.
            </p>
            <br />
            <p id="swatting" className="text-2xl">
              6.2. Swatting
            </p>
            <br />
            <p>
              Similar to the rule regarding “he said it” posts, we protect the
              welfare of broadcasters by not granting exposure to people who
              choose to “swat” broadcasters (making a fake police call about a
              broadcaster with the intention of having officers turning up at
              their house). Clips about swatting will be removed. This rule does
              not apply to comments.
            </p>
            <br />
            <p id="death_and_injuries" className="text-2xl">
              6.3. Death and injuries
            </p>
            <br />
            <p>
              Clips containing death - defined as the sight or sound of the
              death of a human or animal - are not allowed. This includes
              showing corpses or remains (with exceptions for cooking, animal
              skeletons in the wild, hunting-related clips, skeletons in
              museums, etc.). Major injuries may not be posted either.
            </p>
            <br />
            <a
              id="twitch_community_guidelines"
              href="https://www.twitch.tv/p/en/legal/community-guidelines/"
              target="_blank"
              className="text-2xl text-twitch hover:underline"
              rel="noreferrer"
            >
              7. Twitch Community Guidelines
            </a>
            <br />
            <p>
              The Twitch community guidelines must be followed at all times.
              Some of our other rules have some overlap with the Twitch rules,
              but such rules provide more information specific to Justclip to
              help you understand what kind of content is allowed.
            </p>
            <br />
            <p className="text-2xl">8. Reference</p>
            <br />
            <p className="text-left">
              u/xCROv. &quot;R/LIVESTREAMFAIL RULES&quot; Reddit, 31 Jul. 2021,{" "}
              <a
                href="https://www.reddit.com/r/LivestreamFail/wiki/rules"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                https://www.reddit.com/r/LivestreamFail/wiki/rules
              </a>
              .
            </p>
          </div>
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
ContentPolicy.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default ContentPolicy;
