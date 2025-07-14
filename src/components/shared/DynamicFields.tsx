import React from "react";

export interface FormField {
  id: string;
  name: string;
  value: string;
}

interface DynamicFieldsProps {
  fields: FormField[];
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}

const DynamicFields: React.FC<DynamicFieldsProps> = ({ fields, setFields }) => {
  const handleAddField = () => {
    setFields([...fields, { id: `field-${Date.now()}`, name: "", value: "" }]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleFieldChange = (
    id: string,
    key: keyof FormField,
    value: string
  ) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  return (
    <div className="space-y-4 flex flex-col">
      {fields.length === 0 && (
        <p className="text-center">No fields added yet.</p>
      )}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex w-90 flex-col p-2 space-y-4 border rounded"
        >
          <div className="flex justify-between">
            <p>Field {index + 1}</p>
            <button
              type="button"
              onClick={() => handleRemoveField(field.id)}
              className="bg-red-500 text-white p-2 rounded min-w-10 self-end"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            placeholder="Field Name"
            value={field.name}
            onChange={(e) =>
              handleFieldChange(field.id, "name", e.target.value)
            }
            className="border p-2 rounded w-full"
          />
          <textarea
            placeholder="Field Value"
            value={field.value}
            onChange={(e) =>
              handleFieldChange(field.id, "value", e.target.value)
            }
            className="border p-2 rounded w-full"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddField}
        className="bg-blue-500 text-white p-2 rounded w-20 self-center"
      >
        Add Field
      </button>
    </div>
  );
};

export default DynamicFields;
