import { JSXGraph } from "jsxgraph";
import { Graph, GraphInfo } from "./types";
import { GraphBuilder } from "./types";
import { Utils } from "./utils";

export class GraphBuilderJessieCode implements GraphBuilder {
	utils: Utils = new Utils();

	source: string;
	graph: GraphInfo;
	constructor(private settingHeight: number, private settingWidth: number) {}
	parseCodeBlock(source: string) {
		this.source = source;
		this.graph = this.utils.defaultGraphInfo();
		// there is nothing inside of the codeblock
		if (source == null || source == "") {
			return this.graph;
		}

		try {
			const aspectRatio = this.settingWidth / this.settingHeight;
			let boundX = 10;
			let boundY = 10;

			if (aspectRatio > 1) {
				boundX = 10 * aspectRatio;
			} else {
				boundY = 10 * aspectRatio;
			}

			this.graph = {
				bounds: [-boundX, boundY, boundX, -boundY],
				maxBoundingBox: JXG.Options.board.maxBoundingBox,
				drag: true,
				showNavigation: true,
				axis: true,
				keepAspectRatio: false,
				defaultAxes: {
					xAxis: {
						min: -boundX,
						max: boundX,
						ticks: {
							steps: 1,
						},
					},
				},
			} as GraphInfo;
			console.log(this.graph);
		} catch (e) {
			throw new SyntaxError(e);
		}
		return this.graph;
	}

	createBoard(graphDiv: HTMLElement): Graph {
		const board = JSXGraph.initBoard(graphDiv, {
			boundingBox: this.graph.bounds,
			maxBoundingBox: this.graph.maxBoundingBox,
			drag: { enabled: this.graph.drag },
			axis: this.graph.axis,
			showNavigation: this.graph.showNavigation,
			defaultAxes: this.graph.defaultAxes,
			//@ts-ignore
			theme: "obsidian",
			keepAspectRatio: this.graph.keepAspectRatio,
		});

		const graph: Graph = {
			board: board,
			createdElements: [],
			view3d: undefined,
		};

		// set graph width and height if specified
		if (this.graph.height) {
			graphDiv.style.height = this.graph.height + "px";
		}
		if (this.graph.width) {
			graphDiv.style.maxWidth = this.graph.width + "px";
		}

		if (this.source) {
			board.jc.parse(this.source);
		}

		return graph;
	}
}
