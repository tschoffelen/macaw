import React, { useState, useEffect, createRef } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { saveAs } from "file-saver";
import socketio from "socket.io-client";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/json-lint";
import "codemirror/theme/material-darker.css";

import "./index.css";

const jsonlint = require("jsonlint-mod");
window.jsonlint = jsonlint;

const socket = socketio(
  window.location.host.replace(":3000", ":4000").replace(":3001", ":4000")
);

let defaultData = {
  subject: "Hello, world",
  to: { name: "John", email: "john@example.com" }
};

const defaultJson = JSON.stringify(defaultData, null, 2);

function App() {
  const [initialJson, setInitialJson] = useState(defaultJson);
  const [json, setJson] = useState(defaultJson);
  const [mode, setMode] = useState("responsive");
  const [html, setHtml] = useState("");
  const [template, setTemplate] = useState(localStorage.lastTemplate || "");
  const [templates, setTemplates] = useState([]);
  const iframe = createRef();

  useEffect(() => {
    socket.on("templates", data => {
      setTemplates(data);
      if (data.length && (!template || !data.includes(template))) {
        setTemplate(data[0]);
      }
    });
    if (!templates) {
      socket.emit("templates");
    }
  }, [template, templates]);
  useEffect(() => {
    socket.on("render", html => {
      setHtml(html);
      if (!iframe.current) {
        return;
      }
      iframe.current.contentWindow.document.body.innerHTML = html;
    });
    socket.on("render-error", message => {
      if (!iframe.current) {
        return;
      }
      // TODO: make render errors look nicer
      iframe.current.contentWindow.document.body.innerHTML = `
        <h3 style="color: red; font-family: Arial;">Render error</h3>
        <pre>${message}</pre>
      `;
    });
    if (template) {
      try {
        const data = JSON.parse(json);
        socket.emit("data", [template, data]);
      } catch (e) {
        console.log("Invalid JSON payload:", e);
      }
    }
  }, [template, json, iframe]);
  useEffect(() => {
    try {
      if (localStorage[`lastJson${template}`]) {
        defaultData = JSON.parse(localStorage[`lastJson${template}`]);
      }
      const defaultJson = JSON.stringify(defaultData, null, 2);
      setInitialJson(defaultJson);
      setJson(defaultJson);
    } catch (e) {
      // do nothing
    }
  }, [template]);

  const downloadAsHtml = () => {
    const contents = `
      <!-- 
      
      Template name: ${template}
      
      JSON payload:
      ${json}
      
      -->
      ${html}
    `;

    const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${template}.html`);
  };

  return (
    <>
      <aside>
        <div>
          <section>
            <h1 className="logo">
              <svg width="29" height="32">
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M14.549 23.08l-.867-.349c-.039.121-1.195 1.843-1.195 1.843-3.094-.145-4.628 1.182-3.848 1.182h5.018a.334.334 0 00.11-.52l-.363-.423 1.145-1.733z"
                    fill="#BAA3A5"
                  />
                  <path
                    d="M25.467 28.853c.913 1.422-1.318 2.915-2.26 1.452l-5.055-7.858c-.912-1.42 1.317-2.919 2.26-1.453l5.055 7.859"
                    fill="#7ED321"
                  />
                  <path
                    d="M28.375 29.925c.914 1.422-1.318 2.915-2.258 1.453L21.06 23.52c-.913-1.419 1.316-2.918 2.258-1.452l5.056 7.858"
                    fill="#1DA029"
                  />
                  <path
                    d="M16.187 9.438l-7.77 2.046-6.601-9.043c2.668-5.075 12.45-1.995 14.37 6.997z"
                    fill="#3197F4"
                  />
                  <path
                    d="M1.816 2.44S4.068.67 6.186 1.673c2.119 1.004 2.119 3.234 1.479 5.734-.32 1.247-1.667 1.434-2.482.733l-1.45-1.226L2.16 3.706 1.816 2.44z"
                    fill="#DADCE0"
                  />
                  <path
                    d="M2.691 9.324s-.296-.85.173-1.686c.58.408 1.353.576 2.319.501-.297-2.676-1.42-4.575-3.367-5.698C-.08 3.933-.044 8 2.69 9.324z"
                    fill="#555555"
                  />
                  <path
                    d="M5.257 2.728a.587.587 0 11-1.175 0 .587.587 0 011.175 0"
                    fill="#212123"
                  />
                  <path
                    d="M16.831 21.63c0 1.127-.948 2.04-2.116 2.04-1.169 0-2.116-.913-2.116-2.04s.947-2.04 2.116-2.04c1.168 0 2.116.913 2.116 2.04"
                    fill="#ECB323"
                  />
                  <path
                    d="M5.74 14.16c3.345 6.319 9.664 9.478 18.955 9.478l-6.02-12.154L7.89 6.603 5.183 8.139c-.096.142-.911 3.247.557 6.021z"
                    fill="#FCCD03"
                  />
                  <path
                    d="M17.002 20.293c1.225-.001 3.346-2.495 4.46-2.788.792-.208.622 1.86 1.296 1.495 1.432 3.484 3.059 5.848 3.059 5.848-2.412-.764-6.157-2.275-8.815-4.555z"
                    fill="#0D0A4E"
                  />
                  <path
                    d="M22.758 19c-1.622.879-3.572 1.391-5.67 1.393-2.963-2.54-7.266-6.437-8.745-9.094-3.86-6.933 4.773-7.707 9.312-1.793 2.05 2.67 3.813 6.356 5.103 9.494"
                    fill="#095FB5"
                  />
                </g>
              </svg>
              Email template preview
            </h1>
          </section>
          <section>
            <h3>Select template</h3>
            <div className="select">
              <select
                onChange={e => {
                  setTemplate(e.target.value);
                  localStorage.lastTemplate = e.target.value;
                }}
              >
                <option disabled selected={template === ""}>
                  Choose a template
                </option>
                {templates.map(templ => (
                  <option
                    key={templ}
                    value={templ}
                    selected={templ === template}
                  >
                    {templ}
                  </option>
                ))}
              </select>
              <svg width="10" height="7">
                <path
                  d="M1.18.758L5 4.58 8.82.76 10 1.937l-5 5-5-5z"
                  fill="#171A23"
                  fillRule="nonzero"
                />
              </svg>
            </div>
          </section>
          <section>
            <h3>Options</h3>
            <div className="options">
              <button onClick={downloadAsHtml} className="styled-button">
                Download
              </button>
              <div className="toggle">
                <button
                  onClick={() => setMode("responsive")}
                  className={`responsive ${
                    mode === "responsive" ? "active" : ""
                  }`}
                >
                  <svg width="26" height="21">
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
                </button>
                <button
                  onClick={() => setMode("tablet")}
                  className={`tablet ${mode === "tablet" ? "active" : ""}`}
                >
                  <svg width="26" height="19">
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
                </button>
                <button
                  onClick={() => setMode("mobile")}
                  className={`mobile ${mode === "mobile" ? "active" : ""}`}
                >
                  <svg width="16" height="27">
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
                </button>
              </div>
            </div>
          </section>
          <section>
            <h3>JSON data</h3>
            <CodeMirror
              value={initialJson}
              onChange={(editor, data, value) => {
                setJson(value);
                localStorage[`lastJson${template}`] = value;
              }}
              options={{
                mode: "application/json",
                theme: "material-darker",
                line: true,
                lint: true,
                json: true
              }}
            />
          </section>
        </div>
      </aside>
      <main>
        <div className={`frame ${mode}`}>
          <div className="frame-inner">
            <iframe
              key="preview"
              ref={iframe}
              title="Preview"
              frameBorder={0}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
