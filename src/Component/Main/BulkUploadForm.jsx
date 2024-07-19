import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";

const BulkUploadForm = () => {
  const [file, setFile] = useState(null);
  const [backgroundImageBase64, setBackgroundImageBase64] = useState("");
  const [message, setMessage] = useState("");
  const [params, setParams] = useState(new URLSearchParams());
  const [eventId, setEventId] = useState('');
  const [eventName, setEventName] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("eventid");
    const name = params.get("eventName");
    setParams(params);
    setEventId(id);
    setEventName(name);
  }, [location]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBackgroundImageChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBackgroundImageBase64(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error("No sheets found in the uploaded file.");
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        if (!sheet) {
          throw new Error(`Sheet '${sheetName}' not found in the workbook.`);
        }

        const rows = XLSX.utils.sheet_to_json(sheet);
        
        if (rows.length === 0) {
          throw new Error("No data found in the sheet.");
        }

        const combinedData = rows.map((row) => ({
          ...row,
          backgroundImage: backgroundImageBase64,
          eventId,
          eventName,
        }));

        const response = await axios.post(
          "https://kdemapi.insideoutprojects.in/api/participants/bulk-upload",
          { participants: combinedData },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setMessage("File uploaded successfully.");
        console.log("Bulk upload result:", response.data);
      } catch (error) {
        setMessage("Error uploading file.");
        console.error("Error in bulk upload:", error);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bulk Upload Participants</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="backgroundImage"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Background Image:
          </label>
          <input
            type="file"
            id="backgroundImage"
            name="backgroundImage"
            accept="image/*"
            onChange={handleBackgroundImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label
            htmlFor="fileInput"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Excel File:
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default BulkUploadForm;
