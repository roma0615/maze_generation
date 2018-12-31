# Maze Generation
An implementation of [Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) to generate a maze.

Initially, there are walls surrounding each cell. Then, each wall is visited in a random order. The wall is removed if it separates two cells that are otherwise disjoint. By the end, all cells will be connected&mdash;i.e. it will possible to get from any cell to any other cell&mdash;and due to the random nature of how the walls are removed, a maze will have been generated.

[Try it here](https://roma0615.github.io/maze_generation/)!
