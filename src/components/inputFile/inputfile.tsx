import React, { useState } from "react";
import File from "./file";

interface UploadedFileInfo {
  filename: string;
  originalname: string;
  path: string;
}

const InputFile: React.FC = () => {
  const [photo, setPhoto] = useState<File[] | null>(null);
  const [uploadedFilesInfo, setUploadedFilesInfo] = useState<
    UploadedFileInfo[] | null
  >(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadMessage(null);

    if (!photo || photo.length === 0) {
      setUploadMessage("*Будь ласка, виберіть файли для завантаження.");
      return;
    }

    const formData = new FormData();
    photo.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Помилка HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Відповідь від сервера:", data);
      setUploadMessage(data.message || "Файли успішно завантажено!");

      setUploadedFilesInfo((prevFiles) => {
        const newFiles = data.files || [];
        if (prevFiles) {
          return [...prevFiles, ...newFiles];
        } else {
          return newFiles;
        }
      });

      // Після успішного завантаження очищуємо інпут та стан photo.
      // Це потрібно робити, щоб користувач міг вибрати нові файли.
      setPhoto(null);
    } catch (error: unknown) {
      const err = error as any;
      console.error("Помилка завантаження:", err.message);
      setUploadMessage(`Помилка завантаження файлів: ${err.message}`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Загрузити фото</h2>

        <File
          placeholder="Додати фото"
          accept=".jpg, .jpeg, .wepb"
          multiple={true}
          files={photo}
          setFiles={setPhoto}
        />
        <button type="submit">Відправити</button>
        {uploadMessage && (
          <p
            style={{
              marginTop: "15px",
              color: uploadMessage.includes("*") ? "red" : "green",
            }}
          >
            {uploadMessage}
          </p>
        )}
      </form>

      {uploadedFilesInfo && uploadedFilesInfo.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Завантажені фото на сервері:</h3>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {uploadedFilesInfo.map((fileInfo) => (
              <li
                key={fileInfo.filename}
                style={{
                  border: "1px solid #ccc",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              >
                <img
                  src={`http://localhost:5000${fileInfo.path}`}
                  alt={fileInfo.originalname}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    objectFit: "cover",
                  }}
                />

                <p style={{ fontSize: "0.8em", textAlign: "center" }}>
                  {fileInfo.originalname}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default InputFile;
