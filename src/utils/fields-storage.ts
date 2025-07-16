interface FormField {
  name: string;
  value: string;
}

const STORAGE_KEY = "formFields";

class FieldsStorage {
  static async saveFields(fields: FormField[]) {
    chrome.storage.sync.set({ [STORAGE_KEY]: fields });
  }

  static async getFields(): Promise<FormField[]> {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    return result[STORAGE_KEY] ?? [];
  }
}

export default FieldsStorage;
