"use client";
import styles from "./UploadedFileConverter.module.css";
import useFetch from "@/utils/useFetch";
import templates from "@/templates/templates";
import { ChangeEvent, useCallback, useMemo } from "react";
import classNames from "@/utils/classNames";

type UploadedFileConverterProps = { context: string; file: File };

export default function UploadedFileConverter({
  context,
  file,
}: UploadedFileConverterProps) {
  const [fetchData, convertedFile, { loading, error, response }] = useFetch(
    (formData: FormData) =>
      fetch("/api/generate", {
        method: "POST",
        body: formData,
      }),
    {
      async interceptor(response) {
        if (response.ok) return response;
        else throw (await response.json()).responseBody;
      },
      transformer: (response) => response.blob(),
    }
  );

  const handleFormSubmit = useCallback(
    (event: ChangeEvent<HTMLFormElement>) => {
      const form = event.target;
      if (!form) return;

      event.preventDefault();
      const formData = new FormData(form);
      formData.set("file", file);
      formData.set("context", context);
      fetchData(formData);
    },
    [fetchData, file, context]
  );

  const fileUrl = useMemo(
    () => convertedFile && window.URL.createObjectURL(convertedFile),
    [convertedFile]
  );

  const fileName = useMemo(
    () => response && response.headers.get("filename"),
    [response]
  );

  const submitButton = useMemo(() => {
    if (loading)
      return {
        icon: "fa-solid fa-refresh fa-spin",
      };
    if (fileUrl)
      return {
        title: "Convertir à nouveau",
        icon: "fa-solid fa-refresh",
      };
    return {
      label: "Convertir",
      icon: "fa-solid fa-arrow-right-arrow-left",
    };
  }, [loading, fileUrl]);

  return (
    <>
      <form
        className={classNames(
          styles.content,
          styles.file,
          fileUrl && !loading && styles.success
        )}
        onSubmit={handleFormSubmit}
      >
        <div className={classNames(styles.fileData)} title={file.name}>
          {file.name}
        </div>
        <div className={classNames(styles.fileTemplate)}>
          <select name="template">
            {Object.entries(templates).map(([templateKey, template]) => (
              <option key={templateKey} value={templateKey}>
                {template.label}
              </option>
            ))}
          </select>
        </div>
        <div className={classNames(styles.fileActions)}>
          {!!fileUrl && (
            <a href={fileUrl} download={fileName}>
              Télécharger
              <i className="fa-solid fa-download"></i>
            </a>
          )}
          <button type="submit" disabled={loading} title={submitButton.title}>
            {submitButton.label}
            <i className={submitButton.icon}></i>
          </button>
        </div>
      </form>
      {!!error && <div className={styles.error}>{JSON.stringify(error)}</div>}
    </>
  );
}

export function UploadedFileConverterHeader() {
  return (
    <div className={styles.content}>
      <span className={classNames(styles.fileData, styles.header)}>
        Nom du fichier
      </span>
      <span className={classNames(styles.fileTemplate, styles.header)}>
        Format de sortie
      </span>
      <span className={classNames(styles.fileActions, styles.header)}>
        Actions
      </span>
    </div>
  );
}
