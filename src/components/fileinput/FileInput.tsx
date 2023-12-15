import React from "react";
import { useFormikContext } from "formik";

const FileInput = ({ name }) => {
  const { setFieldValue } = useFormikContext();
  // console.log("name", name);
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue(name, file);
  };

  return <input type="file" name={name} onChange={handleFileChange} />;
};

export default FileInput;
