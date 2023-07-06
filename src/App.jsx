import { useState, useRef, useEffect } from "react";
import Header from "./components/Header/Header";
import { COLORS, LANGUAGES } from "./constant";
import Background from "./components/Background";
import domtoimage from "dom-to-image-more";
import { createGIF } from "gifshot";

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

  useEffect(() => {
    if (exportingGIF && !singleFrameProcessing) {
      if (currentFrameToCapture === frames.length - 1) {
        setExportingGIF(false);
        setAllGIFFramesCaptured(true);
        setCurrentFrameToCapture(0);
      } else {
        setCurrentFrameToCapture((prev) => prev + 1);
      }
    }
  }, [
    exportingGIF,
    singleFrameProcessing,
    currentFrameToCapture,
    frames.length,
  ]);

  useEffect(() => {
    // set Frames inside code editor
    if (exportingGIF) {
      setEditorCode(frames[currentFrameToCapture]);
    }
  }, [exportingGIF, currentFrameToCapture, frames]);

  useEffect(() => {
    if (exportingGIF && !singleFrameProcessing) {
      setSingleFrameProcessing(true);

      takeSnapshot().then((imageBlob) => {
        setGIFFrames((prev) => [...prev, imageBlob]);
        setSingleFrameProcessing(false);
      });
    }
  }, [exportingGIF, editorCode, frames, singleFrameProcessing]);

  useEffect(() => {
    if (allGIFFramesCaptured && gifFrames.length === frames.length) {
      const width = backgroundRef.current.offsetWidth * SCALE;
      const height = backgroundRef.current.offsetHeight * SCALE;
      const framesToExport = [...gifFrames];
      for (let i = 0; i < 9; i++) {
        framesToExport.push(gifFrames[gifFrames.length - 1]);
      }
      createGIF(
        {
          images: framesToExport,
          gifWidth: width,
          gifHeight: height,
          numWorkers: 5,
          frameDuration,
          sampleInterval: 7,
        },
        (obj) => {
          if (!obj.error) {
            downloadBlob(obj.image, `${filename}.gif`);
          }
          setAllGIFFramesCaptured(false);
          setGIFFrames([]);
          setFrames([]);
        }
      );
    }
  }, [allGIFFramesCaptured, gifFrames, frames, filename, frameDuration]);

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
    const totalLines = editorCode.split("\n").length;
    let linesLeft = totalLines;
    let tempFrames = [];
    for (let i = 0; i < editorCode.length; i++) {
      if (editorCode[i] === "\n") {
        linesLeft--;
      }
      let currentFrame = editorCode.slice(0, i + 1);
      currentFrame += "\n".repeat(linesLeft);
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
