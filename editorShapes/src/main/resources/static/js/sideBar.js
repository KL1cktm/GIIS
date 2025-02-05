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

toolButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        selectedTool = event.target.getAttribute('data-tool');

        if (selectedTool === 'Line2') {
            algorithmSelectorSecond.style.display = 'inline-block';
        } else {
            algorithmSelectorSecond.style.display = 'none';
        }
    });
});

algorithmButtonsSecond.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        selectLine2 = event.target.getAttribute('data-alg');
    });
});