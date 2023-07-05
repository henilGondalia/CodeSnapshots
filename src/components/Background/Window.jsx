import React, { useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { EXTENTION } from "../../constant";

const TABSIZE = 2;

const Window = ({
  color,
  editorCode,
  LANGUAGES,
  language,
  setEditorCode,
  filename,
  setFilename,
}) => {
  // Rename file extention if the language is not plaintext
  useEffect(() => {
    setFilename((prev) => {
      const extensionStripped = prev.substr(0, prev.lastIndexOf("."));
      if (extensionStripped && EXTENTION[LANGUAGES[language]]) {
        return extensionStripped + `.${EXTENTION[LANGUAGES[language]]}`;
      } else {
        return prev;
      }
    });
  }, [language, setFilename]);

  function onEditorChange(code) {
    setEditorCode((prev) => {
      if (code.length > prev.length) {
        let lastCharacter = code[code.length - 1];
        let secondLastCharacter = code[code.length - 2];
        let lastCharacterIndex;

        for (let i = code.length - 2; i >= 0; i--) {
          if (code[i] !== " " && code[i] !== "\n") {
            secondLastCharacter = code[i];
            break;
          }
        }

        for (let i = code.length - 1; i >= 0; i--) {
          if (code[i] !== " ") {
            lastCharacter = code[i];
            lastCharacterIndex = i;
            break;
          }
        }

        console.log({ secondLastCharacter });
        console.log({ lastCharacter });

        if (
          ["{", "[", "(", ":"].includes(secondLastCharacter) &&
          lastCharacter === "\n" &&
          code[lastCharacterIndex - 1] !== " "
        ) {
          return code + " ".repeat(TABSIZE);
        } else if (["}", "]", ")"].includes(lastCharacter)) {
          for (let i = code.length - 2; i >= 0; i--) {
            if (code[i] !== " ") {
              secondLastCharacter = code[i];
              break;
            }
          }
          if (
            code[lastCharacterIndex - 1] === " " &&
            secondLastCharacter === "\n"
          ) {
            let codeSplit = code.split("");
            codeSplit.splice(code.length - (1 + TABSIZE), TABSIZE);

            return codeSplit.join("");
          }
        }
      }
      return code;
    });
  }

  const onFilenameChange = (event) => {
    setFilename(event.currentTarget.textContent);
  };
  const toSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };
  return (
    <div className="window">
      <link href={`/themes/${toSlug(color)}.css`} rel="stylesheet" />
      <div className="title-bar">
        <div className="title-buttons">
          <div className="title-button" />
          <div className="title-button" />
          <div className="title-button" />
        </div>
        <p className="title-text">
          <img
            src={`/lang_icons/${LANGUAGES[language]}.svg`}
            alt=""
            className="language-icon"
          />
          {/* contentEditable makes the span editable in the browser. it is not managed by React */}
          <span
            contentEditable
            onBlur={onFilenameChange}
            dangerouslySetInnerHTML={{ __html: filename }}
          ></span>
        </p>
      </div>
      <div className="editor_wrap">
        <Editor
          value={editorCode}
          onValueChange={onEditorChange}
          highlight={(code) => highlight(code, languages[LANGUAGES[language]])}
          padding={10}
          tabSize={TABSIZE}
          style={{
            fontFamily: '"Mononoki", "Fira Mono", monospace',
            fontSize: 15,
            outline: "none",
            lineHeight: "21px",
            minHeight: "30vh",
          }}
        />
      </div>
    </div>
  );
};

export default Window;
