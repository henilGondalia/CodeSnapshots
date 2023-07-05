import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
import BackgroundColorInput from "./BackgroundColorInput";
import Button from "./Button";

const Header = ({
  COLORS,
  LANGUAGES,
  color,
  padding,
  frameDuration,
  language,
  backgroundColor,
  exportingGIF,
  setColor,
  setPadding,
  setFrameDuration,
  setLanguage,
  setBackgroundColor,
  onExport,
  onRecord,
}) => {
  return (
    <div className="header-container">
      <header className="header">
        <div className="header__part">
          <SelectInput
            name="Colors"
            value={color}
            onChange={setColor}
            options={COLORS}
          />
          <NumberInput name="Padding" value={padding} onChange={setPadding} />
          <NumberInput
            name="Frame Duration"
            value={frameDuration}
            onChange={setFrameDuration}
          />
          <SelectInput
            name="Language"
            value={language}
            onChange={setLanguage}
            options={Object.keys(LANGUAGES)}
          />
          <BackgroundColorInput
            value={backgroundColor}
            onChange={setBackgroundColor}
          />
          <div className="buttons">
            <Button type="export" onClick={onExport}>
              Export PNG
            </Button>
            <Button type="record" onClick={onRecord} disabled={exportingGIF}>
              {exportingGIF ? "Saving" : "Export GIF"}
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
};
export default Header;
