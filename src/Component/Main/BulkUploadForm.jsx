import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const BulkUploadForm = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet);

            try {
                const response = await axios.post('/participants/bulk-upload', { participants: rows }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setMessage('File uploaded successfully.');
                console.log('Bulk upload result:', response.data);
            } catch (error) {
                setMessage('Error uploading file.');
                console.error('Error in bulk upload:', error);
            }
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Bulk Upload Participants</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="fileInput" className="block text-gray-700 text-sm font-bold mb-2">Select Excel File:</label>
                    <input type="file" id="fileInput" accept=".xlsx, .xls" onChange={handleFileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Upload</button>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default BulkUploadForm;
