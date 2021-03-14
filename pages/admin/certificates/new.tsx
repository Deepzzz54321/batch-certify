import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  Button,
  Row,
  Label,
  Input,
  FormFeedback,
  Collapse,
  Card,
  Spinner,
} from "reactstrap";
import useSWR from "swr";
import ErrorMessage from "../../../components/ErrorMessage";
import InputField from "../../../components/InputField";
import LoadingSpinner from "../../../components/LoadingSpinner";
import fetch from "../../../utils/fetch";
import Papa from "papaparse";
import JsonToTable from "../../../components/JsonToTable";
import isoFetch from "isomorphic-unfetch";
import { toast } from "react-toastify";
import { mutate } from "swr";
import DataTable from "../../../components/DataTable";

function UploadCSV({ handleFirstStep }) {
  const { register, handleSubmit, watch, errors, setError } = useForm<{
    csvFile: FileList;
  }>({
    mode: "onChange",
  });
  const watchFile = watch("csvFile");
  const [localData, setLocalData] = useState(null);
  const [columns, setColumns] = useState(null);

  const parseCSV = (file: File) => {
    let data = [];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        if (
          results.meta.fields.includes("Name") &&
          results.meta.fields.includes("Email")
        ) {
          setColumns(
            results.meta.fields.map((field) => ({
              Header: field,
              accessor: field,
            }))
          );
          setLocalData(results.data);
        } else
          setError("csvFile", { message: "Fields Name and Email missing" });
      },
    });
    return data;
  };

  useEffect(() => {
    if (
      watchFile &&
      watchFile.length > 0 &&
      watchFile[0].name.endsWith(".csv")
    ) {
      parseCSV(watchFile[0]);
    }
  }, [watchFile]);

  return (
    <Form>
      <div className="custom-file mb-3">
        <Input
          className="custom-file-input"
          id="csvFile"
          name="csvFile"
          lang="en"
          type="file"
          innerRef={register({
            required: "This field is required!",
            validate: (value) => {
              if (value && value.length > 0 && value[0].size / 1000000 > 3)
                return "Maximum file size is 3MB!";
              if (value && value.length > 0 && !value[0].name.endsWith(".csv"))
                return "Only CSV files supported!";
            },
          })}
          invalid={Boolean(errors.csvFile && errors.csvFile.message)}
        />
        {errors.csvFile && errors.csvFile.message && (
          <FormFeedback>{errors.csvFile.message}</FormFeedback>
        )}
        <Label className="custom-file-label" htmlFor="csvFile">
          CSV File of Candidates{" "}
          {watchFile && watchFile.length > 0 && (
            <span>({watchFile[0].name})</span>
          )}
        </Label>
      </div>
      {localData && localData.length > 0 && (
        <div>
          <h4>Preview Data</h4>
          <div className="overflow-auto mb-3">
            <Card>
              <DataTable columns={columns} data={localData} />
            </Card>
          </div>

          <div className="text-center">
            <Button color="primary" onClick={() => handleFirstStep(localData)}>
              Finalise Data
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
}

export default function NewCertificate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm<{
    templateId: string;
  }>();
  const { data, error } = useSWR("/api/templates", fetch);
  const { query } = useRouter();
  const queryId = query.id;
  const onSubmit = (data) => {
    setIsSubmitting(true);
    isoFetch("/api/certificates/create-batch", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        templateId: data.templateId,
        certificates: jsonData,
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        console.log(data);
        toast.success(
          `Created Certificates: ${
            data.certificates && data.certificates.length
          }`
        );
        mutate("/api/certificates");
      })
      .catch((error) =>
        error.json().then((err) => {
          console.log(err);
          toast.error(err.error);
        })
      )
      .finally(() => setIsSubmitting(false));
  };
  const [formStep, setFormStep] = useState(1);
  const [jsonData, setJsonData] = useState(null);

  return (
    <>
      <h1 className="mb-3">Create Certificate</h1>
      {!data && !error && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load Templates" />}
      {!error && data && (
        <>
          <div className="border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
            <h2 className="">
              1. Upload List of Candidates {formStep != 1 && <span>✅</span>}
            </h2>
            {formStep != 1 && (
              <Button color="info" onClick={() => setFormStep(1)}>
                Change
              </Button>
            )}
          </div>
          <Collapse isOpen={formStep == 1}>
            <UploadCSV
              handleFirstStep={(data) => {
                setJsonData(data);
                setFormStep(2);
              }}
            />
          </Collapse>
          <h2 className="border-bottom pb-2 mb-3">2. Select Template</h2>
          <Collapse isOpen={formStep == 2}>
            <Form onSubmit={handleSubmit(onSubmit)} className="mb-3">
              <InputField
                name="templateId"
                label="Template"
                type="select"
                error={errors.templateId}
                defaultValue={queryId}
                formRef={register({ required: "This field is required!" })}
              >
                {data.templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </InputField>
              <div className="text-center">
                <Button
                  color="success"
                  size="lg"
                  className="px-5"
                  disabled={isSubmitting}
                >
                  <span className="d-flex align-items-center">
                    {isSubmitting && (
                      <Spinner color="white" size="sm" className="mr-2" />
                    )}
                    Create
                  </span>
                </Button>
              </div>
            </Form>
          </Collapse>
        </>
      )}
    </>
  );
}
