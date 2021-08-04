import Grid from "@shared/grid";
import Layout from "@shared/layout";
import React from "react";
import Site from "@shared/site";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useState } from "react";

const CookiePreferences = (): JSX.Element => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookieSettings"]);

  const [googleAnalytics, setGoogleAnalytics] = useState({
    off: !!!cookies.cookieSettings,
    on: !!cookies.cookieSettings,
  });
  const [twitch, setTwitch] = useState({
    off: !!!cookies.cookieSettings,
    on: !!cookies.cookieSettings,
  });

  const handleAccept = () => {
    setCookie("cookieSettings", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    setGoogleAnalytics({ off: false, on: true });
    setTwitch({ off: false, on: true });
  };

  const handleReject = () => {
    removeCookie("cookieSettings", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    setGoogleAnalytics({ off: true, on: false });
    setTwitch({ off: true, on: false });
  };

  useEffect(() => {
    if (googleAnalytics.on) {
      setCookie("cookieSettings", "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    } else {
      removeCookie("cookieSettings", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
  }, [googleAnalytics.on, removeCookie, setCookie]);

  useEffect(() => {
    if (twitch.on) {
      setCookie("cookieSettings", "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    } else {
      removeCookie("cookieSettings", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
  }, [removeCookie, setCookie, twitch.on]);

  return (
    <>
      <Site title="Cookie Preferences"></Site>
      <Grid fluid>
        <p className="text-xl">Cookies &amp; Browsing</p>
        <p className="mb-2">
          Use this page to configure your Cookie and Browsing preferences
        </p>
        <div className="bg-dark border rounded-md mb-3">
          <p className="pl-2 bg-primary mb-2 text-white-light text-lg rounded-t-md">
            OPTIONAL COOKIES
          </p>
          <div className="p-4">
            <div className="mb-3">
              <button
                className="bg-primary px-3 py-1 rounded-full hover:bg-opacity-80 mr-2 text-white-light focus:outline-none"
                onClick={handleAccept}
              >
                Accept All
              </button>
              <button
                className="bg-secondary px-3 py-1 rounded-full hover:bg-opacity-80 focus:outline-none"
                onClick={handleReject}
              >
                Reject All
              </button>
            </div>
            <p className="text-2xl">GOOGLE ANALYTICS COOKIES</p>
            <p className="mb-2">To measure audience on Justclip</p>
            <div className="bg-secondary p-2 flex items-center mb-4">
              <div className="flex-grow">
                <p>ga and _gid</p>
                <p className="text-muted">
                  Google Analytics tracking subject to Google’s Privacy Policy
                </p>
              </div>
              <div>
                <button
                  className={`px-4 py-2 focus:outline-none ${
                    googleAnalytics.off
                      ? "bg-outerspace"
                      : "bg-gray hover:bg-opacity-80"
                  }`}
                  onClick={() => setGoogleAnalytics({ off: true, on: false })}
                >
                  OFF
                </button>
                <button
                  className={`px-4 py-2 focus:outline-none ${
                    googleAnalytics.on
                      ? "bg-primary text-white-light"
                      : "bg-gray hover:bg-opacity-80"
                  }`}
                  onClick={() => setGoogleAnalytics({ off: false, on: true })}
                >
                  ON
                </button>
              </div>
            </div>
            <p className="text-2xl">THIRD PARTY MEDIA SHARING COOKIES</p>
            <p className="mb-2">
              These are necessary to embed certain external media in our
              websites
            </p>
            <div className="bg-secondary p-2 flex items-center">
              <div className="flex-grow">
                <p>Twitch</p>
                <p className="text-muted">
                  Cookies placed by embedded Twitch players within Justclip.
                  Subject to Twitch’s Privacy Policy
                </p>
              </div>
              <div>
                <button
                  className={`px-4 py-2 focus:outline-none ${
                    twitch.off ? "bg-outerspace" : "bg-gray hover:bg-opacity-80"
                  }`}
                  onClick={() => setTwitch({ off: true, on: false })}
                >
                  OFF
                </button>
                <button
                  className={`px-4 py-2 focus:outline-none ${
                    twitch.on
                      ? "bg-primary text-white-light"
                      : "bg-gray hover:bg-opacity-80"
                  }`}
                  onClick={() => setTwitch({ off: false, on: true })}
                >
                  ON
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-dark border rounded-md">
          <p className="pl-2 bg-primary mb-2 text-white-light text-lg rounded-t-md">
            TECHNICALLY NECESSARY COOKIES
          </p>
          <div className="p-4">
            <div className="mb-3">
              <p>
                The following cookies are always set when you use the Justclip
                websites
              </p>
            </div>
            <div className="bg-secondary p-2 mb-4">
              <p>justclip_session, remember_web_, XSRF-TOKEN</p>
              <p className="text-muted">
                Protects our users and services against certain attacks
                (so-called cross-site request forgery / CSRF attacks).
              </p>
            </div>
            <div className="bg-secondary p-2">
              <p>cookieSettings</p>
              <p className="text-muted">
                This stores the settings you make on this page or on the cookie
                warning banner.
              </p>
            </div>
          </div>
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
CookiePreferences.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default CookiePreferences;
