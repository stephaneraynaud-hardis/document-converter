"use client";
import Card from "@/common/Card";
import Favicon from "@/common/favicon.svg";
import Textarea from "@/common/Textarea";
import UploadedFiles from "@/features/converter/uploadedFiles/UploadedFiles";
import joinValidStrings from "@/utils/joinValidStrings";
import Image from "next/image";
import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import styles from "./ConverterPage.module.css";

const DEFAULT_CONTEXT = "";

export default function ConverterPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [context, setContext] = useState(DEFAULT_CONTEXT);

  const createConverter = useCallback((uploadingFiles: File[]) => {
    setUploadedFiles((files) => [...files, ...uploadingFiles]);
  }, []);

  return (
    <div className={styles.content}>
      <h1>
        <Image src={Favicon} alt="icone" /> Convertisseur de documents
      </h1>
      <div className={styles.form}>
        <label>Informations supplémentaires</label>
        <Textarea
          value={context}
          placeholder="Ajoutez ici du contexte ou des informations supplémentaires pour l'extraction des données du document."
          onChange={(e) => setContext(e.target.value)}
        />
      </div>
      <Dropzone onDrop={(files) => createConverter(files)}>
        {({
          getRootProps,
          getInputProps,
          isDragAccept,
          isDragActive,
          isDragReject,
          isFocused,
        }) => (
          <Card
            {...getRootProps({
              className: joinValidStrings(
                [
                  styles.fileInput,
                  isFocused && styles.focused,
                  isDragAccept && styles.dragAccept,
                  isDragActive && styles.dragActive,
                  isDragReject && styles.dragReject,
                ],
                " "
              ),
            })}
          >
            <input {...getInputProps()} />
            <p>
              <strong>Glissez-déposez</strong> ou <strong>cliquez ici</strong>{" "}
              pour sélectionner le ou les fichiers à transformer.
            </p>
          </Card>
        )}
      </Dropzone>
      {uploadedFiles.length > 0 && (
        <UploadedFiles files={uploadedFiles} context={context} />
      )}
      <section className={styles.help}>
        <h2>
          <i className="fa-solid fa-circle-info" /> Informations
        </h2>
        <ul>
          <li>
            Le champ <i>Informations supplémentaires</i> permet à
            l&apos;intelligence artificielle de mieux comprendre le contexte de
            l&apos;extraction pour améliorer la restitution des données. Il
            permet aussi d&apos;inclure ou de transformer des informations dans
            le document généré.
          </li>
          <li>
            <strong>La génération peut prendre plusieurs minutes</strong> ;
            veuillez patienter sans fermer la page.
          </li>
          <li>
            <strong>Les documents générés peuvent contenir des erreurs</strong>{" "}
            ; pensez à toujours vérifier leur contenu.
          </li>
        </ul>
      </section>
    </div>
  );
}
