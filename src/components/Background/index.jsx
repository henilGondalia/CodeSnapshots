import { useEffect, useRef, forwardRef } from "react";
import Window from "./Window";

const MAX_WIDTH = 1000;
const MIN_WIDTH = 400;

export default forwardRef((props, ref) => {
  const {
    backgroundColor,
    padding,
    color,
    language,
    exporting,
    exportingGIF,
    editorCode,
    setEditorCode,
    filename,
    setFilename,
    LANGUAGES,
  } = props;

  const backgroundRef = ref;
  const handleRightRef = useRef(null);
  const handleLeftRef = useRef(null);

  useEffect(() => {
    const backgroundEl = backgroundRef.current;
    const handleRightEl = handleRightRef.current;
    const handleLeftEl = handleLeftRef.current;

    function initResizeRight() {
      window.addEventListener("mousemove", resizeRight, false);
      window.addEventListener("mouseup", stopResizeRight, false);
    }

    function resizeRight(e) {
      e.preventDefault();
      backgroundEl.style.width = e.clientX - backgroundEl.offsetLeft + "px";

      if (+backgroundEl.style.width.replace("px", "") < MIN_WIDTH) {
        backgroundEl.style.width = MIN_WIDTH + "px";
      }
      if (+backgroundEl.style.width.replace("px", "") > MAX_WIDTH) {
        backgroundEl.style.width = MAX_WIDTH + "px";
      }
    }

    function stopResizeRight() {
      window.removeEventListener("mousemove", resizeRight, false);
      window.removeEventListener("mouseup", stopResizeRight, false);
    }

    function initResizeLeft() {
      window.addEventListener("mousemove", resizeLeft, false);
      window.addEventListener("mouseup", stopResizeLeft, false);
    }

    function resizeLeft(e) {
      e.preventDefault();
      backgroundEl.style.width =
        window.innerWidth - e.clientX - backgroundEl.offsetLeft + "px";

      if (+backgroundEl.style.width.replace("px", "") < MIN_WIDTH) {
        backgroundEl.style.width = MIN_WIDTH + "px";
      }
      if (+backgroundEl.style.width.replace("px", "") > MAX_WIDTH) {
        backgroundEl.style.width = MAX_WIDTH + "px";
      }
    }

    function stopResizeLeft() {
      window.removeEventListener("mousemove", resizeLeft, false);
      window.removeEventListener("mouseup", stopResizeLeft, false);
    }

    handleRightEl.addEventListener("mousedown", initResizeRight, false);
    handleLeftEl.addEventListener("mousedown", initResizeLeft, false);

    return () => {
      handleRightEl.removeEventListener("mousedown", initResizeRight, false);
      handleLeftEl.removeEventListener("mousedown", initResizeLeft, false);
    };
  }, [backgroundRef]);

  return (
    <div
      className={`background background-color-${
        (exporting || exportingGIF) && backgroundColor === "transparent"
          ? ""
          : backgroundColor
      }`}
      ref={backgroundRef}
      style={{ padding: padding + "px" }}
    >
      <div
        className="resize-handle-left"
        ref={handleLeftRef}
        style={{ display: !(exporting || exportingGIF) ? "block" : "none" }}
      />
      <div
        className="resize-handle-right"
        ref={handleRightRef}
        style={{ display: !(exporting || exportingGIF) ? "block" : "none" }}
      />
      <Window
        padding={padding}
        color={color}
        LANGUAGES={LANGUAGES}
        language={language}
        //   exporting={exporting}
        //   exportingGIF={exportingGIF || allGIFFramesCaptured}
        filename={filename}
        setFilename={setFilename}
        editorCode={editorCode}
        setEditorCode={setEditorCode}
      />
    </div>
  );
});
