import React, { useState } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/json-lint";
import "codemirror/theme/material-darker.css";

import "./index.css";

const jsonlint = require("jsonlint-mod");
window.jsonlint = jsonlint;

function App() {
  const defaultJson = JSON.stringify(
    {
      subject: "Hello, world",
      to: { name: "John", email: "john@example.com" }
    },
    null,
    2
  );

  const [json, setJson] = useState(defaultJson);
  const [mode, setMode] = useState("responsive");
  const [template, setTemplate] = useState("");

  return (
    <>
      <aside>
        <section>
          <h1 className="logo">Email template preview</h1>
        </section>
        <section>
          <h3>Select template</h3>
          <div className="select">
            <select onChange={e => setTemplate(e.target.value)}>
              <option>Monthly newsletter</option>
            </select>
          </div>
        </section>
        <section>
          <h3>Preview mode</h3>
          <div className="toggle">
            <a
              onClick={() => setMode("responsive")}
              className={`responsive ${mode === "responsive" ? "active" : ""}`}
            >
              <svg width="26" height="21" xmlns="http://www.w3.org/2000/svg">
                <g
                  fill="none"
                  fillRule="evenodd"
                  transform="translate(-34 -18)"
                >
                  <path
                    d="M55.167 28.5h-2.334V32h-3.5v2.333h5.834V28.5zm-14-3.5h3.5v-2.333h-5.834V28.5h2.334V25zM57.5 18h-21a2.333 2.333 0 00-2.333 2.333v16.334A2.333 2.333 0 0036.5 39h21a2.333 2.333 0 002.333-2.333V20.333A2.333 2.333 0 0057.5 18zm0 18.684h-21V20.316h21v16.368z"
                    fill="#000"
                    fillRule="nonzero"
                  />
                  <path d="M33 14.5h28v28H33z" />
                </g>
              </svg>
              Responsive
            </a>
            <a
              onClick={() => setMode("tablet")}
              className={`tablet ${mode === "tablet" ? "active" : ""}`}
            >
              <svg width="26" height="19" xmlns="http://www.w3.org/2000/svg">
                <g
                  fill="none"
                  fillRule="evenodd"
                  transform="translate(-123 -19)"
                >
                  <path d="M122 14.5h28v28h-28z" />
                  <path
                    d="M146.5 19.167h-21a2.333 2.333 0 00-2.333 2.333v14a2.333 2.333 0 002.333 2.333h21a2.323 2.323 0 002.322-2.333l.011-14a2.333 2.333 0 00-2.333-2.333zM144.167 35.5h-16.334v-14h16.334v14z"
                    fill="#000"
                    fillRule="nonzero"
                  />
                </g>
              </svg>
              Tablet
            </a>
            <a
              onClick={() => setMode("mobile")}
              className={`mobile ${mode === "mobile" ? "active" : ""}`}
            >
              <svg width="16" height="27" xmlns="http://www.w3.org/2000/svg">
                <g
                  fill="none"
                  fillRule="evenodd"
                  transform="translate(-216 -15)"
                >
                  <path
                    d="M229.083 15.667h-9.333a2.918 2.918 0 00-2.917 2.916v19.834a2.918 2.918 0 002.917 2.916h9.333A2.918 2.918 0 00232 38.417V18.583a2.918 2.918 0 00-2.917-2.916zm-4.666 24.5c-.969 0-1.75-.782-1.75-1.75 0-.969.781-1.75 1.75-1.75.968 0 1.75.781 1.75 1.75 0 .968-.782 1.75-1.75 1.75zm5.25-4.667h-10.5V19.167h10.5V35.5z"
                    fill="#000"
                    fillRule="nonzero"
                  />
                  <path d="M211 14.5h28v28h-28z" />
                </g>
              </svg>
              Mobile
            </a>
          </div>
        </section>
        <section>
          <h3>JSON data</h3>
          <CodeMirror
            value={defaultJson}
            onChange={(editor, data, value) => setJson(value)}
            options={{
              mode: "application/json",
              theme: "material-darker",
              line: true,
              lint: true,
              json: true
            }}
          />
        </section>
      </aside>
      <main>
        <div className={`frame ${mode}`}>
          <div className="frame-inner">
            <iframe
              frameBorder={0}
              src={`http://localhost:4444/render?template=${encodeURIComponent(
                template
              )}&data=${encodeURIComponent(json)}`}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
