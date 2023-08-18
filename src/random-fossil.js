import axios from 'axios';

const getRandomFossilBtn = document.getElementById('getRandomFossilBtn');

getRandomFossilBtn.addEventListener('click', async () => {
  try {
    const response = await axios.get('/random-fossil.json');
    const randomFossil = response.data;

    const randomFossilImage = document.getElementById('random-fossil-image');
    randomFossilImage.innerHTML = `<img src="${randomFossil.img}" alt="${randomFossil.name}" />`;

    const randomFossilName = document.getElementById('random-fossil-name');
    randomFossilName.textContent = randomFossil.name;
  } catch (error) {
    console.error('Error fetching random fossil:', error);
  }
});
