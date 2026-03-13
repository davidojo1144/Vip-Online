const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');
const puppeteer = require('puppeteer');

(async () => {
  try {
    const pdf = await mdToPdf(
      { path: 'docs/case-study.md' },
      {
        dest: 'docs/case-study.pdf',
        launch_options: { executablePath: puppeteer.executablePath() },
      }
    );
    if (pdf) {
      fs.writeFileSync(pdf.filename, pdf.content);
      console.log('PDF generated at', pdf.filename);
    }
  } catch (e) {
    console.error('Failed to generate PDF:', e);
    process.exit(1);
  }
})();
