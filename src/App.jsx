import { useState, useRef, useEffect } from "react";
import Header from "./components/Header/Header";
import { COLORS, LANGUAGES } from "./constant";
import Background from "./components/Background";
import domtoimage from "dom-to-image-more";

const SCALE = 1.9;

function App() {
  const backgroundRef = useRef(null);
  const [color, setColor] = useState(COLORS[0]);
  const [padding, setPadding] = useState(42);
  const [frameDuration, setFrameDuration] = useState(1);
  const [language, setLanguage] = useState("JavaScript");
  const [backgroundColor, setBackgroundColor] = useState(2);
  const [exporting, setExporting] = useState(false);
  const [exportingGIF, setExportingGIF] = useState(false);
  const [currentFrameToCapture, setCurrentFrameToCapture] = useState(0);
  const [filename, setFilename] = useState("App.js");
  const [frames, setFrames] = useState([]);
  const [gifFrames, setGIFFrames] = useState([]);
  const [editorCode, setEditorCode] = useState("// Type your code here");
  const [allGIFFramesCaptured, setAllGIFFramesCaptured] = useState(false);
  const [singleFrameProcessing, setSingleFrameProcessing] = useState(false);

  const takeSnapshot = async () => {
    const node = backgroundRef.current;

    const style = {
      transform: "scale(" + SCALE + ")",
      transformOrigin: "top left",
      width: node.offsetWidth + "px",
      height: node.offsetHeight + "px",
    };

    const param = {
      height: node.offsetHeight * SCALE,
      width: node.offsetWidth * SCALE,
      quality: 1,
      style,
    };

    const base64Image = await domtoimage.toPng(node, param);
    return base64Image;
  };

  const downloadBlob = (blob, fileName) => {
    let link = document.createElement("a");
    link.setAttribute("href", blob);
    link.setAttribute("download", fileName);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(typeof blob);
  };

  const onExport = () => {
    setExporting(true);
    setTimeout(() => {
      takeSnapshot()
        .then((blobUrl) => {
          downloadBlob(blobUrl, `${filename}.png`);
        })
        .catch((error) => {
          console.log("Error: " + error);
        })
        .finally(() => setExporting(false));
    }, 100);
  };

  const onRecord = () => {
    debugger;
    const totalLines = editorCode
      .split("")
      .filter((letter) => letter === "\n").length;
    let linesLeft = totalLines;
    let tempFrames = [];
    for (let i = 0; i < editorCode.length; i++) {
      if (editorCode[i] === "\n") {
        linesLeft--;
      }
      let currentFrame = editorCode.slice(0, i + 1);
      for (let j = 0; j < linesLeft; j++) {
        currentFrame += "\n";
      }
      tempFrames.push(currentFrame);
    }
    setFrames(tempFrames);
    setExportingGIF(true);
  };

  return (
    <div className="App">
      <Header
        COLORS={COLORS}
        LANGUAGES={LANGUAGES}
        color={color}
        padding={padding}
        frameDuration={frameDuration}
        language={language}
        backgroundColor={backgroundColor}
        exportingGIF={exportingGIF || allGIFFramesCaptured}
        setColor={setColor}
        setPadding={setPadding}
        setFrameDuration={setFrameDuration}
        setLanguage={setLanguage}
        setBackgroundColor={setBackgroundColor}
        onExport={onExport}
        onRecord={onRecord}
      />
      <div className="center">
        <Background
          ref={backgroundRef}
          backgroundColor={backgroundColor}
          padding={padding}
          color={color}
          LANGUAGES={LANGUAGES}
          language={language}
          exporting={exporting}
          exportingGIF={exportingGIF || allGIFFramesCaptured}
          filename={filename}
          setFilename={setFilename}
          editorCode={editorCode}
          setEditorCode={setEditorCode}
        />
      </div>
    </div>
  );
}

export default App;
