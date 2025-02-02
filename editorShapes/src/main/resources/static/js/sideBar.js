toolButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        selectedTool = event.target.getAttribute('data-tool');

        if (selectedTool === 'Line') {
            algorithmSelector.style.display = 'inline-block';
        } else {
            algorithmSelector.style.display = 'none';
        }
    });
});

algorithmButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        selectAlgorithm = event.target.getAttribute('data-alg');
    });
});