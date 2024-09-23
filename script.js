document.querySelector('.glitch').addEventListener('mouseover', () => {
  document.querySelector('.glitch').style.transform = 'rotate(5deg)';
});

document.querySelector('.glitch').addEventListener('mouseleave', () => {
  document.querySelector('.glitch').style.transform = 'rotate(0deg)';
});
const toggleButton = document.getElementById('theme-toggle');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});
