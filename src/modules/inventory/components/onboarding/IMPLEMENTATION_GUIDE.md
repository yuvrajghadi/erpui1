# Excel-Based Onboarding Implementation Guide
## Textile & Garment ERP - Master Data Management Pattern

---

## ✅ COMPLETED IMPLEMENTATIONS

### 1. Core Components Created

#### `ExcelUploadButtonGroup.tsx`
- Consistent button pattern: [Upload Excel] [Download Sample Excel]
- File validation (.xlsx, .xls only)
- Selected file display
- Context-aware help text
- Opening data warnings

#### `ExcelPreviewModal.tsx`
- Preview table with validation
- Row count display
- Error highlighting
- Confirmation flow
- Cancel/Confirm buttons

#### `sampleExcelGenerator.ts`
- Generates textile-specific sample Excel files
- Pre-filled with realistic data
- Correct column headers
- 2-3 sample rows per master

### 2. Master Screens Updated

#### ✅ Fabric Master (`FabricMaster.tsx`)
- Excel upload integrated
- Sample download working
- Preview & confirm flow
- Validation support

---

## 📋 IMPLEMENTATION PATTERN

### Step 1: Add Imports

```typescript
import ExcelUploadButtonGroup from '../components/ExcelUploadButtonGroup';
import ExcelPreviewModal from '../components/ExcelPreviewModal';
import { generateSampleExcel } from '../utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';
import { Divider } from 'antd';
```

### Step 2: Add State

```typescript
// Excel upload state
const [previewData, setPreviewData] = useState<any[]>([]);
const [previewModalOpen, setPreviewModalOpen] = useState(false);
const [importLoading, setImportLoading] = useState(false);
```

### Step 3: Add Handlers

```typescript
// Excel upload handlers
const handleFileSelect = async (file: File) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Map Excel columns to your data structure
    const mappedData = jsonData.map((row: any, index: number) => ({
      key: index,
      // Map your specific columns here
      // Example: fieldName: row['Excel Column Name'] || '',
    }));
    
    setPreviewData(mappedData);
    setPreviewModalOpen(true);
  } catch (error) {
    message.error('Failed to read Excel file');
    console.error(error);
  }
};

const handleDownloadSample = () => {
  generateSampleExcel('your-master-id'); // e.g., 'trim', 'warehouse'
  message.success('Sample Excel downloaded successfully');
};

const handleConfirmImport = async () => {
  setImportLoading(true);
  try {
    // Your API call or data update logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDataSource([...dataSource, ...previewData]);
    message.success(`${previewData.length} records imported successfully`);
    setPreviewModalOpen(false);
    setPreviewData([]);
  } catch (error) {
    message.error('Failed to import data');
  } finally {
    setImportLoading(false);
  }
};
```

### Step 4: Add UI Components

```tsx
return (
  <div style={{ padding: 0 }}>
    {/* Excel Upload Section */}
    <ExcelUploadButtonGroup
      masterName="Your Master Name"
      onFileSelect={handleFileSelect}
      onDownloadSample={handleDownloadSample}
      isOpeningData={false} // Set to true for opening stock
    />

    <Divider style={{ margin: '24px 0' }} />

    {/* Your existing toolbar and table */}
    {/* ... */}

    {/* Excel Preview Modal */}
    <ExcelPreviewModal
      open={previewModalOpen}
      onClose={() => {
        setPreviewModalOpen(false);
        setPreviewData([]);
      }}
      onConfirm={handleConfirmImport}
      data={previewData}
      columns={columns} // Your table columns
      masterName="Your Master Name"
      isOpeningData={false} // Set to true for opening stock
      loading={importLoading}
    />
  </div>
);
```

---

## 🎯 MASTERS TO UPDATE

### High Priority
- [x] Fabric Master ✅
- [ ] Trim & Accessories Master
- [ ] Warehouse / Zone Master
- [ ] Supplier Master
- [ ] UOM Master
- [ ] Shade Master
- [ ] Process / Operation Master
- [ ] Material Category Master

### Opening Data Screens
- [ ] Opening Stock Import (set `isOpeningData={true}`)
- [ ] Opening WIP Import (optional)
- [ ] Opening Job Work Import (optional)

---

## 📊 SAMPLE DATA CONFIGURATION

Add your master to `sampleExcelGenerator.ts`:

```typescript
'your-master-id': {
  masterId: 'your-master-id',
  masterName: 'Your Master Name',
  columns: [
    'Column 1',
    'Column 2',
    // ... your columns
  ],
  sampleRows: [
    ['Sample 1 Col1', 'Sample 1 Col2'],
    ['Sample 2 Col1', 'Sample 2 Col2'],
    ['Sample 3 Col1', 'Sample 3 Col2'],
  ],
},
```

---

## ⚡ VALIDATION RULES

### File Validation
- ✅ Only .xlsx and .xls files
- ✅ Show selected file name
- ✅ Allow re-upload before confirmation

### Data Validation
- Show validation errors in preview
- Highlight missing required fields
- Prevent import if errors exist
- Clear error messages

### Opening Data Special Rules
- Show one-time import warning
- Lock data after confirmation
- Cannot re-import via Excel

---

## 🚫 DO NOT APPLY TO

- GRN screens
- Issue & Return screens
- WIP live movements
- Job Work live transactions
- Reports
- Live transaction screens

These screens should use their own transaction-specific UI patterns.

---

## 💡 BEST PRACTICES

1. **Consistent Terminology**
   - Use "Upload Excel" not "Import" or "Upload File"
   - Use "Download Sample Excel" not "Download Template"

2. **User Feedback**
   - Show file selection confirmation
   - Display row count in preview
   - Clear success/error messages

3. **Sample Data**
   - Always use realistic textile values
   - Include 2-3 rows minimum
   - Show all required columns
   - Add textile-specific examples (Fabric, Shade, Lot, etc.)

4. **Error Handling**
   - Catch file read errors
   - Validate column mapping
   - Highlight missing required fields
   - Provide actionable error messages

5. **Performance**
   - Preview limited to first 1000 rows if needed
   - Use pagination in preview
   - Async import for large files

---

## 🔧 TROUBLESHOOTING

### Issue: Excel columns not mapping correctly
**Solution:** Check column name spelling in `handleFileSelect` mapping

### Issue: Sample file not downloading
**Solution:** Ensure `xlsx` package is installed: `npm install xlsx`

### Issue: Preview modal not showing
**Solution:** Verify `previewModalOpen` state is set to `true` after file selection

### Issue: Import button disabled
**Solution:** Check for validation errors in preview data

---

## 📞 SUPPORT

For questions or issues with this implementation pattern:
1. Check this guide first
2. Review `FabricMaster.tsx` as reference implementation
3. Verify all required components are imported
4. Check console for errors

---

**Last Updated:** January 13, 2026
**Status:** Pattern established and tested ✅
**Next Steps:** Apply to remaining master screens
