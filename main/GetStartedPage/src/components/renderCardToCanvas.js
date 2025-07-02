import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';

export async function renderCardToCanvas(cardJSX) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '320px';
  container.style.height = '400px';
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(cardJSX);

  // Wait for render
  await new Promise(resolve => setTimeout(resolve, 100));

  const canvas = await html2canvas(container, { backgroundColor: null });
  root.unmount();
  document.body.removeChild(container);
  return canvas;
} 