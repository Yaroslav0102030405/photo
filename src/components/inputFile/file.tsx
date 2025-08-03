import React from "react";

interface FileProps {
  placeholder: string;
  accept: string;
  multiple: boolean;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const File: React.FC<FileProps> = ({
  placeholder,
  accept,
  multiple,
  files,
  setFiles,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = [...e.target.files];
      setFiles((prevFiles) => {
        if (prevFiles) {
          // !!! ОСНОВНА ЛОГІКА !!!
          // Тут ми об'єднуємо старі файли з новими
          return [...prevFiles, ...newFiles];
        } else {
          return newFiles;
        }
      });
      // Після додавання файлів до стану, очищуємо інпут
      e.target.value = "";
    } else {
      setFiles(null);
    }
  };

  return (
    <>
      <div className="file-container">
        <label className="file-label">
          <input
            className="file-element"
            type="file"
            name="images"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
          />
          <span>{placeholder}</span>
        </label>

        <ul>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <li key={i} className="file-info">
                <p>{file.name}</p>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default File;
