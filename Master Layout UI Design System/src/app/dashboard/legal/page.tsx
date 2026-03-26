
"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Files, 
  Gavel, 
  Search,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Archive,
  FileSignature,
  Printer,
  LayoutGrid,
  MoreHorizontal,
  AlertCircle,
  Code2,
  RefreshCw,
  FileText,
  FileDown,
  FileUp,
  Layers
} from "lucide-react"
import { cn } from "@/lib/utils"
import * as XLSX from 'xlsx'
import { toast } from "sonner"
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'

// Set worker for PDF.js extraction
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DEFAULT_AKAD_TEMPLATE = `
<div style="font-family: 'Times New Roman', serif; padding: 40px; color: #000; background: white; line-height: 1.6;">
  <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px;">
    <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; font-weight: 900;">DEVPro FLOW ENTERPRISE</h1>
    <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">Sistem Manajemen Properti & KPR Terintegrasi 2026</p>
    <p style="margin: 0; font-size: 10px;">Pusat Niaga Sudirman, Lantai 12, Jakarta Pusat | Contact: (021) 555-FLOW</p>
  </div>
  
  <div style="text-align: right; font-size: 12px; margin-bottom: 20px;">
    Jakarta, {{current_date}}
  </div>

  <h2 style="text-align: center; text-decoration: underline; font-size: 18px; margin-bottom: 5px; font-weight: 900;">MEMORANDUM INSTRUKSI AKAD</h2>
  <p style="text-align: center; margin-top: 0; font-size: 11px; font-weight: bold;">Nomor Dokumen: {{doc_id}}/MEMO-LEGAL/2026</p>
  
  <div style="margin-top: 30px; font-size: 12px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="width: 120px; font-weight: bold;">KEPADA</td><td>: Divisi Finance & Disbursement</td></tr>
      <tr><td style="font-weight: bold;">DARI</td><td>: Divisi Legal & Compliance (PIC: Legal & KPR)</td></tr>
      <tr><td style="font-weight: bold;">PERIHAL</td><td>: Persetujuan Akad Kredit & Perintah Pencairan</td></tr>
    </table>
  </div>
  
  <div style="border-top: 1px solid #000; margin: 15px 0;"></div>
  
  <div style="font-size: 12px; text-align: justify;">
    <p>Berdasarkan hasil audit kelengkapan berkas dan status kelulusan sistem (SP3K), dengan ini Divisi Legal memberikan validasi final untuk pelaksanaan <b>Akad Kredit</b> atas unit properti di bawah ini:</p>
    
    <table style="width: 100%; margin: 20px 0; border: 1px solid #000; border-collapse: collapse;">
      <tr style="background: #f3f4f6;">
        <td style="padding: 10px; border: 1px solid #000; font-weight: bold; width: 180px;">NAMA NASABAH</td>
        <td style="padding: 10px; border: 1px solid #000;">{{name}}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">NIK / NO. IDENTITAS</td>
        <td style="padding: 10px; border: 1px solid #000;">{{nik}}</td>
      </tr>
      <tr style="background: #f3f4f6;">
        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">UNIT PROPERTI</td>
        <td style="padding: 10px; border: 1px solid #000;">{{unit}}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">PLAFON KPR</td>
        <td style="padding: 10px; border: 1px solid #000; font-weight: bold; color: #059669; font-size: 14px;">{{plafon}}</td>
      </tr>
      <tr style="background: #f3f4f6;">
        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">BANK PENYEDIA</td>
        <td style="padding: 10px; border: 1px solid #000;">{{bank}}</td>
      </tr>
    </table>
    
    <p style="font-weight: bold; font-style: italic; color: #4b5563;">Instruksi Kerja: Mohon Divisi Finance menyiapkan berkas pencairan sesuai jadwal yang telah dikoordinasikan dengan pihak Perbankan dan Notaris.</p>
  </div>
  
  <div style="margin-top: 60px; float: right; width: 220px; text-align: center; font-size: 12px;">
    <p>Disahkan Oleh,</p>
    <br/><br/><br/><br/>
    <p style="margin-bottom: 0;"><b>LEGAL & KPR</b></p>
    <p style="margin-top: 0; font-size: 10px; border-top: 1px solid #000; display: inline-block; padding-top: 3px;">Admin Legal & Compliance</p>
  </div>
  <div style="clear: both;"></div>
  
  <div style="margin-top: 80px; font-size: 9px; color: #6b7280; border-top: 1px dotted #9ca3af; padding-top: 10px; font-style: italic;">
    Dokumen ini adalah salinan resmi PDF yang dihasilkan secara otomatis oleh sistem DEVPro FLOW pada {{generated_at}}
  </div>
</div>
`;

const workflowStages = [
  { id: 1, name: "Pemberkasan", icon: Files, status: "Completed" },
  { id: 2, name: "BI Checking", icon: ShieldCheck, status: "Completed" },
  { id: 3, name: "Analisa Kredit", icon: Clock, status: "Active" },
  { id: 4, name: "Appraisal", icon: AlertCircle, status: "Pending" },
  { id: 5, name: "Akad Kredit", icon: Gavel, status: "Pending" },
];

export default function LegalPage() {
  const [searchTerm, setSearch] = useState("");
  const [activeWorkflowId, setActiveWorkflowId] = useState(3);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [activeTemplate, setActiveTemplate] = useState(DEFAULT_AKAD_TEMPLATE);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const consumers = [
    { id: "KPR-26-001", name: "Ahmad Fauzi", nik: "3201****5678", unit: "Emerald Residence A-12", bank: "Bank Mandiri", plafon: "Rp 1.2M", status: "Review" },
    { id: "KPR-26-002", name: "Siska Putri", nik: "3201****9012", unit: "Skyview Apartment B-05", bank: "Bank BCA", plafon: "Rp 850jt", status: "Verified" },
    { id: "KPR-26-003", name: "Budi Santoso", nik: "3201****3456", unit: "Pine Wood Mansion C-01", bank: "Bank BRI", plafon: "Rp 3.5M", status: "Active" },
  ];

  const [selectedConsumer, setSelectedConsumer] = useState(consumers[1]);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString('id-ID'));
  }, []);

  const processTemplate = (template: string, data: any) => {
    return template
      .replace(/{{name}}/g, data.name)
      .replace(/{{nik}}/g, data.nik)
      .replace(/{{unit}}/g, data.unit)
      .replace(/{{plafon}}/g, data.plafon)
      .replace(/{{bank}}/g, data.bank)
      .replace(/{{doc_id}}/g, data.id)
      .replace(/{{current_date}}/g, new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }))
      .replace(/{{generated_at}}/g, new Date().toLocaleString('id-ID'));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    if (file.name.endsWith('.docx')) {
      reader.onload = async (loadEvent) => {
        try {
          const arrayBuffer = loadEvent.target?.result as ArrayBuffer;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const wrappedHtml = `
            <div style="font-family: 'Times New Roman', serif; padding: 40px; background: white; color: #000;">
              ${result.value}
              <div style="margin-top: 40px; border-top: 1px dotted #ccc; padding-top: 10px; font-size: 10px; color: #666;">
                Imported Master: ${file.name} | Verified by Legal & KPR Hub
              </div>
            </div>
          `;
          setActiveTemplate(wrappedHtml);
          setActiveFileName(file.name);
          toast.success(`Berhasil mengimpor Word: ${file.name}.`);
        } catch (error) {
          console.error(error);
          toast.error("Gagal mengonversi file Word.");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.pdf')) {
      reader.onload = async (loadEvent) => {
        try {
          const typedarray = new Uint8Array(loadEvent.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = "";
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item: any) => item.str).join(" ");
            fullText += `<p>${pageText}</p>`;
          }

          const wrappedHtml = `
            <div style="font-family: 'Times New Roman', serif; padding: 40px; background: white; color: #000;">
              <h2 style="text-align: center; text-transform: uppercase;">Imported PDF Master</h2>
              <div style="text-align: justify; line-height: 1.8;">
                ${fullText}
              </div>
              <div style="margin-top: 40px; border-top: 1px dotted #ccc; padding-top: 10px; font-size: 10px; color: #666;">
                Ekstraksi PDF: ${file.name} | Verified by Legal & KPR Hub
              </div>
            </div>
          `;
          
          setActiveTemplate(wrappedHtml);
          setActiveFileName(file.name);
          toast.success(`Berhasil mengekstrak teks dari PDF: ${file.name}.`);
        } catch (error) {
          console.error(error);
          toast.error("Gagal membaca file PDF.");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Format file tidak didukung. Gunakan .docx atau .pdf.");
      setIsProcessing(false);
    }
  };

  const downloadSP3KList = () => {
    const approved = consumers.filter(c => c.status === "Verified" || c.status === "Active");
    const ws = XLSX.utils.json_to_sheet(approved);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SP3K_Approved");
    XLSX.writeFile(wb, "Daftar_Lulus_SP3K_2026.xlsx");
  };

  const printPDF = (consumer: any) => {
    const htmlContent = processTemplate(activeTemplate, consumer);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Memo Akad PDF - ${consumer.name}</title>
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; padding: 0; background: #f3f4f6; display: flex; justify-content: center; }
              @media print {
                body { background: white; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div style="width: 210mm;">${htmlContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const runBatchProcess = () => {
    toast.info("Memulai Proses Batch untuk seluruh nasabah aktif...");
    consumers.forEach((c, index) => {
      setTimeout(() => {
        toast.success(`Berhasil memproses PDF: ${c.name}`);
      }, (index + 1) * 1500);
    });
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
            <Gavel className="size-8 text-primary" /> Legal Hub
          </h2>
          <p className="text-muted-foreground text-sm font-medium mt-1 uppercase tracking-tighter italic">Administrasi Hukum & Generator Dokumen PDF Terpusat.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={runBatchProcess}
            className="h-11 px-6 rounded-xl bg-primary/10 text-primary font-black text-[11px] uppercase flex items-center gap-2 hover:bg-primary hover:text-white transition-all border border-primary/20"
          >
            <Layers className="size-4" /> Jalankan Batch (.bat)
          </button>
          <button 
            onClick={downloadSP3KList}
            className="h-11 px-6 rounded-xl bg-emerald-600 text-white font-black text-[11px] uppercase flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Archive className="size-4" /> Download SP3K List
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* WORKFLOW TRACKER */}
          <Card className="border-0 shadow-lg ring-1 ring-border/40">
            <CardHeader className="bg-secondary/5 border-b py-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="size-4 text-primary" />
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-primary">Status Alur Kerja KPR</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 flex justify-between gap-4 overflow-x-auto">
              {workflowStages.map((stage) => {
                const isActive = activeWorkflowId === stage.id;
                const isCompleted = stage.status === "Completed";
                return (
                  <button key={stage.id} onClick={() => setActiveWorkflowId(stage.id)} className="flex flex-col items-center flex-1 min-w-[80px] group transition-all text-center">
                    <div className={cn(
                      "size-14 rounded-2xl flex items-center justify-center mb-3 transition-all ring-4 ring-white shadow-sm group-hover:scale-105",
                      isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-primary text-white scale-110 shadow-lg" : "bg-secondary text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle2 className="size-7" /> : <stage.icon className="size-7" />}
                    </div>
                    <span className={cn("text-[9px] font-black uppercase tracking-tighter", isActive ? "text-primary" : "text-muted-foreground")}>{stage.name}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* CUSTOMER TABLE */}
          <Card className="border-0 shadow-lg ring-1 ring-border/40 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b bg-secondary/5">
              <div className="flex items-center gap-2">
                <Files className="size-4 text-primary" />
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-primary">Database Nasabah Aktif</CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                <input 
                  type="text" 
                  placeholder="Cari nama nasabah..." 
                  className="h-9 w-48 rounded-xl bg-white border border-border/60 pl-9 pr-4 text-[11px] outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-secondary/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">Nasabah & Properti</th>
                    <th className="px-6 py-4 text-left">Status KPR Hub</th>
                    <th className="px-6 py-4 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {consumers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => setSelectedConsumer(c)} 
                      className={cn("cursor-pointer transition-all duration-300", selectedConsumer.id === c.id ? "bg-primary/[0.06] border-l-4 border-primary" : "hover:bg-secondary/30")}
                    >
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-black text-foreground uppercase leading-none">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{c.unit}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn("border-0 px-3 py-1 text-[9px] font-black uppercase", c.status === "Verified" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                          {c.status === "Verified" ? "APPROVED / SP3K" : c.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right"><MoreHorizontal className="size-4 text-muted-foreground ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* TEMPLATE CONFIGURATION HUB */}
          <Card className="border-0 shadow-lg ring-1 ring-border/40 overflow-hidden bg-slate-50/50">
            <CardHeader className="bg-slate-900 text-white py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Code2 className="size-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-white text-[11px] font-black uppercase tracking-widest">Template Master Hub</CardTitle>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                    {isProcessing ? "Mengekstrak data..." : activeFileName ? `Aktif: ${activeFileName}` : 'Impor PDF atau DOCX sebagai dasar'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".docx,.pdf"
                  onChange={handleFileUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="h-8 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white font-black text-[10px] uppercase flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="size-3.5 animate-spin" /> : <FileUp className="size-3.5" />} 
                  {isProcessing ? "Processing..." : "Import Master (PDF/DOCX)"}
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Autofill Data Tags:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { label: "Nama Nasabah", tag: "{{name}}" },
                      { label: "Nomor NIK", tag: "{{nik}}" },
                      { label: "Unit Properti", tag: "{{unit}}" },
                      { label: "ID Dokumen", tag: "{{doc_id}}" },
                    ].map(tag => (
                      <div key={tag.tag} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase leading-none">{tag.label}</span>
                        <code className="text-[10px] font-black text-primary mt-1">{tag.tag}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* PDF GENERATOR SIDEBAR */}
          <Card className="border-0 shadow-2xl ring-2 ring-primary/20 bg-primary/5 sticky top-8">
            <CardHeader className="bg-primary/10 border-b py-4">
              <div className="flex items-center gap-2">
                <FileSignature className="size-5 text-primary" />
                <CardTitle className="text-primary uppercase text-[11px] font-black">Final PDF Generator</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 p-5 rounded-2xl bg-white border border-primary/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FileText className="size-12" />
                </div>
                <p className="text-[9px] font-black text-muted-foreground uppercase mb-2">Nasabah Terpilih:</p>
                <h4 className="text-sm font-black text-foreground uppercase">{selectedConsumer.name}</h4>
                <p className="text-[10px] text-primary font-bold mt-1 uppercase leading-tight">Unit: {selectedConsumer.unit}</p>
                <div className="mt-4 pt-4 border-t border-dashed border-border flex justify-between items-center">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{selectedConsumer.bank}</span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{selectedConsumer.id}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => printPDF(selectedConsumer)} 
                  className="w-full h-16 rounded-xl bg-primary text-white font-black text-[12px] uppercase flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95"
                >
                  <Printer className="size-6" /> Generate & Print PDF
                </button>
                
                <p className="text-[9px] text-center text-muted-foreground font-medium uppercase italic mt-4 leading-relaxed px-4">
                  Sistem akan mengisi data otomatis berdasarkan template master. Format dioptimalkan untuk ukuran kertas A4.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* COMPLIANCE STATUS */}
          <Card className="border-0 shadow-lg bg-slate-900 text-white p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Compliance Status</h5>
                <ShieldCheck className="size-4 text-emerald-400" />
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-black tabular-nums">92.4%</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px] mb-1">+2.1%</Badge>
              </div>
              <Progress value={92} className="h-1.5 bg-slate-800" />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter italic">PIC: Legal & KPR Hub</p>
                <p className="text-[9px] font-bold text-primary tabular-nums">{currentTime}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
