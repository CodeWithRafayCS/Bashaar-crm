"use client";

import { useState, useRef, useCallback } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { useAppStore } from "@/lib/store";
import { importLeads } from "@/lib/api";
import type { Lead } from "@/lib/types";
import { 
  Upload, 
  FileSpreadsheet, 
  X, 
  Check, 
  AlertCircle, 
  Download,
  FileText,
  Loader2,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (count: number) => void;
  templateUrl?: string;
}

interface ImportPreviewRow {
  row: number;
  data: Record<string, any>;
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

export function ImportModal({
  open,
  onClose,
  onSuccess,
  templateUrl,
}: ImportModalProps) {
  const { pushToast } = useAppStore();
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "complete">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportPreviewRow[]>([]);
  const [validRows, setValidRows] = useState<ImportPreviewRow[]>([]);
  const [invalidRows, setInvalidRows] = useState<ImportPreviewRow[]>([]);
  const [importCount, setImportCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv')) {
      pushToast("error", "Please upload a CSV or Excel file");
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  }, [pushToast]);

  const parseFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        pushToast("error", "File is empty or invalid");
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Parse rows
      const rows: ImportPreviewRow[] = [];
      const requiredFields = ['name', 'company', 'email', 'phone'];

      for (let i = 1; i < Math.min(lines.length, 101); i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const rowData: Record<string, any> = {};
        const errors: string[] = [];
        const warnings: string[] = [];

        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });

        // Validate required fields
        requiredFields.forEach(field => {
          if (!rowData[field] || rowData[field].trim() === '') {
            errors.push(`Missing ${field}`);
          }
        });

        // Validate email format
        if (rowData.email && rowData.email.trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(rowData.email)) {
            errors.push('Invalid email format');
          }
        }

        // Validate phone (basic)
        if (rowData.phone && rowData.phone.trim() !== '') {
          const phoneDigits = rowData.phone.replace(/\D/g, '');
          if (phoneDigits.length < 10) {
            warnings.push('Phone number seems short');
          }
        }

        rows.push({
          row: i + 1,
          data: rowData,
          isValid: errors.length === 0,
          errors: errors.length > 0 ? errors : undefined,
          warnings: warnings.length > 0 ? warnings : undefined,
        });
      }

      setPreviewData(rows);
      const valid = rows.filter(r => r.isValid);
      const invalid = rows.filter(r => !r.isValid);
      setValidRows(valid);
      setInvalidRows(invalid);
      setStep("preview");
      pushToast("success", `File parsed: ${rows.length} rows found`);
    } catch (error) {
      pushToast("error", "Failed to parse file");
    }
  }, [pushToast]);

  const handleImport = useCallback(async () => {
    if (validRows.length === 0) {
      pushToast("error", "No valid rows to import");
      return;
    }

    setStep("importing");
    
    try {
      const leads = validRows.map(row => row.data as Omit<Lead, "id" | "createdAt" | "updatedAt">);
      const result = await importLeads(leads);
      
      setImportCount(result.imported);
      setErrorCount(result.errors || 0);
      setStep("complete");
      pushToast("success", `Successfully imported ${result.imported} leads`);
      onSuccess?.(result.imported);
    } catch (error) {
      pushToast("error", "Failed to import leads");
      setStep("preview");
    }
  }, [validRows, pushToast, onSuccess]);

  const handleDownloadTemplate = useCallback(() => {
    if (templateUrl) {
      window.open(templateUrl, '_blank');
    } else {
      // Generate default template
      const headers = ['name', 'company', 'title', 'phone', 'email', 'source', 'status', 'stage', 'owner', 'value', 'address', 'city', 'zip', 'country', 'notes'];
      const csv = [
        headers.join(','),
        'John Doe,Acme Corp,CEO,+1-555-123-4567,john@acme.com,Website,new,New,sarah@bashar.ai,50000,123 Main St,New York,10001,USA,Example lead'
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lead-import-template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    pushToast("success", "Template downloaded");
  }, [templateUrl, pushToast]);

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setPreviewData([]);
    setValidRows([]);
    setInvalidRows([]);
    setImportCount(0);
    setErrorCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (step === "importing") return;
    handleReset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Import Leads"
      onClose={handleClose}
      size="lg"
      loading={step === "importing"}
    >
      <div className="import-modal">
        {/* Step: Upload */}
        {step === "upload" && (
          <div className="upload-section">
            <div 
              className="drop-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  const event = { target: { files: [droppedFile] } } as any;
                  handleFileSelect(event);
                }
              }}
            >
              <Upload className="drop-icon" />
              <h4 className="drop-title">Upload your file</h4>
              <p className="drop-description">
                Drag & drop your CSV or Excel file here, or click to browse
              </p>
              <div className="drop-formats">
                <span className="format-badge">CSV</span>
                <span className="format-badge">XLSX</span>
                <span className="format-badge">XLS</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>

            <div className="upload-footer">
              <Button type="button" variant="ghost" onClick={handleDownloadTemplate}>
                <Download className="w-4 h-4" />
                Download Template
              </Button>
              <span className="upload-hint">
                <FileText className="w-3.5 h-3.5" />
                Supported: CSV, XLSX, XLS
              </span>
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="preview-section">
            <div className="preview-header">
              <div className="preview-stats">
                <span className="stat-item total">
                  <FileSpreadsheet className="stat-icon" />
                  {previewData.length} rows
                </span>
                <span className="stat-item valid">
                  <Check className="stat-icon" />
                  {validRows.length} valid
                </span>
                <span className="stat-item invalid">
                  <AlertCircle className="stat-icon" />
                  {invalidRows.length} invalid
                </span>
              </div>
              <div className="preview-actions">
                <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                  <X className="w-4 h-4" />
                  Change File
                </Button>
                <Button 
                  type="button" 
                  variant="gold" 
                  onClick={handleImport}
                  disabled={validRows.length === 0}
                >
                  Import {validRows.length} Leads
                </Button>
              </div>
            </div>

            {invalidRows.length > 0 && (
              <div className="invalid-rows">
                <button 
                  className="invalid-toggle"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{invalidRows.length} rows have errors</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isExpanded && (
                  <div className="invalid-list">
                    {invalidRows.map((row) => (
                      <div key={row.row} className="invalid-row">
                        <span className="row-number">Row {row.row}</span>
                        <span className="row-errors">
                          {row.errors?.join(', ')}
                        </span>
                        {row.warnings && row.warnings.length > 0 && (
                          <span className="row-warnings">
                            ⚠️ {row.warnings.join(', ')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="preview-table-wrapper">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th className="row-col">#</th>
                    {Object.keys(previewData[0]?.data || {}).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                    <th className="status-col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((row) => (
                    <tr key={row.row} className={row.isValid ? "valid" : "invalid"}>
                      <td className="row-col">{row.row}</td>
                      {Object.keys(row.data).map((key) => (
                        <td key={key}>{row.data[key] || '—'}</td>
                      ))}
                      <td className="status-col">
                        {row.isValid ? (
                          <Check className="status-icon valid" />
                        ) : (
                          <AlertCircle className="status-icon invalid" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <div className="preview-more">
                  +{previewData.length - 10} more rows
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === "complete" && (
          <div className="complete-section">
            <div className="complete-icon">
              <Check className="w-12 h-12" />
            </div>
            <h4 className="complete-title">Import Complete!</h4>
            <p className="complete-description">
              Successfully imported {importCount} leads
              {errorCount > 0 && ` with ${errorCount} errors`}
            </p>
            <div className="complete-actions">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Close
              </Button>
              <Button type="button" variant="gold" onClick={handleReset}>
                Import More
              </Button>
            </div>
          </div>
        )}

        <style jsx>{`
          .import-modal {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          /* Upload Section */
          .upload-section {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .drop-zone {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 2rem;
            border: 2px dashed rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.02);
            cursor: pointer;
            transition: all 0.3s;
            min-height: 200px;
          }

          .drop-zone:hover {
            border-color: rgba(244, 197, 66, 0.2);
            background: rgba(255, 255, 255, 0.03);
          }

          .drop-icon {
            width: 48px;
            height: 48px;
            color: rgba(255, 255, 255, 0.05);
            margin-bottom: 0.5rem;
          }

          .drop-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.4);
            margin: 0;
          }

          .drop-description {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.15);
            margin: 0.2rem 0 0.5rem;
          }

          .drop-formats {
            display: flex;
            gap: 0.3rem;
          }

          .format-badge {
            padding: 0.1rem 0.5rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 4px;
            font-size: 0.6rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.15);
            text-transform: uppercase;
          }

          .file-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
          }

          .upload-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .upload-hint {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.1);
          }

          /* Preview Section */
          .preview-section {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .preview-stats {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.3);
          }

          .stat-item.total {
            color: rgba(255, 255, 255, 0.4);
          }

          .stat-item.valid {
            color: #00c853;
          }

          .stat-item.invalid {
            color: #ff4444;
          }

          .stat-icon {
            width: 16px;
            height: 16px;
          }

          .preview-actions {
            display: flex;
            gap: 0.5rem;
          }

          /* Invalid Rows */
          .invalid-rows {
            background: rgba(255, 68, 68, 0.04);
            border: 1px solid rgba(255, 68, 68, 0.06);
            border-radius: 8px;
            overflow: hidden;
          }

          .invalid-toggle {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: none;
            background: transparent;
            color: rgba(255, 68, 68, 0.5);
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s;
            font-family: inherit;
          }

          .invalid-toggle:hover {
            background: rgba(255, 68, 68, 0.04);
          }

          .invalid-list {
            padding: 0.25rem 0.75rem 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .invalid-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.2rem 0.4rem;
            font-size: 0.7rem;
            flex-wrap: wrap;
          }

          .row-number {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.2);
            min-width: 50px;
          }

          .row-errors {
            color: rgba(255, 68, 68, 0.5);
          }

          .row-warnings {
            color: rgba(255, 193, 7, 0.5);
          }

          /* Preview Table */
          .preview-table-wrapper {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 8px;
            overflow: hidden;
            max-height: 300px;
            overflow-y: auto;
          }

          .preview-table-wrapper::-webkit-scrollbar {
            width: 4px;
          }

          .preview-table-wrapper::-webkit-scrollbar-track {
            background: transparent;
          }

          .preview-table-wrapper::-webkit-scrollbar-thumb {
            background: rgba(244, 197, 66, 0.15);
            border-radius: 2px;
          }

          .preview-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.75rem;
          }

          .preview-table thead {
            background: rgba(255, 255, 255, 0.02);
            position: sticky;
            top: 0;
            z-index: 1;
          }

          .preview-table th {
            padding: 0.4rem 0.6rem;
            text-align: left;
            font-weight: 500;
            font-size: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: rgba(255, 255, 255, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            white-space: nowrap;
          }

          .preview-table td {
            padding: 0.3rem 0.6rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.02);
            color: rgba(255, 255, 255, 0.4);
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .preview-table tr.valid td {
            color: rgba(255, 255, 255, 0.5);
          }

          .preview-table tr.invalid td {
            color: rgba(255, 68, 68, 0.3);
          }

          .row-col {
            color: rgba(255, 255, 255, 0.1) !important;
            text-align: center;
            width: 40px;
          }

          .status-col {
            text-align: center;
            width: 40px;
          }

          .status-icon {
            width: 16px;
            height: 16px;
          }

          .status-icon.valid {
            color: #00c853;
          }

          .status-icon.invalid {
            color: #ff4444;
          }

          .preview-more {
            text-align: center;
            padding: 0.3rem;
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.1);
            border-top: 1px solid rgba(255, 255, 255, 0.02);
          }

          /* Complete Section */
          .complete-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
            gap: 0.5rem;
          }

          .complete-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(0, 200, 83, 0.06);
            border: 1px solid rgba(0, 200, 83, 0.08);
            color: #00c853;
          }

          .complete-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
          }

          .complete-description {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.3);
            margin: 0;
          }

          .complete-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .drop-zone {
              padding: 2rem 1rem;
              min-height: 150px;
            }

            .drop-icon {
              width: 36px;
              height: 36px;
            }

            .drop-title {
              font-size: 1rem;
            }

            .preview-header {
              flex-direction: column;
              align-items: stretch;
            }

            .preview-actions {
              flex-direction: column;
            }

            .preview-actions :global(.btn-ghost),
            .preview-actions :global(.btn-gold) {
              width: 100%;
              justify-content: center;
            }

            .preview-table {
              font-size: 0.65rem;
            }

            .preview-table th,
            .preview-table td {
              padding: 0.2rem 0.4rem;
            }

            .complete-actions {
              flex-direction: column;
              width: 100%;
            }

            .complete-actions :global(.btn-ghost),
            .complete-actions :global(.btn-gold) {
              width: 100%;
              justify-content: center;
            }
          }

          @media (max-width: 480px) {
            .preview-stats {
              gap: 0.3rem;
            }

            .stat-item {
              font-size: 0.7rem;
            }

            .stat-icon {
              width: 14px;
              height: 14px;
            }

            .preview-table {
              font-size: 0.6rem;
            }

            .preview-table th,
            .preview-table td {
              padding: 0.15rem 0.3rem;
            }

            .complete-icon {
              width: 56px;
              height: 56px;
            }

            .complete-icon svg {
              width: 28px;
              height: 28px;
            }

            .complete-title {
              font-size: 1rem;
            }
          }
        `}</style>
      </div>
    </Modal>
  );
}