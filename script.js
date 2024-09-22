document.querySelector('.glitch').addEventListener('mouseover', () => {
    document.querySelector('.glitch').style.transform = 'rotate(5deg)';
  });
  
  document.querySelector('.glitch').addEventListener('mouseleave', () => {
    document.querySelector('.glitch').style.transform = 'rotate(0deg)';
  });
  