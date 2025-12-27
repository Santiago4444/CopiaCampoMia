
const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'c:\\Users\\santi_vhnrx0h\\OneDrive\\Documentos\\IT\\1 Proyectos\\16 App Campo (Enrique Marcon)\\Github_campo\\agromonitor-ai\\Planillas\\Lotes.xlsx';

try {
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(JSON.stringify(data, null, 2));
} catch (error) {
    console.error('Error reading excel:', error);
}
