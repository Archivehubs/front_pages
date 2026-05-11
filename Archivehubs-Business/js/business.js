
/* ================================================================
   ARCHIVEHUBS — Business Page Script
   /Archivehubs-Business/js/business.js
   Load in business.html: <script type="module" src="js/business.js"></script>
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* Company type "Others" */
  const companyTypeSelect = document.getElementById('companyType');
  const otherTypeInput    = document.getElementById('otherTypeInput');
  if (companyTypeSelect && otherTypeInput) {
    otherTypeInput.style.display = 'none';
    companyTypeSelect.addEventListener('change', function () {
      const isOther = this.value === 'other';
      otherTypeInput.style.display = isOther ? 'block' : 'none';
      otherTypeInput.required      = isOther;
      if (!isOther) otherTypeInput.value = '';
    });
  }

  /* Logo upload */
  const logoUpload = document.getElementById('companyLogo');
  const uploadBox  = document.querySelector('.upload-box');
  logoUpload?.addEventListener('change', function (e) {
    const file     = e.target.files[0];
    if (!file) return;
    const allowed  = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) { alert('Please upload JPG or PNG only.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File must be under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { if (uploadBox) uploadBox.innerHTML = `<img src="${ev.target.result}" style="max-width:100%;max-height:200px">`; };
    reader.readAsDataURL(file);
  });

});