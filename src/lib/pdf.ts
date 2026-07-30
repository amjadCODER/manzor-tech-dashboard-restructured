import html2pdf from 'html2pdf.js'

export async function downloadContractPdf(element: HTMLElement, filename: string) {
  const options = {
    margin: [8, 8, 10, 8],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }
  await html2pdf().set(options).from(element).save()
}
