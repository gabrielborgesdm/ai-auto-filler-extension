import React, { useState, useEffect } from "react";
import DynamicFields, { FormField } from "@/components/shared/DynamicFields";

interface SettingsComponentProps {
  onSave: () => void;
}

const SettingsComponent: React.FC<SettingsComponentProps> = ({ onSave }) => {
  const [fields, setFields] = useState<FormField[]>([]);

  const handleSave = () => {
    chrome.storage.sync.set({ formFields: fields }, () => {
      console.log("Fields saved");
    });
    onSave();
  };

  useEffect(() => {
    // Load fields from storage
    chrome.storage.sync.get(["formFields"], (result) => {
      if (result.formFields) {
        setFields(result.formFields);
      }
    });
  }, []);

  return (
    <>
      <h1>Settings</h1>
      <DynamicFields fields={fields} setFields={setFields} />

      <button
        onClick={handleSave}
        type="button"
        className="bg-green-500 text-white p-2 rounded w-full"
      >
        Save
      </button>
    </>
  );
};

export default SettingsComponent;
