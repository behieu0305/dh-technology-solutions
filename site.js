const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
});

navigation.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Mở menu');
});

document.getElementById('year').textContent = String(new Date().getFullYear());

function openEmail(subject, lines) {
  const address = 'cqh.techsolutions.company@gmail.com';
  window.location.href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function validatePhone(input) {
  const digits = input.value.replace(/\D/g, '');
  const formatAllowed = /^\+?[0-9 -]*$/.test(input.value);
  const valid = formatAllowed && digits.length >= 8 && digits.length <= 15;
  input.setCustomValidity(valid || !input.value ? '' : 'Vui lòng nhập số điện thoại gồm 8-15 chữ số.');
  return valid;
}

document.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener('input', () => validatePhone(input));
});

document.getElementById('contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const phoneInput = event.currentTarget.elements.phone;
  if (!validatePhone(phoneInput)) return phoneInput.reportValidity();
  const data = new FormData(event.currentTarget);
  openEmail(`Yêu cầu tư vấn từ ${data.get('name')}`, [
    `Họ tên: ${data.get('name')}`,
    `Điện thoại: ${data.get('phone')}`,
    `Công ty / quy mô: ${data.get('company') || ''}`,
    '',
    'Nhu cầu:',
    String(data.get('need') || '')
  ]);
  document.getElementById('contact-status').hidden = false;
});

document.getElementById('ticket-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const phoneInput = event.currentTarget.elements.phone;
  if (!validatePhone(phoneInput)) return phoneInput.reportValidity();
  const data = new FormData(event.currentTarget);
  const ticketId = `DH-${String(Math.floor(1000 + Math.random() * 9000))}`;
  openEmail(`[${ticketId}] Báo sự cố - ${data.get('company')}`, [
    `Mã tham chiếu: ${ticketId}`,
    `Công ty / hợp đồng: ${data.get('company')}`,
    `Người báo: ${data.get('name')}`,
    `Điện thoại: ${data.get('phone')}`,
    `Mức độ: ${data.get('severity')}`,
    '',
    'Mô tả:',
    String(data.get('need') || '')
  ]);
  const status = document.getElementById('ticket-status');
  status.textContent = `Đã yêu cầu mở cửa sổ soạn email hỗ trợ ${ticketId}. Vui lòng kiểm tra và bấm Gửi; nếu không thấy, gọi hotline hoặc dùng địa chỉ email ở cuối trang.`;
  status.hidden = false;
});
