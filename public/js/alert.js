export const hideAlert = () => {
  const el = document.querySelector('.login__alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  let markup = document.querySelector('#login__msg');
  markup.innerHTML = msg;
};


