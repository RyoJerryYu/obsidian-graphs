import { JSXGraph } from "jsxgraph";
import { Graph, GraphInfo } from "./types";
import { GraphBuilder } from "./types";
import { Utils } from "./utils";
import { default as matter } from "gray-matter";

export class GraphBuilderJessieCode implements GraphBuilder {
	utils: Utils = new Utils();

	initAttrs: Partial<JXG.BoardAttributes> = {};
	codeContent: string;
	height?: number;
	width?: number;
	constructor(private settingHeight: number, private settingWidth: number) {}
	parseCodeBlock(source: string) {
		// there is nothing inside of the codeblock
		if (source == null || source == "") {
			return;
		}

		try {
			const frontMatter = matter(source);
			this.codeContent = frontMatter.content || "";

			const height = frontMatter.data.height || this.settingHeight;
			const width = frontMatter.data.width || this.settingWidth;
			const aspectRatio = width / height;
			let boundX = 10;
			let boundY = 10;

			if (aspectRatio > 1) {
				boundX = 10 * aspectRatio;
			} else {
				boundY = 10 * aspectRatio;
			}

			this.initAttrs = {
				boundingBox: [-boundX, boundY, boundX, -boundY],
				grid: true,
				axis: true,
				//@ts-ignore
				theme: "obsidian",
				...frontMatter.data,
			};

			// compatibility with old code
			if (frontMatter.data.bounds) {
				this.initAttrs.boundingBox = frontMatter.data.bounds;
			}
			if (frontMatter.data.drag !== undefined) {
				this.initAttrs.drag = { enabled: frontMatter.data.drag };
			}
			if (frontMatter.data.height) {
				this.height = frontMatter.data.height;
			}
			if (frontMatter.data.width) {
				this.width = frontMatter.data.width;
			}

			console.log(this.codeContent);
			console.log(this.initAttrs);
		} catch (e) {
			throw new SyntaxError(e);
		}
	}

	createBoard(graphDiv: HTMLElement): Graph {
		const board = JSXGraph.initBoard(graphDiv, this.initAttrs);

		const graph: Graph = {
			board: board,
			createdElements: [],
			view3d: undefined,
		};

		// set graph width and height if specified
		if (this.height) {
			graphDiv.style.height = this.height + "px";
		}
		if (this.width) {
			graphDiv.style.maxWidth = this.width + "px";
		}

		if (this.codeContent) {
			board.jc.parse(this.codeContent);
		}

		return graph;
	}
}
