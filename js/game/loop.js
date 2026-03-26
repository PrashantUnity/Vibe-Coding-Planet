/**
 * @param {{ update: (time: number) => void }} game
 */
export function runGameLoop(game) {
  function animate() {
    requestAnimationFrame(animate);
    game.update(performance.now());
    game.render();
  }
  animate();
}
