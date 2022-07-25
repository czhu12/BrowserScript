import React, { useState } from "react";
import chunk from "lodash/chunk";
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_SCRIPT, GET_POPULAR_SCRIPTS } from '../lib/api/definitions';
import dynamic from 'next/dynamic'
import ActionBar from "../lib/components/editor/ActionBar";
import ScriptCard from "../lib/components/landing_page/ScriptCard";
import Head from "next/head";
const Editor = dynamic(import('../lib/components/editor'), {ssr: false})
const DEFAULT_CODE = `import jspdf from "https://cdn.skypack.dev/jspdf";

bs.text(\`# PDF generator\`);

const name = bs.input("Your Name");

if (bs.button("Generate")) {
  const doc = new jspdf();
  const image = new Image();
  image.src = "/images/harvard_diploma.png";
  await doc.addImage(image, "png", 0, 0, 200, 150);

  doc.text(name, 85, 80);
  doc.save("diploma.pdf");
}
`;

function IndexPage() {
  const [mutateFunction, { d, l, e }] = useMutation(CREATE_SCRIPT);
  const { loading, error, data } = useQuery(GET_POPULAR_SCRIPTS, {variables: {page: 1}});
  console.log(data);
  const [code, setCode] = useState(DEFAULT_CODE);
  const createScript = async () => {
    const result = await mutateFunction({
      variables: {
        input: {
          attributes: {
            title: "Untitled",
            visibility: "public",
            code: code,
            description: "",
          },
        }
      }
    });
    if (!result.data.createScript.errors) {
      window.location.href = `/s/${result.data.createScript.script.slug}?first=1&created=true`;
    }
  }
  const [barActive, setBarActive] = useState(false);
  return (
    <div>
      <Head>
        <title>Tooltip, the easiest way to build and share apps.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          content="Tooltip is the easiest way to build and share interactive apps, no frontend experience required."
          name="description"
        />
      </Head>
      <nav className="navbar py-4">
        <div className="container is-fluid">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              <figure className="image is-24x24">
                <img src="/logos/tooltip-purple.png" />
              </figure>

              <div className="has-text-weight-bold is-size-5 has-color-purple ml-3">Tooltip</div>
            </a>
            <a className="navbar-burger" role="button" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={() => setBarActive(!barActive)}>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>

          </div>
          <div className={`navbar-menu ${barActive && 'is-active'}`} id="navbarBasicExample">
            <div className="navbar-start">
              <a className="navbar-item" href="#about">About</a>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <a href="/sign_up" className="button is-primary">
                    <strong>Sign up</strong>
                  </a>
                  <a href="/log_in" className="button is-light">
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <section className="section">
        <div className="container">
          <div className="my-3 py-3 columns is-multiline">
            <div className="column is-12 is-6-desktop">
              <h1 className="mb-4 is-size-1 is-size-3-mobile has-text-weight-bold" style={{lineHeight: '1.2em'}}>A Faster Way to Build and Share Apps</h1>
              <h5 className="subtitle has-text-grey my-4">We turn your scripts into full blown apps. No HTML or CSS required.</h5>
              <a className="button is-info is-large is-size-5" href="#try-now">
                Try Tooltip Now
              </a>
              <div className="mt-3 subtitle is-size-7">
                No account needed.
              </div>
            </div>
            <div className="column is-12 is-6-desktop">
              <img src="/images/image2pdf.png" />
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="try-now">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div className="title is-size-3 has-text-white">Edit the code here.</div>
              <div>
                {typeof window !== "undefined" && (
                  <Editor code={code} setCode={setCode} />
                )}
              </div>
              <ActionBar onSave={createScript} onRun={() => {
                window.__bs_run(code);
              }} />
            </div>
            <div className="column">
              <div className="title is-size-3 has-text-white">Your app shows up here.</div>
              <div id="main-view">
                <div id="temporary-id" className="dotted-border"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column title is-size-1">
              A gallery of popular apps
            </div>
          </div>
            {chunk(data?.scripts || [], 2).map((scripts, idx) => {
              const s1 = scripts[0];
              const s2 = scripts[1];
              return (
                <div key={`gallery-${idx}`} className="columns is-desktop">
                  <div className="column">
                    <ScriptCard script={s1} />
                  </div>
                  <div className="column">
                    <ScriptCard script={s2} />
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div className="title is-size-1">
                Build beautiful applications, no frontend skills needed.
              </div>
              <div className="subtitle is-size-3">
                Build beautiful applications, no frontend skills needed.
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="content container my-5">
          <div className="columns">
            <div className="column">
              <span className="title is-5">Tooltip</span>
            </div>
            <div className="column">
              <span className="title is-5">Documentation</span>
            </div>
            <div className="column">
              <span className="title is-5">Social</span>
              <p>
                <a href="https://github.com/czhu12/tooltip" target="_blank"><i className="fa-brands fa-github"></i></a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default IndexPage;