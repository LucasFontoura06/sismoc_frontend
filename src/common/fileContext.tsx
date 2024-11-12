import { createContext, useState, ReactNode } from "react";

interface FileContextType {
  file: any;
  setFile: (file: any) => void;
}

const FileContext = createContext<FileContextType | null>(null);

const FileProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<any>(null);

  return (
    <FileContext.Provider value={{ file, setFile }}>{children}</FileContext.Provider>
  );
};

export{ FileContext, FileProvider };