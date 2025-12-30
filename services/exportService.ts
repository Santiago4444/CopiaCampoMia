import * as XLSX from 'xlsx';

/**
 * Robust utility to download a Blob as a file in the browser.
 * Handles creating the anchor, appending to body (crucial for Firefox/PWA),
 * clicking, and delayed cleanup.
 */
export const downloadBlob = (blob: Blob, filename: string) => {
    // 1. Create Object URL
    const url = URL.createObjectURL(blob);

    // 2. Create Anchor
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';

    // 3. Append to Body (Critical for some browsers/PWAs)
    document.body.appendChild(a);

    // 4. Trigger Download
    a.click();

    // 5. Delayed Cleanup
    // We wait 1000ms to ensure the download process has started handoff to the OS
    // before revoking the URL and removing the element.
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 1000);
};

export const downloadExcel = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    // 1. Convert JSON to Worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Create Workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Exportados");

    // 3. Write file to buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // 4. Create Blob
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

    // 5. Use Robust Download
    downloadBlob(blob, `${filename}.xlsx`);
};
