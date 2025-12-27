
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\santi_vhnrx0h\\OneDrive\\Documentos\\IT\\1 Proyectos\\16 App Campo (Enrique Marcon)\\Github_campo\\agromonitor-ai\\Planillas\\Lotes.xlsx';
const outputPath = 'c:\\Users\\santi_vhnrx0h\\OneDrive\\Documentos\\IT\\1 Proyectos\\16 App Campo (Enrique Marcon)\\Github_campo\\agromonitor-ai\\src\\data\\lotes_import.json';

// Ensure dir exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

function parseDMS(dmsStr) {
    if (!dmsStr) return null;
    const trimmed = dmsStr.trim();
    // Match 28°17'0.33"S
    const regex = /(\d+)°(\d+)'([\d.]+)"([NSEOW])/i;
    const match = trimmed.match(regex);
    if (!match) return null;

    const deg = parseFloat(match[1]);
    const min = parseFloat(match[2]);
    const sec = parseFloat(match[3]);
    const dir = match[4].toUpperCase();

    let dd = deg + min / 60 + sec / 3600;

    if (dir === 'S' || dir === 'O' || dir === 'W') {
        dd = dd * -1;
    }
    return dd;
}

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const processedData = rawData.map(row => {
        return {
            companyName: row.NombreEmpresa ? String(row.NombreEmpresa).trim() : 'Sin Empresa',
            fieldName: row.NombreCampo ? String(row.NombreCampo).trim() : 'Sin Campo',
            plotName: row.NombreLote ? String(row.NombreLote).trim() : 'Sin Nombre',
            hectares: row.has ? parseFloat(row.has) : 0,
            lat: parseDMS(row.Latitud),
            lng: parseDMS(row.Longitud)
        };
    });

    // Group by Company -> Field
    const hierarchy = {};

    processedData.forEach(item => {
        if (!hierarchy[item.companyName]) {
            hierarchy[item.companyName] = {};
        }
        if (!hierarchy[item.companyName][item.fieldName]) {
            hierarchy[item.companyName][item.fieldName] = [];
        }
        hierarchy[item.companyName][item.fieldName].push({
            name: item.plotName,
            hectares: item.hectares,
            lat: item.lat,
            lng: item.lng
        });
    });

    console.log(`Processed ${processedData.length} rows.`);
    fs.writeFileSync(outputPath, JSON.stringify(hierarchy, null, 2));
    console.log(`Saved to ${outputPath}`);

} catch (error) {
    console.error('Error converting excel:', error);
}
