const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();

  const markup = document.createElement('div');
  markup.classList = `alert alert--${type}`;
  markup.innerText = msg;

  document.querySelector('body').insertAdjacentElement('afterbegin', markup);

  setTimeout(hideAlert, 5000);
};

export default showAlert