import React, { useState } from 'react';
import axios from 'axios';

function Reports() {
    const [reportType, setReportType] = useState('');
    const [reportData, setReportData] = useState(null);

    const generateReport = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/reports/${reportType}/`);
            setReportData(response.data);
        } catch (error) {
            console.error('Error generating report', error);
        }
    };

    return (
        <div>
            <h2>Reportes</h2>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="">Seleccione un tipo de reporte</option>
                <option value="daily">Reporte Diario</option>
                <option value="weekly">Reporte Semanal</option>
                <option value="monthly">Reporte Mensual</option>
            </select>
            <button onClick={generateReport}>Generar Reporte</button>

            {reportData && (
                <div>
                    <h3>Resultado del Reporte</h3>
                    <pre>{JSON.stringify(reportData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Reports;