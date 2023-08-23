export function shuffle<T>(array: T[]): T[] {
  const cloneArray = [...array];

  let currentIndex = cloneArray.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [cloneArray[currentIndex], cloneArray[randomIndex]] = [
      cloneArray[randomIndex],
      cloneArray[currentIndex],
    ];
  }

  return cloneArray;
}
