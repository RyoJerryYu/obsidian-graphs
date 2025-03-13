import { JSXGraph } from "jsxgraph";
import { Graph, GraphInfo } from "./types";
import { GraphBuilder } from "./types";
import { Utils } from "./utils";

export class GraphBuilderJessieCode implements GraphBuilder {
	utils: Utils = new Utils();

	source: string;
	constructor(private settingHeight: number, private settingWidth: number) {}
	parseCodeBlock(source: string): GraphInfo {
		this.source = source;
		let graph: GraphInfo = this.utils.defaultGraphInfo();
		// there is nothing inside of the codeblock
		if (source == null || source == "") {
			return graph;
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

			graph = {
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
			console.log(graph);
		} catch (e) {
			throw new SyntaxError(e);
		}
		return graph;
	}

	createBoard(graphDiv: HTMLElement, graphInfo: GraphInfo): Graph {
		const board = JSXGraph.initBoard(graphDiv, {
			boundingBox: graphInfo.bounds,
			maxBoundingBox: graphInfo.maxBoundingBox,
			drag: { enabled: graphInfo.drag },
			axis: graphInfo.axis,
			showNavigation: graphInfo.showNavigation,
			defaultAxes: graphInfo.defaultAxes,
			//@ts-ignore
			theme: "obsidian",
			keepAspectRatio: graphInfo.keepAspectRatio,
		});

		const graph: Graph = {
			board: board,
			createdElements: [],
			view3d: undefined,
		};

		// set graph width and height if specified
		if (graphInfo.height) {
			graphDiv.style.height = graphInfo.height + "px";
		}
		if (graphInfo.width) {
			graphDiv.style.maxWidth = graphInfo.width + "px";
		}

		if (this.source) {
			board.jc.parse(this.source);
		}

		return graph;
	}
}
