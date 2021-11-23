const nodeList = new Map();

document.addEventListener('click', (el) => {
  nodeList.forEach(fn => fn(el.target));
});

function createDocumentHandler(el, binding) {
  let fnList = [];
  if (Array.isArray(binding.value)) {
    fnList = binding.value;
  } else {
    fnList.push(binding.value);
  }
  return function (clickEl) {
    if (!el.contains(clickEl)) {
      fnList.forEach(fn => {
        fn(clickEl, el);
      });
    }
  };
}

const clickoutside = {
  beforeMount(el, binding) {
    nodeList.set(el, createDocumentHandler(el, binding));
  },
  unmounted(el) {
    nodeList.delete(el);
  },
};

export default clickoutside;
