"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

type Movement = {
    id: number;
    description: string;
    amount: string;
    category: string;
    type: "income" | "expense";
    date: Date | null;
};

export function DownloadFinanceButton({ movements }: { movements: Movement[] }) {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Reporte Financiero - Pelotero Manager", 14, 22);
        doc.setFontSize(11);
        doc.text(`Generado el: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);

        // Calculate totals
        const totalIncome = movements
            .filter((m) => m.type === "income")
            .reduce((sum, m) => sum + Number(m.amount), 0);

        const totalExpense = movements
            .filter((m) => m.type === "expense")
            .reduce((sum, m) => sum + Number(m.amount), 0);

        const balance = totalIncome - totalExpense;

        // Summary
        doc.text(`Total Ingresos: $${totalIncome.toLocaleString()}`, 14, 40);
        doc.text(`Total Gastos: $${totalExpense.toLocaleString()}`, 14, 46);
        doc.text(`Balance: $${balance.toLocaleString()}`, 14, 52);


        // Table Data
        const tableData = movements.map((m) => [
            m.date ? format(new Date(m.date), "dd/MM/yyyy") : "-",
            m.type === "income" ? "Ingreso" : "Egreso",
            m.description,
            m.category,
            `$${Number(m.amount).toLocaleString()}`,
        ]);

        autoTable(doc, {
            head: [["Fecha", "Tipo", "Descripción", "Categoría", "Monto"]],
            body: tableData,
            startY: 60,
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [109, 40, 217], // Primary purple color
            },
            columnStyles: {
                4: { halign: 'right' } // Align amount to right
            }
        });

        doc.save("reporte-financiero.pdf");
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={generatePDF}
            className="flex items-center gap-2"
        >
            <Download size={16} />
            Descargar PDF
        </Button>
    );
}
