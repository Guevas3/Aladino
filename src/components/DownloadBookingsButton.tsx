"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

type Booking = {
    id: number;
    clientName: string;
    date: Date;
    timeSlot: string;
    status: string;
    totalAmount: string;
    depositAmount: string;
    observations?: string | null;
};

export function DownloadBookingsButton({ bookings }: { bookings: Booking[] }) {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Reporte de Reservas - Pelotero Manager", 14, 22);
        doc.setFontSize(11);
        doc.text(`Generado el: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);

        // Calculate totals (optional but nice)
        const totalRevenue = bookings
            .filter(b => b.status === "confirmed" || b.status === "completed")
            .reduce((sum, b) => sum + Number(b.totalAmount), 0);

        const totalDeposits = bookings
            .filter(b => b.status === "confirmed" || b.status === "completed")
            .reduce((sum, b) => sum + Number(b.depositAmount), 0);

        // Summary
        doc.text(`Total Reservas (Confirmadas/Completadas): ${bookings.filter(b => b.status !== 'cancelled').length}`, 14, 40);
        doc.text(`Total Ingresos Estimados: $${totalRevenue.toLocaleString()}`, 14, 46);
        doc.text(`Total Señas: $${totalDeposits.toLocaleString()}`, 14, 52);


        // Table Data
        const tableData = bookings.map((b) => [
            format(new Date(b.date), "dd/MM/yyyy"),
            b.clientName,
            b.timeSlot,
            `$${Number(b.depositAmount).toLocaleString()}`,
            `$${Number(b.totalAmount).toLocaleString()}`,
            b.status,
            b.observations || "-"
        ]);

        autoTable(doc, {
            head: [["Fecha", "Cliente", "Horario", "Seña", "Total", "Estado", "Obs"]],
            body: tableData,
            startY: 60,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [109, 40, 217], // Primary purple color
            },
        });

        doc.save("reporte-reservas.pdf");
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
