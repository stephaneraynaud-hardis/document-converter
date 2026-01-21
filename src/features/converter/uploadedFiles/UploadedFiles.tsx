"use client";
import UploadedFileConverter, {
  UploadedFileConverterHeader,
} from "./UploadedFileConverter";
import styles from "./UploadedFiles.module.css";

type UploadedFileConverterProps = { context: string; files: File[] };

export default function UploadedFiles({
  files,
  context,
}: UploadedFileConverterProps) {
  return (
    <div>
      <UploadedFileConverterHeader />
      <div className={styles.content}>
        {files.map((file) => (
          <UploadedFileConverter
            key={file.name}
            file={file}
            context={context}
          />
        ))}
        {files.length === 0 && (
          <div className={styles.noContent}>Aucun fichier sélectionné.</div>
        )}
      </div>
    </div>
  );
}
