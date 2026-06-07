function createPipe() {

    let topPadding = 50;
    let bottomPadding = 50;

    let availableHeight =
        canvas.height - PIPE_GAP - topPadding - bottomPadding;

    let top = Math.random() * availableHeight + topPadding;

    pipes.push({
        x: canvas.width,
        top: top,
        bottom: top + PIPE_GAP,
        passed: false
    });
}